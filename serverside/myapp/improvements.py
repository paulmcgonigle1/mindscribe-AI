from django.shortcuts import render
from django.utils import timezone
from rest_framework import generics
from .models import (
    MoodEntry,
    JournalEntry,
    Insight,
    User,
    UserImprovement,
    ActionableInsight,
)
from .serializers import MoodEntrySerializer, JournalEntrySerializer, InsightSerializer
from django.http import JsonResponse
from rest_framework import viewsets, status
from rest_framework.views import APIView
from langchain_app.views import (
    interact_with_llm,
    process_entry,
)
from rest_framework.response import Response
from datetime import timedelta  # Will be used for date range queries
import logging
from .analysis import perform_mood_and_emotion_analysis


class RecentMentalHealthPlanView(APIView):
    """
    API view to fetch the most recent mental health plan for a given user.
    """

    def get(self, request, user_id):
        try:
            # Assuming 'recommendation' is the type for mental health plans
            latest_plan = UserImprovement.objects.filter(
                user_id=user_id, tipType="recommendation"
            ).latest("timestamp")

            return Response(
                {"plan": latest_plan.tipText, "created_at": latest_plan.timestamp}
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
        mental_health_plan = create_plan_from_insights(serialized_insights, user_id)

        return Response({"plan": mental_health_plan})


def create_plan_from_insights(insights, user_id):
    formatted_insights = format_insights_for_prompt(insights)
    prompt = create_structured_prompt_with_insights(formatted_insights)

    # Get structured mental health plan from OpenAI
    mental_health_plan_raw = interact_with_llm(prompt)

    # Parse the raw plan into distinct tasks
    mental_health_tasks = parse_mental_health_plan(mental_health_plan_raw)

    # Save tasks to UserImprovement database
    save_tasks_to_database(mental_health_tasks, user_id)

    return mental_health_tasks


def parse_mental_health_plan(raw_plan):
    # Implement logic to parse the raw_plan into distinct tasks
    # Example: split the text based on bullets or numbers
    print("Raw mental health plan: " + raw_plan)
    tasks = raw_plan.split("\n")  # Simple example, consider more robust parsing
    return [task for task in tasks if task.strip()]  # Filter out empty lines


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


def format_insights_for_prompt(insights):
    formatted_insights = ""
    for insight in insights:
        # Assuming insights have 'moods', 'sentiment', 'keywords', and 'key_themes' fields
        formatted_insights += f"Moods: {insight['moods']}, Sentiment: {insight['sentiment']}, Themes: {insight['key_themes']}.\n"
    return formatted_insights


def save_tasks_to_database(tasks, user_id):
    for task in tasks:
        actionable_insight = ActionableInsight(
            user=User.objects.get(id=user_id),
            content=task,
        )
        actionable_insight.save()
