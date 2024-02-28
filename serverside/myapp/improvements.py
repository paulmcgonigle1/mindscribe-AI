import logging
import re
from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action, api_view, permission_classes

from django.utils import timezone
from .models import (
    JournalEntry,
    Insight,
    User,
    UserImprovement,
    ActionableTask,
)
from .serializers import (
    ActionableTaskSerializer,
    JournalEntrySerializer,
    InsightSerializer,
)
from rest_framework import viewsets, status
from rest_framework.views import APIView
from langchain_app.views import (
    interact_with_llm,
    process_entry,
    create_message_of_the_day,
)
from rest_framework.response import Response
from .analysis import perform_mood_and_emotion_analysis

logger = logging.getLogger(__name__)


class GetRecentImprovements(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user  # Use the authenticated user
        try:
            latest_improvement = UserImprovement.objects.filter(user=user).latest(
                "timestamp"
            )
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
                {"error": "No mental health plan found for this user"},
                status=status.HTTP_404_NOT_FOUND,
            )


user_name = "paul"
style = "Marcus Aurelius"


class CreateImprovementWithTasksAndMessage(APIView):

    def get(self, request):
        print(request)
        user = request.user  # Directly use the user object

        today = timezone.now().date()

        # Fetch today's insights for the user

        insights = Insight.objects.filter(entry__user=user, timestamp__date=today)
        serialized_insights = InsightSerializer(insights, many=True).data

        # Create tasks and parse from today's insights
        print("Creating tasks from insights")
        mental_health_tasks = create_tasks_from_insights(serialized_insights, user.id)
        print("Now creating message of the day")
        message_of_the_day = create_message_of_the_day(user.id, user_name, style)
        return Response({"message": message_of_the_day, "tasks": mental_health_tasks})


def create_tasks_from_insights(insights, user_id):
    formatted_insights = format_insights_for_prompt(insights)
    prompt = create_structured_prompt_with_insights(formatted_insights)

    # Get unstructured tasks from OpenAI
    unstructured_tasks = interact_with_llm(prompt)
    print("Unstructured Tasks : " + unstructured_tasks)
    # Parse the raw plan into distinct tasks
    mental_health_tasks = parse_raw_response_with_tasks(unstructured_tasks)

    print(
        "Mental Health Tasks after parsing:\n"
        + "\n".join(str(task) for task in mental_health_tasks)
    )

    user = User.objects.get(id=user_id)  # Make sure this user exists

    # getting the user_ID to pass through so it can save to ActionableTask

    user_improvement, created = UserImprovement.objects.get_or_create(user=user)
    # Set the default values outside of get_or_create
    user_improvement.message_of_the_day = "Your default quote or logic to set it"
    user_improvement.additional_info = "Default notes or logic to set them"
    user_improvement.save()

    # print("User improvement: ", user_improvement)

    save_tasks_to_database(mental_health_tasks, user_improvement)

    return mental_health_tasks


def format_insights_for_prompt(insights):
    formatted_insights = ""
    for insight in insights:
        # Assuming insights have 'moods', 'sentiment', 'keywords', and 'key_themes' fields
        formatted_insights += f"Moods: {insight['moods']}, Sentiment: {insight['sentiment']}, Themes: {insight['key_themes']}.\n"
    return formatted_insights


def create_structured_prompt_with_insights(formatted_insights):
    user_name = "paul"
    prompt = (
        "I am an AI creating a list of 5 distinct and actionable tasks for improving the mood and mental health of a user named Paul. "
        "Please format each task with a clear 'Task:' label followed by the task itself, and an 'Explanation:' label followed by a brief explanation of how it relates to the user's insights. "
        "Begin each new task on a new line.\n\n"
        "User's insights from today are as follows:\n"
        f"{formatted_insights}\n\n"
        "Please generate the list of actionable tasks."
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
    print("Parsed tasks: ", parsed_tasks)
    if parsed_tasks:
        for task in parsed_tasks:
            try:
                print("Saving Task:", task, "To Database")
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
def update_task_status(request, task_id):
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
