from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import JournalEntry, Insight, UserImprovement
from .serializers import JournalEntrySerializer, InsightSerializer
from django.http import JsonResponse
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from langchain_app.views import process_entry
from .improvements import create_tasks_from_insights
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

    # def create(self, request, *args, **kwargs):
    #     response = super(JournalEntryViewSet, self).create(request, *args, **kwargs)
    #     print("Response: ", response.data)
    #     if response.status_code == status.HTTP_201_CREATED:
    #         journal_entry_id = response.data.get("entryID")
    #         journal_entry = JournalEntry.objects.get(entryID=journal_entry_id)
    #         process_entry(journal_entry)
    #     return response

    # def get_queryset(self):
    #     user_id = self.kwargs.get("user_id")  # Access user_id from URL parameters
    #     if user_id is not None:
    #         return JournalEntry.objects.filter(user=user_id)
    #     print("Got journal Entries")
    #     return JournalEntry.objects.all()

    # get insights for a particular journal entry
    @action(detail=True, methods=["get"])
    def insights(self, request, pk=None):
        """
        Retrieve insights for a specific journal entry.
        """
        journal_entry = self.get_object()
        insights = Insight.objects.filter(entry=journal_entry)
        serializer = InsightSerializer(insights, many=True)
        return Response(serializer.data)


class DailyInsightsView(APIView):
    def get(self, request, user_id, year, month, day):
        date = timezone.datetime(year, month, day).date()
        insights = Insight.objects.filter(entry__user__id=user_id, timestamp__date=date)
        serialized_insights = InsightSerializer(insights, many=True).data
        return Response(serialized_insights)


# following video on auth and tokens etc
# this gets the journals only for the authenticated user
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getJournals(request):
    user = request.user
    journals = user.journals.all()
    serializer = JournalEntrySerializer(journals, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_insights_for_journal_entry(request, entry_id):
    """
    Retrieve insights for a specific journal entry owned by the authenticated user.
    """
    # Ensure the journal entry exists and belongs to the authenticated user
    journal_entry = get_object_or_404(JournalEntry, pk=entry_id, user=request.user)

    # Fetch insights related to the journal entry
    insights = Insight.objects.filter(entry=journal_entry)
    serializer = InsightSerializer(insights, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def createJournal(request):
    data = request.data.copy()
    # Setting the user ID in the data to the current authenticated user's ID
    data["user"] = request.user.id
    serializer = JournalEntrySerializer(data=data)
    if serializer.is_valid():
        # Save the journal entry with the validated data
        serializer.save()
        # Optional: this is using my AI Model to process and extract
        process_entry(serializer.instance)
        # Return the created journal entry data with a 201 Created response
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        # If the data is not valid, return the errors with a 400 Bad Request response
        print(serializer.errors)  # Debugging line to print errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
