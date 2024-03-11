from django.urls import path, include
from .views import (
    JournalEntryViewSet,
    DailyInsightsView,
    get_emotion_statistics,
    getJournals,
)  # Import your views here
from .authviews import MyTokenObtainPairView, getRoutes, register
from .improvements import (
    CreateImprovementWithTasksAndMessage,
    GetRecentImprovements,
    save_unsave_task,
    get_tasks_in_progress,
    update_task_completetion_status,
)
from rest_framework.routers import DefaultRouter
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r"journal-entries", views.JournalEntryViewSet, basename="journalentry")

urlpatterns = [
    path("", include(router.urls)),
    path(
        "daily-insights/<int:user_id>/<int:year>/<int:month>/<int:day>/",
        DailyInsightsView.as_view(),
        name="daily-insights",
    ),
    path(
        "create-improvements/",
        CreateImprovementWithTasksAndMessage.as_view(),
        name="create-improvements",
    ),
    path(
        "get-improvements/",
        GetRecentImprovements.as_view(),
        name="get-improvements",
    ),
    # gets all of the tracked tasks
    path(
        "get-tracked-tasks/",
        get_tasks_in_progress,
        name="get_tasks_in_progress",
    ),
    path(
        "emotions/",
        views.get_emotion_statistics,
        name="emotion-list-create",
    ),
    path("settings/", views.user_settings, name="user-settings"),
    path("preferences/", views.update_preferences, name="user-preferences"),
    path("themes/", views.get_theme_statistics, name="theme-list-create"),
    path("analyze-data/<int:user_id>/", views.analyze_data, name="analyze-data"),
    ###################################################
    # WORKING WITH AUTH AND LOGIN ETC
    # pointing to api folder
    path("", getRoutes),
    path("api/token/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/register/", register, name="register"),
    path("api/journals/", views.getJournals, name="get_journals"),
    path("api/createjournal/", views.createJournal, name="create_journal"),
    path(
        "api/journals/<int:entry_id>/insights/",
        views.get_insights_for_journal_entry,
        name="journal_insights",
    ),
    # for updating/saving task to 'in progress'
    path("api/savetask/<int:task_id>/", save_unsave_task, name="update_task_status"),
    # for setting task as complete
    path(
        "api/complete-task/<int:task_id>/",
        update_task_completetion_status,
        name="update_task_completetion_status",
    ),
]
