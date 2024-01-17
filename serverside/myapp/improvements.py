from django.shortcuts import render
from django.utils import timezone
from rest_framework import generics
from .models import MoodEntry, JournalEntry, Insight, UserImprovement
from .serializers import MoodEntrySerializer, JournalEntrySerializer, InsightSerializer
from django.http import JsonResponse
from rest_framework import viewsets, status
from rest_framework.views import APIView
from langchain_app.views import create_plan_from_insights, process_entry
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
