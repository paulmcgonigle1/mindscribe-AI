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

import logging

# Create your views here.
logger = logging.getLogger(__name__)


class JournalEntryViewSet(viewsets.ModelViewSet):
    serializer_class = JournalEntrySerializer
    queryset = JournalEntry.objects.all()

    def create(self, request, *args, **kwargs):
        response = super(JournalEntryViewSet, self).create(request, *args, **kwargs)
        if response.status_code == status.HTTP_201_CREATED:
            journal_entry_id = response.data.get("entryID")
            journal_entry = JournalEntry.objects.get(entryID=journal_entry_id)
            process_entry(journal_entry)
        return response

    def get_queryset(self):
        queryset = JournalEntry.objects.all()
        user_id = self.request.query_params.get("user")
        if user_id is not None:
            queryset = queryset.filter(user=user_id)
        return queryset


class MoodEntryListCreate(generics.ListCreateAPIView):
    queryset = MoodEntry.objects.all()
    serializer_class = MoodEntrySerializer


class DailyInsightsView(APIView):
    def get(self, request, user_id, year, month, day):
        date = timezone.datetime(year, month, day).date()
        insights = Insight.objects.filter(user_id=user_id, timestamp__date=date)
        serialized_insights = InsightSerializer(insights, many=True).data
        return Response(serialized_insights)


class CreatePlanView(APIView):
    def get(self, request, user_id):
        # Get today's date
        today = timezone.now().date()

        # Fetch today's insights for the user
        insights = Insight.objects.filter(user_id=user_id, timestamp__date=today)
        serialized_insights = InsightSerializer(insights, many=True).data

        # Create a mental health plan from today's insights
        mental_health_plan = create_plan_from_insights(serialized_insights, user_id)

        return Response({"plan": mental_health_plan})


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
            print("Latest plan: ", latest_plan)
            print("Latest plan : ", latest_plan.tipText)
            print("createdAt : ", latest_plan.timestamp)
            return Response(
                {"plan": latest_plan.tipText, "created_at": latest_plan.timestamp}
            )
        except UserImprovement.DoesNotExist:
            # Handle the case where no plan exists for the user
            return Response(
                {"error": "No mental health plan found for this user"},
                status=status.HTTP_404_NOT_FOUND,
            )
