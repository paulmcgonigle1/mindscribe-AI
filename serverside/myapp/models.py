# Create your models here.
from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.utils.translation import gettext_lazy as _

default_user_id = 1  # Replace with an actual user ID from your database


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
    isCompleted = models.BooleanField(
        default=False, help_text="Whether the user has completed this action."
    )
    relevance = models.IntegerField(
        default=0,
        help_text="Relevance score of the insight based on user's current context.",
    )

    def __str__(self):
        return f"Actionable Insight {self.taskId} for Improvement Plan {self.improvement.improvementId}"

    class Meta:
        ordering = [
            "relevance",
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
