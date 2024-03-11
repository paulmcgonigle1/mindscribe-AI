# Generated by Django 4.2.7 on 2024-03-08 18:48

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("myapp", "0025_usersettings_is_peronsalized_complete"),
    ]

    operations = [
        migrations.CreateModel(
            name="UserPreferences",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("is_peronsalized_complete", models.BooleanField(default=False)),
                (
                    "preferred_type",
                    models.CharField(
                        choices=[
                            ("poem", "Poem"),
                            ("story", "Story"),
                            ("quote", "Quote"),
                            ("motivation", "Motivation"),
                        ],
                        default="motivation",
                        max_length=50,
                    ),
                ),
                (
                    "preferred_style",
                    models.CharField(
                        choices=[
                            ("stoic", "Stoic"),
                            ("funny", "Funny"),
                            ("deep", "Deep"),
                            ("insightful", "Insightful"),
                        ],
                        default="insightful",
                        max_length=50,
                    ),
                ),
                ("responseType", models.TextField(blank=True, null=True)),
                (
                    "user",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="settings",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.DeleteModel(
            name="UserSettings",
        ),
    ]
