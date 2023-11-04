from django.urls import path
from .views import MoodEntryListCreate, test_view  # Import your views here

urlpatterns = [
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
