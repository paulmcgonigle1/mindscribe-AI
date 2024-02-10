from django.contrib import admin
from .models import (
    User,
    JournalEntry,
    UserImprovement,
    Insight,
    ActionableTask,
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
    list_display = ("entryID", "user", "timestamp")
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
        "timestamp",
        "message_of_the_day",
        "additional_info",
    )
    list_filter = ("timestamp",)


class ActionableTaskAdmin(admin.ModelAdmin):
    list_display = ("content", "isCompleted", "explanation")
    list_filter = ("content",)


class InsightAdmin(admin.ModelAdmin):
    list_display = [
        "insightID",
        "keywords",
        "timestamp",
    ]  # Update these fields based on your current model

    # list_filter = ("sentimentScore",)


# Register each model with its respective admin class
# admin.site.register(User, UserAdmin)
admin.site.register(JournalEntry, JournalEntryAdmin)
admin.site.register(UserImprovement, UserImprovementAdmin)
admin.site.register(Insight, InsightAdmin)
admin.site.register(ActionableTask, ActionableTaskAdmin)
