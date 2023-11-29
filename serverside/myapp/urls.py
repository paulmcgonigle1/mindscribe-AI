from django.urls import path, include
from .views import (
    CreatePlanView,
    MoodEntryListCreate,
    JournalEntryViewSet,
    DailyInsightsView,
    RecentMentalHealthPlanView,
)  # Import your views here
from rest_framework.routers import DefaultRouter
from . import views


router = DefaultRouter()
router.register(r"journal-entries", views.JournalEntryViewSet, basename="journalentry")

urlpatterns = [
    path("", include(router.urls)),
    # Define the URL pattern for the MoodEntryListCreate view
    path(
        "moodentries/",
        MoodEntryListCreate.as_view(),
        name="mood-entries-list-create",
    ),
    path(
        "daily-insights/<int:user_id>/<int:year>/<int:month>/<int:day>/",
        DailyInsightsView.as_view(),
        name="daily-insights",
    ),
    path("create-plan/<int:user_id>/", CreatePlanView.as_view(), name="create-plan"),
    path(
        "mental-health-plan/<int:user_id>/",
        RecentMentalHealthPlanView.as_view(),
        name="mental-health-plan",
    ),
]
