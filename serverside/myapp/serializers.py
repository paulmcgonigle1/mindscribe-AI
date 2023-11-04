from rest_framework import serializers
from .models import MoodEntry, JournalEntry  # Import other models as needed


class MoodEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = MoodEntry
        fields = "__all__"
