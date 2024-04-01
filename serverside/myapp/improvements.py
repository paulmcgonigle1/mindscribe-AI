import logging
from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from langchain.chains import create_extraction_chain
from langchain.chat_models import ChatOpenAI
from django.utils import timezone
from django.core.exceptions import MultipleObjectsReturned
from django.http import JsonResponse

import os
from .models import (
    Insight,
    User,
    UserImprovement,
    ActionableTask,
)
from .serializers import (
    ActionableTaskSerializer,
    InsightSerializer,
)
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response

logger = logging.getLogger(__name__)

today = timezone.now().date()  # Get today's date


class GetRecentImprovements(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        today = timezone.now().date()
        try:
            latest_improvement = UserImprovement.objects.get(user=user, date=today)
            tasks = ActionableTaskSerializer(
                latest_improvement.actionable_tasks.all().order_by("created_at")[:6],
                many=True,
            ).data

            return Response(
                {
                    "message": latest_improvement.message_of_the_day,
                    "tasks": tasks,
                    "created_at": latest_improvement.timestamp,
                }
            )

        except UserImprovement.DoesNotExist:
            return Response(
                {
                    "message": "No Improvements plan exists yet",
                    "tasks": [],
                    "created_at": None,
                },
                status=200,
            )


class CreateImprovementWithTasksAndMessage(APIView):

    def get(self, request):
        print(request)
        user = request.user  # Directly use the user object

        today = timezone.now().date()

        # Fetch today's insights for the user

        insights = Insight.objects.filter(entry__user=user, timestamp__date=today)
        serialized_insights = InsightSerializer(insights, many=True).data
        print("creating a new user Improvement message and tasks")
        # Create tasks and parse from today's insights
        # print("Creating tasks from insights")
        mental_health_tasks = create_tasks_from_insights(serialized_insights, user.id)
        # print("Now creating message of the day")
        message_of_the_day = create_message_of_the_day(user)
        return Response({"message": message_of_the_day, "tasks": mental_health_tasks})


def create_tasks_from_insights(insights, user_id):
    # this turns my extracted insights into readable strings
    formatted_insights = format_insights_for_prompt(insights)
    # this then uses these in a prompt with GPT
    prompt = prompt_with_insights(formatted_insights, user_id)

    # Get the unstructured tasks from OpenAI
    unstructured_tasks = interact_with_llm(prompt)
    # print("Unstructured Tasks : " + unstructured_tasks)
    # Parse the raw plan into distinct tasks
    mental_health_tasks = parse_raw_response_with_tasks(unstructured_tasks)

    user = User.objects.get(id=user_id)

    try:
        user_improvement, created = UserImprovement.objects.get_or_create(
            user=user,
            date=today,
            defaults={
                "message_of_the_day": "Your default quote or logic to set it",
                "additional_info": "Default notes or logic to set them",
            },
        )
    except MultipleObjectsReturned:
        user_improvement = UserImprovement.objects.filter(user=user, date=today).first()
        created = False  # Since we are fetching an existing instance

    # No need for if user_improvement is None check anymore, handled by try-except
    if not created:
        # If the user_improvement was not created (i.e., it already existed and was fetched)
        print("Okay trying to update")
        user_improvement.message_of_the_day = "Your updated quote or logic to set it"
        user_improvement.additional_info = "Updated notes or logic to set them"
    else:
        print("New user improvement created")

    user_improvement.save()  # Ensure we save any updates

    save_tasks_to_database(mental_health_tasks, user_improvement)

    return mental_health_tasks


def create_message_of_the_day(user):
    settings = user.settings
    preferred_type = settings.preferred_type
    preferred_style = settings.preferred_style
    # prompt with values from database

    prompt = (
        f"Generate a quick and short {preferred_type} in the style of {preferred_style} "
        f"as a personal message to {user.first_name} to help them with their day.\n\n"
    )

    # Generate the message using your LLM interaction function
    message = interact_with_llm(prompt)

    if message:
        try:
            # Use get_or_create to handle both existing and new UserImprovement objects
            user_improvement, created = UserImprovement.objects.get_or_create(
                user=user,
                date=today,
                defaults={
                    "message_of_the_day": message,
                    "additional_info": "Generated by AI",
                },
            )
        except UserImprovement.MultipleObjectsReturned:
            user_improvement = UserImprovement.objects.filter(
                user=user, date=today
            ).first()
            created = False

        # If the object was fetched (not created), update the message_of_the_day
        if not created:
            user_improvement.message_of_the_day = message
            user_improvement.save()

        # print("Message of the day: ", message)

    return message


def format_insights_for_prompt(insights):
    formatted_insights = ""
    for insight in insights:
        # Assuming insights have 'moods', 'sentiment', 'keywords', and 'key_themes' fields
        formatted_insights += f"Moods: {insight['moods']}, Sentiment: {insight['sentiment']}, Themes: {insight['key_themes']}.\n"
    return formatted_insights


def format_single_insight_for_prompt(insight):

    # Assuming insights have 'moods', 'sentiment', 'keywords', and 'key_themes' fields
    formatted_insight = (
        f"Moods: {insight.get('moods', 'No moods available')}, "
        f"Sentiment: {insight.get('sentiment', 'No sentiment available')}, "
        f"Themes: {insight.get('key_themes', 'No themes available')}.\n"
    )
    return formatted_insight


def prompt_with_insights(formatted_insights, user_id):
    user = User.objects.get(id=user_id)

    prompt = (
        f"I am an AI creating a list of and actionable tasks for improving my mental health, my name is {user.first_name}"
        "Format each task with a clear 'Task:' label followed by the task itself, and an 'Explanation:' label followed by a brief explanation of how it relates to the user's insights. "
        "Begin each new task on a new line.\n\n"
        "User's insights from today are as follows, dont mention these in the response:\n"
        f"{formatted_insights}\n\n"
        "Please generate the list of 5 actionable tasks, do not mention the number of the task ."
        "Again make sure they are formated like this 'Task: lorem upsum \n Explanation: lorem epsum lorem epsum' \n"
    )
    return prompt


def parse_raw_response_with_tasks(raw_plan):
    # Split the tasks using the 'Task:' delimiter, ignoring the first split if it's empty
    raw_tasks = [task for task in raw_plan.split("Task:") if task.strip()]

    parsed_tasks = []
    for raw_task in raw_tasks:
        # Split each task into task and explanation parts
        parts = raw_task.strip().split("Explanation:", 1)
        if len(parts) == 2:
            task, explanation = parts
            parsed_tasks.append(
                {"task": task.strip(), "explanation": explanation.strip()}
            )

    return parsed_tasks


def save_tasks_to_database(parsed_tasks, user_improvement):
    # print("Parsed tasks: ", parsed_tasks)
    if parsed_tasks:
        for task in parsed_tasks:
            try:
                # print("Saving Task:", task, "To Database")
                actionable_insight = ActionableTask(
                    improvement=user_improvement,
                    content=task["task"],
                    explanation=task["explanation"],
                )
                actionable_insight.save()
            except Exception as e:
                print(f"Error saving task: {e}, Task Data: {task}")

    else:
        print("No tasks were parsed")


# @permission_classes([IsAuthenticated])
@api_view(["PATCH"])
def save_unsave_task(request, task_id):
    try:
        task = ActionableTask.objects.get(taskId=task_id)
    except ActionableTask.DoesNotExist:
        return Response({"message": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

    # Assuming request.data contains {'inProgress': True} or similar
    serializer = ActionableTaskSerializer(task, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# makes the task status completed
@api_view(["PATCH"])
def update_task_completetion_status(request, task_id):

    task = ActionableTask.objects.get(taskId=task_id)
    task.isCompleted = True
    task.save()

    serializer = ActionableTaskSerializer(task)
    return Response(serializer.data)


@api_view(["GET"])
def get_tasks_in_progress(request):
    today = timezone.now().date()
    user = request.user  # Directly use the user object
    tasks = ActionableTask.objects.filter(improvement__user=user, inProgress=True)
    serializer = ActionableTaskSerializer(tasks, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def get_tasks_completed(request):
    today = timezone.now().date()
    user = request.user  # Directly use the user object
    tasks = ActionableTask.objects.filter(
        improvement__user=user, inProgress=False, isCompleted=True
    )
    serializer = ActionableTaskSerializer(tasks, many=True)
    return Response(serializer.data)


llm = ChatOpenAI(
    temperature=0,
    model="gpt-3.5-turbo",
    api_key=os.environ.get("OPENAI_API_KEY"),
)


# Extracts properties from journal to DB
def process_entry(journal_entry):
    # Create a dictionary with the required inputs
    inputs = {
        "user": "paul",  # The name of the user
        "input": journal_entry.content,  # The content of the journal entry
    }

    schema = {
        "properties": {
            "emotions": {"type": "string"},
            "sentiment": {"type": "string"},
            "themes": {"type": "string"},
        },
        "required": ["emotions", "sentiment", "themes"],
    }
    # extraction_prompt = ChatPromptTemplate.from_template(_CUSTOM_EXTRACTION_TEMPLATE)

    chain = create_extraction_chain(schema, llm, verbose=True)
    insights_data = chain.run(inputs)
    print("Insights data: ", insights_data)
    print("Type of insights data: ", type(insights_data))

    # Check if insights_data is a dictionary
    if isinstance(insights_data, list):
        # Process each dictionary of insights in the list
        for insight_data in insights_data:
            insight = Insight(
                entry=journal_entry,
                moods=insight_data.get("emotions", "no emotions found"),
                sentiment=insight_data.get("sentiment", "no sentiments found"),
                key_themes=insight_data.get("themes", "no themes"),
            )
            insight.save()
    else:
        print("Unexpected type for insights_data")


# Calls the LLM
def interact_with_llm(prompt):
    print("Interacting with LLM")
    response = llm.invoke(prompt)
    # Debugging: Print the response object to understand its structure
    # print("Response from GPT:", response)

    return response.content.strip()


@api_view(["GET"])
def createInsightMessage(request):
    today = timezone.now().date()
    user = request.user  # Directly use the user object
    latest_insight = (
        Insight.objects.filter(entry__user=user, timestamp__date=today)
        .order_by("-timestamp")
        .first()
    )
    if not latest_insight:
        return JsonResponse({"message": "No insights found for today."}, status=404)

    serialized_insight = InsightSerializer(latest_insight).data
    print(
        "type of serialized insight", type(serialized_insight)
    )  # Should show <class 'dict'> or <class 'OrderedDict'>

    formatted_insight = format_single_insight_for_prompt(serialized_insight)

    print("Now getting Insight Response")
    print(serialized_insight)
    # insights = "SAD, Failed Swim test, stressed out with college work"
    prompt = (
        f"Generate a quick message to help user {user.first_name} "
        f"to understand their insights as follows: {formatted_insight} .\n\n"
    )

    message = llm.invoke(prompt)
    # return response.content.strip()
    print(message)
    return Response({"message": message.content.strip()})
