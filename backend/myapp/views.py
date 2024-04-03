import os
from django.http import HttpResponse

import json
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.views import View

from django.conf import settings

from .models import JournalEntry, Insight, UserPreferences
from .serializers import (
    JournalEntrySerializer,
    InsightSerializer,
    UserPreferencesSerializer,
)
from django.http import JsonResponse
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

# from langchain_app.views import process_entry
from .improvements import create_tasks_from_insights, process_entry
from rest_framework.response import Response
from datetime import timedelta  # Will be used for date range queries
import logging

# Create your views here.
logger = logging.getLogger(__name__)


class ReactAppView(View):
    def get(self, request):
        try:
            with open(os.path.join(settings.VIEW_DIR, "index.html")) as file:
                return HttpResponse(file.read())
        except FileNotFoundError:
            return HttpResponse(
                f"""
                Settings BASE DIR = {settings.BASE_DIR}  
                Settings VIEW DIR = {settings.VIEW_DIR} 
                This page is not built yet. Please run 'npm run build' inside the 'clientside' directory.
                """,
                status=501,
            )


# class for creating journals
class JournalEntryViewSet(viewsets.ModelViewSet):
    serializer_class = JournalEntrySerializer
    queryset = JournalEntry.objects.all()

    # get insights for a particular journal entry
    @action(detail=True, methods=["get"])
    def insights(self, request, pk=None):
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


# functionality with my settings /preferences
@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def user_settings(request):
    user = request.user
    settings, created = UserPreferences.objects.get_or_create(user=user)

    if request.method == "GET":
        serializer = UserPreferencesSerializer(settings)
        print(Response(serializer.data))
        return Response(serializer.data)

    elif request.method == "PATCH":
        serializer = UserPreferencesSerializer(
            settings, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            print(Response(serializer.data))
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def update_preferences(request):
    print("entered the update_preferences")
    logger.debug("Entered the update_preferences FUNCTION but not the try")

    try:
        # Parse the request body to JSON
        data = json.loads(request.body)
        print("data:", data)
        logger.info("data: %s", data)
        logger.debug("Entered the update_preferences")

        # Assuming the user's ID is sent in the request
        user = request.user

        user_settings, created = UserPreferences.objects.get_or_create(user=user)

        # Update the User model fields
        user.first_name = data.get("firstName", user.first_name)
        user.last_name = data.get("lastName", user.last_name)
        user.save()

        # Update the UserSettings model fields
        user_settings.preferred_type = data.get(
            "preferred_type", user_settings.preferred_type
        )
        user_settings.preferred_style = data.get(
            "preferred_style", user_settings.preferred_style
        )
        user_settings.responseType = data.get(
            "responseType", user_settings.responseType
        )
        user_settings.is_personalised = data.get(
            "agreeToTerms", user_settings.is_personalised
        )
        user_settings.save()

        # Prepare and return the response
        response_data = {
            "firstName": user.first_name,
            "lastName": user.last_name,
            "preferred_type": user_settings.preferred_type,
            "preferred_style": user_settings.preferred_style,
            "responseType": user_settings.responseType,
            "agreeToTerms": user_settings.is_personalised,
        }

        return JsonResponse(response_data, status=200)
    except Exception as e:
        # Handle exceptions/errors
        return JsonResponse({"error": str(e)}, status=400)


# following video on auth and tokens etc
# this gets the all the journals  -- only for the authenticated user
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getJournals(request):
    user = request.user
    journals = user.journals.all()
    serializer = JournalEntrySerializer(journals, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def check_journal_for_today(request):
    user = request.user
    today = timezone.now().date()
    journal_exists = user.journals.filter(timestamp__date=today).exists()
    return Response({"journal_exists": journal_exists})


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
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_emotion_statistics(request):

    # Get 'days' from request query parameters, default to 7 if not provided
    days = request.GET.get("days", 7)
    # get the logged in user
    user = request.user
    try:
        # Convert days to integer
        days = int(days)
    except ValueError:
        # Handle the case where 'days' is not a valid integer
        return JsonResponse({"error": "Invalid 'days' parameter"}, status=400)

    end_date = timezone.now()
    start_date = end_date - timedelta(days=days)

    insights = Insight.objects.filter(
        entry__user__id=user.id, timestamp__range=(start_date, end_date)
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


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_theme_statistics(request):

    # getting 'days' from request query parameters, default to 7 if not provided
    days = request.GET.get("days", 7)

    try:
        # convert days to integer
        days = int(days)
    except ValueError:
        # handling the case where 'days' is not a valid integer
        return JsonResponse({"error": "Invalid 'days' parameter"}, status=400)

    # Use the logged-in user from the request
    if not request.user.is_authenticated:
        return JsonResponse({"error": "User not authenticated"}, status=401)

    # Since we're past the authentication check, request.user can safely be used.
    user = request.user  # Directly use the user object

    end_date = timezone.now()
    start_date = end_date - timedelta(days=days)

    insights = Insight.objects.filter(
        entry__user__id=user.id, timestamp__range=(start_date, end_date)
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
