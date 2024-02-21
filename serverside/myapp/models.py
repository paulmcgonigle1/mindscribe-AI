# Create your models here.
from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission, User
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

default_user_id = 1  # Replace with an actual user ID from your database


# Model for Journal Entries
class JournalEntry(models.Model):
    entryID = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="journals")
    timestamp = models.DateTimeField(auto_now_add=True)
    content = models.TextField()
    moodRating = models.IntegerField(default=0)

    def __str__(self):
        return f"Journal Entry {self.entryID} by {self.user.username}"


# Model for User Improvements like tips, recommendations, etc.
class UserImprovement(models.Model):
    improvementId = models.AutoField(primary_key=True)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="improvement_plans"
    )
    timestamp = models.DateTimeField(auto_now_add=True)
    message_of_the_day = models.TextField(blank=True, null=True)
    additional_info = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Improvement Plan {self.improvementId} for {self.user.username}"


# Actionable insights instead of user improvements
class ActionableTask(models.Model):
    taskId = models.AutoField(primary_key=True)
    improvement = models.ForeignKey(
        UserImprovement, on_delete=models.CASCADE, related_name="actionable_tasks"
    )
    content = models.TextField(help_text="The actionable task text.")
    explanation = models.TextField(null=True)

    # below two are for tracking whether saved
    isCompleted = models.BooleanField(
        default=False, help_text="Whether the user has completed this action."
    )
    inProgress = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Actionable Insight {self.taskId} for Improvement Plan {self.improvement.improvementId}"

    class Meta:
        ordering = [
            "inProgress",
        ]  # Orders by most recent and then by relevance


# Model for Insights derived from Journal Entries
class Insight(models.Model):
    insightID = models.AutoField(primary_key=True)
    entry = models.ForeignKey(
        JournalEntry,
        on_delete=models.CASCADE,
        related_name="insights",
    )
    timestamp = models.DateTimeField(auto_now_add=True)
    keywords = models.TextField(blank=True, null=True)
    moods = models.TextField(blank=True, null=True)
    sentiment = models.TextField(blank=True, null=True)
    key_themes = models.TextField(blank=True, null=True)
    # Add more fields here as needed

    def __str__(self):
        if self.entry:
            return f"Insight {self.insightID} for Entry {self.entry.entryID}"
        else:
            return f"Insight {self.insightID} with no associated entry"
