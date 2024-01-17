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
            latest_plan = UserImprovement.objects.filter(user_id=user_id).latest(
                "timestamp"
            )
            tasks = ActionableTaskSerializer(
                latest_plan.actionable_tasks.all(), many=True
            ).data

            # Return the serialized tasks
            return Response(
                {
                    "message": latest_plan.message_of_the_day,
                    "tasks": tasks,
                    "created_at": latest_plan.timestamp,
                }
            )

        except UserImprovement.DoesNotExist:
            # Handle the case where no plan exists for the user
            return Response(
                {"error": "No mental health plan found for this user"},
                status=status.HTTP_404_NOT_FOUND,
            )


user_name = "paul"


class CreatePlanView(APIView):
    def get(self, request, user_id):
        # Get today's date
        today = timezone.now().date()

        # Fetch today's insights for the user
        insights = Insight.objects.filter(
            entry__user__id=user_id, timestamp__date=today
        )
        serialized_insights = InsightSerializer(insights, many=True).data

        # Create a mental health plan from today's insights
        mental_health_tasks = create_plan_from_insights(serialized_insights, user_id)
        message_of_the_day = create_message_of_the_day()
        return Response({"message": message_of_the_day, "tasks": mental_health_tasks})


def create_plan_from_insights(insights, user_id):
    formatted_insights = format_insights_for_prompt(insights)
    prompt = create_structured_prompt_with_insights(formatted_insights)

    # Get structured mental health plan from OpenAI
    mental_health_plan_raw = interact_with_llm(prompt)

    # Parse the raw plan into distinct tasks
    mental_health_tasks = parse_mental_health_plan(mental_health_plan_raw)
    # getting the user_ID to pass through so it can save to ActionableTask

    user = User.objects.get(id=user_id)
    user_improvement, created = UserImprovement.objects.get_or_create(
        user=user,
    )
    # Set the default values outside of get_or_create
    user_improvement.message_of_the_day = "Your default quote or logic to set it"
    user_improvement.additional_info = "Default notes or logic to set them"
    user_improvement.save()

    user_improvement.save()
    print("User improvement: ", user_improvement)
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
        "I am creating a list of distinct and actionable tasks for improving mood and mental health of user\n . "
        "Each task should be clearly numbered with an explanation of what to do and how it relates to that insight.\n\n"
        "User's insights from today:\n"
        f"{formatted_insights} and user name: {user_name} . mention in each task the user name and how the task relates to insight\n"
        "List of actionable tasks:"
    )
    return prompt


def parse_mental_health_plan(raw_plan):
    # Implement logic to parse the raw_plan into distinct tasks
    # Split the plan into sections
    pattern = re.compile(r"Task: (.+?) Explanation: (.+?)(?= Task:|$)", re.DOTALL)
    tasks_with_explanations = pattern.findall(raw_plan)
    # Create a list of dicts containing the task and its explanation
    parsed_tasks = [
        {"task": task.strip(), "explanation": explanation.strip()}
        for task, explanation in tasks_with_explanations
    ]
    return parsed_tasks


def save_tasks_to_database(parsed_tasks, user_improvement):
    for task in parsed_tasks:
        print("Task: ", task)
        actionable_insight = ActionableTask(
            improvement=user_improvement,
            content=task["task"],
            explanation=task["explanation"],
        )
        actionable_insight.save()
