from django.shortcuts import render
from django.utils import timezone
from rest_framework import generics
from .models import MoodEntry, JournalEntry, Insight, UserImprovement
from .serializers import MoodEntrySerializer, JournalEntrySerializer, InsightSerializer
from django.http import JsonResponse
from rest_framework import viewsets, status
from rest_framework.views import APIView
from langchain_app.views import process_entry
from .improvements import create_plan_from_insights
from rest_framework.response import Response
from datetime import timedelta  # Will be used for date range queries
import logging
from .analysis import perform_mood_and_emotion_analysis

# Create your views here.
logger = logging.getLogger(__name__)


# class for creating journals
class JournalEntryViewSet(viewsets.ModelViewSet):
    serializer_class = JournalEntrySerializer
    queryset = JournalEntry.objects.all()

    def create(self, request, *args, **kwargs):
        response = super(JournalEntryViewSet, self).create(request, *args, **kwargs)
        print("Response: ", response.data)
        if response.status_code == status.HTTP_201_CREATED:
            journal_entry_id = response.data.get("entryID")
            journal_entry = JournalEntry.objects.get(entryID=journal_entry_id)
            process_entry(journal_entry)
        return response

    def get_queryset(self):
        user_id = self.kwargs.get("user_id")  # Access user_id from URL parameters
        if user_id is not None:
            return JournalEntry.objects.filter(user=user_id)
        print("Got journal Entries")
        return JournalEntry.objects.all()


class MoodEntryListCreate(generics.ListCreateAPIView):
    queryset = MoodEntry.objects.all()
    serializer_class = MoodEntrySerializer


class DailyInsightsView(APIView):
    def get(self, request, user_id, year, month, day):
        date = timezone.datetime(year, month, day).date()
        insights = Insight.objects.filter(entry__user__id=user_id, timestamp__date=date)
        serialized_insights = InsightSerializer(insights, many=True).data
        return Response(serialized_insights)


# Getting the emotion statistics
def get_emotion_statistics(request, user_id):
    # Get 'days' from request query parameters, default to 7 if not provided
    days = request.GET.get("days", 7)

    try:
        # Convert days to integer
        days = int(days)
    except ValueError:
        # Handle the case where 'days' is not a valid integer
        return JsonResponse({"error": "Invalid 'days' parameter"}, status=400)

    end_date = timezone.now()
    start_date = end_date - timedelta(days=days)

    insights = Insight.objects.filter(
        entry__user__id=user_id, timestamp__range=(start_date, end_date)
    )

    emotion_counts = {}
    for insight in insights:
        if insight.moods:
            emotions = insight.moods.split(",")
            for emotion in emotions:
                normalized_emotion = (
                    emotion.strip().lower()
                )  # Normalize the emotion string
                if normalized_emotion in emotion_counts:
                    emotion_counts[normalized_emotion] += 1
                else:
                    emotion_counts[normalized_emotion] = 1

    # Sort and limit the results
    sorted_limited_emotion_data = sorted(
        [
            {"emotion": emotion, "count": count}
            for emotion, count in emotion_counts.items()
        ],
        key=lambda x: x["count"],
        reverse=True,
    )[
        :10
    ]  # Adjust the number as needed

    return JsonResponse(sorted_limited_emotion_data, safe=False)


def get_theme_statistics(request, user_id):
    # Get 'days' from request query parameters, default to 7 if not provided
    days = request.GET.get("days", 7)

    try:
        # Convert days to integer
        days = int(days)
    except ValueError:
        # Handle the case where 'days' is not a valid integer
        return JsonResponse({"error": "Invalid 'days' parameter"}, status=400)

    end_date = timezone.now()
    start_date = end_date - timedelta(days=days)

    insights = Insight.objects.filter(
        entry__user__id=user_id, timestamp__range=(start_date, end_date)
    )

    theme_counts = {}
    for insight in insights:
        if insight.key_themes:
            themes = insight.key_themes.split(",")
            for theme in themes:
                normalized_theme = theme.strip().lower()  # Normalize the theme string
                if normalized_theme in theme_counts:
                    theme_counts[normalized_theme] += 1
                else:
                    theme_counts[normalized_theme] = 1

    # Sort and limit the results
    sorted_limited_theme_data = sorted(
        [{"theme": theme, "count": count} for theme, count in theme_counts.items()],
        key=lambda x: x["count"],
        reverse=True,
    )[
        :10
    ]  # Adjust the number as needed

    return JsonResponse(sorted_limited_theme_data, safe=False)


def analyze_data(request, user_id):
    try:
        matrix, themes = perform_mood_and_emotion_analysis(user_id)
        data = {
            "matrix": matrix.tolist(),  # Convert numpy array to list
            "themes": themes,
        }
        return JsonResponse(data, safe=False)  # Set safe to False
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
