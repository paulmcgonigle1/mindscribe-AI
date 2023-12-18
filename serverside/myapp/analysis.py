import pandas as pd
from .models import JournalEntry, Insight


def perform_mood_and_emotion_analysis(user_id):
    # Fetching data
    entries = JournalEntry.objects.filter(user__id=user_id).prefetch_related("insights")
    data = []
    for entry in entries:
        for insight in entry.insights.all():
            data.append(
                {
                    "mood_rating": entry.moodRating,
                    "emotions": insight.moods.split(
                        ", "
                    ),  # Use 'insight', not 'entry.insight'
                    "key_themes": insight.key_themes.split(
                        ", "
                    ),  # Use 'insight', not 'entry.insight'
                }
            )

    df = pd.DataFrame(data)

    # Analyzing Mood and Emotion Correlation
    df_emotions = df.explode("emotions")
    emotion_mood_correlation = (
        df_emotions.groupby(["emotions", "mood_rating"]).size().unstack(fill_value=0)
    )

    # Analyzing Key Theme Correlation
    df_themes = df.explode("key_themes")
    theme_mood_correlation = (
        df_themes.groupby(["key_themes", "mood_rating"]).size().unstack(fill_value=0)
    )

    # Visualization (Optional, depending on your setup)
    # For example, using seaborn or matplotlib to create heatmaps

    # Preparing results
    analysis_results = {
        "emotion_mood_correlation": emotion_mood_correlation.to_dict(),
        "theme_mood_correlation": theme_mood_correlation.to_dict(),
    }
    print(analysis_results)
    return analysis_results
