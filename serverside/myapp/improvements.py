import re
from django.shortcuts import render
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


class GetRecentImprovements(APIView):
    def get(self, request, user_id):
        try:
            # Assuming 'recommendation' is the type for mental health plans
            latest_improvement = UserImprovement.objects.filter(user_id=user_id).latest(
                "timestamp"
            )
            # # Fetch only the last 8 tasks, for the demo purposes
            # last_5_tasks = latest_improvement.actionable_tasks.all().order_by(
            #     "created_at"
            # )[:5]

            # tasks = ActionableTaskSerializer(
            #     latest_improvement.actionable_tasks.all(), many=True
            # ).data
            tasks = ActionableTaskSerializer(
                latest_improvement.actionable_tasks.all().order_by("created_at")[:6],
                many=True,
            ).data
            # tasks = ActionableTaskSerializer(tasks, many=True).data

            # Return the serialized tasks
            return Response(
                {
                    "message": latest_improvement.message_of_the_day,
                    "tasks": tasks,
                    "created_at": latest_improvement.timestamp,
                }
            )

        except UserImprovement.DoesNotExist:
            # Handle the case where no plan exists for the user
            return Response(
                {"error": "No mental health plan found for this user"},
                status=status.HTTP_404_NOT_FOUND,
            )


user_name = "paul"


class CreateImprovementWithTasksAndMessage(APIView):
    def get(self, request, user_id):
        # Get today's date
        today = timezone.now().date()

        # Fetch today's insights for the user
        insights = Insight.objects.filter(
            entry__user__id=user_id, timestamp__date=today
        )
        serialized_insights = InsightSerializer(insights, many=True).data

        # Create tasks and parse from today's insights
        print("Creating tasks from insights")
        mental_health_tasks = create_tasks_from_insights(serialized_insights, user_id)
        print("Now creating message of the day")
        message_of_the_day = create_message_of_the_day()
        return Response({"message": message_of_the_day, "tasks": mental_health_tasks})


def create_tasks_from_insights(insights, user_id):
    formatted_insights = format_insights_for_prompt(insights)
    prompt = create_structured_prompt_with_insights(formatted_insights)

    # Get unstructured tasks from OpenAI
    unstructured_tasks = interact_with_llm(prompt)
    print("Unstructured Tasks" + unstructured_tasks)
    # Parse the raw plan into distinct tasks
    mental_health_tasks = parse_raw_response_with_tasks(unstructured_tasks)

    # getting the user_ID to pass through so it can save to ActionableTask
    user = User.objects.get(id=user_id)
    user_improvement, created = UserImprovement.objects.get_or_create(
        user=user,
    )
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
        "I am creating a list 5 of distinct and actionable tasks for improving mood and mental health of user\n . "
        "Each task should be clearly numbered with an explanation of what to do and how it relates to that insight.\n\n"
        "User's insights from today:\n"
        f"{formatted_insights} and user name: {user_name} . mention in each task explanation the user name and how the task relates to insight\n"
        "List of actionable tasks:"
    )
    return prompt


def parse_raw_response_with_tasks(raw_plan):
    # Adjusted regex pattern to handle variable whitespace and line breaks
    pattern = re.compile(r"Task:\s*(.+?)\s*Explanation:\s*(.+?)(?= Task:|$)", re.DOTALL)
    tasks_with_explanations = pattern.findall(raw_plan)

    parsed_tasks = [
        {"task": task.strip(), "explanation": explanation.strip()}
        for task, explanation in tasks_with_explanations
    ]
    return parsed_tasks


def save_tasks_to_database(parsed_tasks, user_improvement):
    print("Parsed tasks: ", parsed_tasks)
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
            print("Error saving task:", e)
