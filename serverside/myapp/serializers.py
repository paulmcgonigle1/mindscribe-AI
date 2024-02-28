from rest_framework import serializers
from .models import (
    ActionableTask,
    Insight,
    JournalEntry,
    UserSettings,
)  # Import other models as needed


class JournalEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = JournalEntry
        fields = ["entryID", "user", "timestamp", "content", "moodRating"]


class InsightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Insight
        fields = "__all__"


class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = ["preferred_message_types", "preferred_message_styles"]


class ActionableTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActionableTask
        fields = "__all__"
