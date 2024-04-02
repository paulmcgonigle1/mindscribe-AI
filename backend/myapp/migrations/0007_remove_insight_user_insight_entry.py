# Generated by Django 4.2.7 on 2023-12-18 17:45

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("myapp", "0006_journalentry_moodrating"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="insight",
            name="user",
        ),
        migrations.AddField(
            model_name="insight",
            name="entry",
            field=models.ForeignKey(
                default=1,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="insights",
                to="myapp.journalentry",
            ),
            preserve_default=False,
        ),
    ]