# Generated by Django 4.2.7 on 2023-11-21 11:44

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("myapp", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="insight",
            name="anxietyIndicator",
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="insight",
            name="keywords",
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="insight",
            name="mood",
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name="insight",
            name="stressLevel",
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]