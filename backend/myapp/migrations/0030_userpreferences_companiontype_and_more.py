# Generated by Django 4.2.7 on 2024-04-25 22:20

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("myapp", "0029_alter_journalentry_content"),
    ]

    operations = [
        migrations.AddField(
            model_name="userpreferences",
            name="companionType",
            field=models.TextField(blank=True, default="Terry"),
        ),
        migrations.AlterField(
            model_name="journalentry",
            name="content",
            field=models.TextField(default=1),
            preserve_default=False,
        ),
    ]
