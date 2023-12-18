# Generated by Django 4.2.7 on 2023-12-18 17:48

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("myapp", "0007_remove_insight_user_insight_entry"),
    ]

    operations = [
        migrations.AlterField(
            model_name="insight",
            name="entry",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="insights",
                to="myapp.journalentry",
            ),
        ),
    ]
