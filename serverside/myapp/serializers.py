from rest_framework import serializers
from .models import Insight, MoodEntry, JournalEntry  # Import other models as needed


class JournalEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = JournalEntry
        fields = ["entryID", "user", "timestamp", "content", "moodRating"]


class MoodEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = MoodEntry
        fields = "__all__"


class InsightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Insight
        fields = "__all__"
