from django.urls import path, include
from .views import MoodEntryListCreate, test_view  # Import your views here
from rest_framework.routers import DefaultRouter
from . import views


router = DefaultRouter()
router.register(r"journal-entries", views.JournalEntryViewSet)

urlpatterns = [
    path("", include(router.urls)),
    # Define the URL pattern for the MoodEntryListCreate view
    path(
        "moodentries/",
        MoodEntryListCreate.as_view(),
        name="mood-entries-list-create",
    ),
    # temp path for debugging
    path("test/", test_view, name="test")
    # You can add more paths for other views here...
]
