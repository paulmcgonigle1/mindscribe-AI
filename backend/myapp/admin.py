from django.contrib import admin
from .models import (
    JournalEntry,
    UserImprovement,
    Insight,
    ActionableTask,
    UserPreferences,
)


# Define inline admin classes for related models
class InsightInline(admin.StackedInline):
    model = Insight
    extra = 0  # You can set this to 0 if you don't want extra empty forms


# Define the admin classes for each model
class UserAdmin(admin.ModelAdmin):
    list_display = ("username", "email", "is_staff")
    search_fields = ("username", "email")
    # inlines = [InsightInline]


class JournalEntryAdmin(admin.ModelAdmin):
    list_display = ("entryID", "user", "timestamp", "content")
    list_filter = ("timestamp",)
    inlines = [InsightInline]


class EmotionAdmin(admin.ModelAdmin):
    list_display = ("emotionID", "entry", "emotionType")
    list_filter = ("emotionType",)


class MoodEntryAdmin(admin.ModelAdmin):
    list_display = ("moodEntryID", "user", "timestamp", "moodRating")
    list_filter = ("moodRating", "timestamp")


class UserImprovementAdmin(admin.ModelAdmin):
    list_display = (
        "improvementId",
        "user",
        "date",
        "timestamp",
        "message_of_the_day",
        "additional_info",
    )
    list_filter = ("timestamp",)


class ActionableTaskAdmin(admin.ModelAdmin):
    list_display = ("taskId", "content", "explanation", "isCompleted", "inProgress")
    list_filter = ("content",)


class InsightAdmin(admin.ModelAdmin):
    list_display = [
        "insightID",
        "keywords",
        "timestamp",
    ]  # Update these fields based on your current model


class PreferencesAdmin(admin.ModelAdmin):
    list_display = (
        "is_personalised",
        "preferred_type",
        "preferred_style",
        "responseType",
    )


# Register each model with its respective admin class
# admin.site.register(User, UserAdmin)
admin.site.register(JournalEntry, JournalEntryAdmin)
admin.site.register(UserImprovement, UserImprovementAdmin)
admin.site.register(Insight, InsightAdmin)
admin.site.register(ActionableTask, ActionableTaskAdmin)
admin.site.register(UserPreferences, PreferencesAdmin)
