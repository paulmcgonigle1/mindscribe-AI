# Create your models here.
from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.utils.translation import gettext_lazy as _


# inherits AbstractUser --djangos built-in user model providing authentication fields
class User(AbstractUser):
    # Additional fields go here

    # overriding the groups and user_permissions from 'AbstarctUser' to resolve conflicts

    groups = models.ManyToManyField(
        Group,
        verbose_name=_("groups"),
        blank=True,
        help_text=_(
            "The groups this user belongs to. A user will get all permissions granted to each of their groups."
        ),
        related_name="custom_user_groups",  # Unique related_name
        related_query_name="user",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name=_("user permissions"),
        blank=True,
        help_text=_("Specific permissions for this user."),
        related_name="custom_user_permissions",  # Unique related_name
        related_query_name="user",
    )
    # if no additional fields are added , use pass
    pass


# Model for Journal Entries
class JournalEntry(models.Model):
    entryID = models.AutoField(primary_key=True)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="journal_entries"
    )
    timestamp = models.DateTimeField(auto_now_add=True)
    content = models.TextField()

    def __str__(self):
        return f"Journal Entry {self.entryID} by {self.user.username}"


# Model for Emotions detected in Journal Entries
class Emotion(models.Model):
    emotionID = models.AutoField(primary_key=True)
    entry = models.ForeignKey(
        JournalEntry, on_delete=models.CASCADE, related_name="emotions"
    )
    emotionType = models.CharField(max_length=100)

    def __str__(self):
        return f"Emotion {self.emotionType} for Entry {self.entry.entryID}"


# Model for Mood Entries
class MoodEntry(models.Model):
    moodEntryID = models.AutoField(primary_key=True)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="mood_entries"
    )
    timestamp = models.DateTimeField(auto_now_add=True)
    moodRating = models.IntegerField()
    note = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Mood Entry {self.moodEntryID} by {self.user.username}"


# Model for User Improvements like tips, recommendations, etc.
class UserImprovement(models.Model):
    tipId = models.AutoField(primary_key=True)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="user_improvements"
    )
    timestamp = models.DateTimeField(auto_now_add=True)
    tipText = models.TextField()
    TIP_TYPES = [
        ("quote", "Quote"),
        ("recommendation", "Recommendation"),
        ("tip", "Tip"),
    ]
    tipType = models.CharField(max_length=20, choices=TIP_TYPES)
    isActive = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.tipType.title()} for {self.user.username}"


# Model for Insights derived from Journal Entries
class Insight(models.Model):
    insightID = models.AutoField(primary_key=True)
    entry = models.ForeignKey(
        JournalEntry, on_delete=models.CASCADE, related_name="insights"
    )
    insightText = models.TextField()
    sentimentScore = models.FloatField()
    mood = models.CharField(max_length=100, blank=True, null=True)
    stressLevel = models.CharField(max_length=100, blank=True, null=True)
    anxietyIndicator = models.TextField(blank=True, null=True)
    keywords = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Insight for Entry {self.entry.entryID}"
