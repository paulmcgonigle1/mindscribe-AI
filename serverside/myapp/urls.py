from django.urls import path, include
from .views import (
    JournalEntryViewSet,
    DailyInsightsView,
    get_emotion_statistics,
)  # Import your views here
from . import authviews
from .improvements import (
    CreateImprovementWithTasksAndMessage,
    GetRecentImprovements,
)
from rest_framework.routers import DefaultRouter
from . import views


router = DefaultRouter()
router.register(r"journal-entries", views.JournalEntryViewSet, basename="journalentry")

urlpatterns = [
    path("", include(router.urls)),
    # Define the URL pattern for the MoodEntryListCreate view
    path(
        "journal-entries/user/<int:user_id>/",
        views.JournalEntryViewSet.as_view({"get": "list"}),
        name="user-journal-entries",
    ),
    path(
        "journal-entries/<int:pk>/insights/",
        views.JournalEntryViewSet.as_view({"get": "insights"}),
        name="journal-entry-insights",
    ),
    path(
        "daily-insights/<int:user_id>/<int:year>/<int:month>/<int:day>/",
        DailyInsightsView.as_view(),
        name="daily-insights",
    ),
    path(
        "create-improvements/<int:user_id>/",
        CreateImprovementWithTasksAndMessage.as_view(),
        name="create-improvements",
    ),
    path(
        "get-improvements/<int:user_id>/",
        GetRecentImprovements.as_view(),
        name="get-improvements",
    ),
    path(
        "emotions/<int:user_id>/",
        views.get_emotion_statistics,
        name="emotion-list-create",
    ),
    path("themes/<int:user_id>/", views.get_theme_statistics, name="theme-list-create"),
    path("analyze-data/<int:user_id>/", views.analyze_data, name="analyze-data"),
    # pointing to api folder
    path("", authviews.getRoutes),
]
