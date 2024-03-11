from rest_framework import serializers
from .models import (
    ActionableTask,
    Insight,
    JournalEntry,
    UserPreferences,
)  # Import other models as needed

from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password


class JournalEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = JournalEntry
        fields = ["entryID", "user", "timestamp", "content", "moodRating"]


class InsightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Insight
        fields = "__all__"


class UserPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreferences
        fields = "__all__"


class ActionableTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActionableTask
        fields = "__all__"


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password2 = serializers.CharField(
        write_only=True, required=True, label="Confirm password"
    )

    class Meta:
        model = User
        fields = ("username", "password", "password2", "email")
        extra_kwargs = {
            "username": {"required": True},
            "email": {"required": True},
        }

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )

        return attrs

    def create(self, validated_data):
        validated_data.pop("password2")
        user = User.objects.create_user(**validated_data)
        return user
