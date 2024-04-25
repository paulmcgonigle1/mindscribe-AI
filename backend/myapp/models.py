# Create your models here.
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models.signals import post_save
from django.dispatch import receiver

from django_cryptography.fields import encrypt


# Model for Journal Entries
class JournalEntry(models.Model):
    entryID = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="journals")
    timestamp = models.DateTimeField(auto_now_add=True)
    # content = encrypt(models.TextField(null=True, default=None))
    content = models.TextField()
    # would need to store this as
    moodRating = models.IntegerField(default=0)

    def __str__(self):
        return f"Journal Entry {self.entryID} by {self.user.username}"


# Model for User Improvements (One per day)
class UserImprovement(models.Model):
    improvementId = models.AutoField(primary_key=True)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="improvement_plans"
    )
    date = models.DateField(default=timezone.now)  # Store just the date part
    timestamp = models.DateTimeField(auto_now_add=True)
    message_of_the_day = models.TextField(blank=True, null=True)
    additional_info = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Improvement Plan {self.improvementId} for {self.user.username}"

    class Meta:
        unique_together = ("user", "date")


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


class UserPreferences(models.Model):
    MESSAGE_TYPES = [
        ("poem", "Poem"),
        ("story", "Story"),
        ("quote", "Quote"),
        ("motivation", "Motivation"),
    ]
    MESSAGE_STYLES = [
        ("stoic", "Stoic"),
        ("funny", "Funny"),
        ("deep", "Deep"),
        ("insightful", "Insightful"),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="settings")
    is_personalised = models.BooleanField(default=False)
    preferred_type = models.CharField(
        max_length=50, choices=MESSAGE_TYPES, default="motivation"
    )
    preferred_style = models.CharField(
        max_length=50, choices=MESSAGE_STYLES, default="insightful"
    )
    # Add other settings fields as needed
    responseType = models.TextField(blank=True, null=True)
    companionType = models.TextField(blank=True, default="Terry")

    def __str__(self):
        return f"Preferences for {self.user.username}"


@receiver(post_save, sender=User)
def create_user_preferences(sender, instance, created, **kwargs):
    if created:
        UserPreferences.objects.create(user=instance)
