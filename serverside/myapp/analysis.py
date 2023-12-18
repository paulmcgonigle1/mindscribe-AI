import pandas as pd
from .models import JournalEntry, Insight


def perform_mood_and_emotion_analysis(user_id):
    entries = JournalEntry.objects.filter(user__id=user_id).prefetch_related("insights")
    data = []
    for entry in entries:
        for insight in entry.insights.all():
            data.append(
                {
                    "mood_rating": entry.moodRating,
                    "emotions": insight.moods.split(", "),
                    "key_themes": insight.key_themes.split(", "),
                }
            )

    df = pd.DataFrame(data)
    df_emotions = df.explode("emotions")
    df_themes = df.explode("key_themes")

    # Calculate additional stats here...

    # Convert to custom JSON structure
    analysis_results = {
        "emotion_mood_correlation": custom_json_for_emotion(df_emotions),
        "theme_mood_correlation": custom_json_for_theme(df_themes),
    }

    return analysis_results


def custom_json_for_emotion(df_emotions):
    result = []
    for emotion in df_emotions["emotions"].unique():
        mood_ratings = df_emotions[df_emotions["emotions"] == emotion]["mood_rating"]
        mood_ratings_count = mood_ratings.value_counts().to_dict()

        # Convert keys and values to int
        mood_ratings_count = {int(k): int(v) for k, v in mood_ratings_count.items()}

        result.append(
            {
                "emotion": emotion,
                "mood_ratings": mood_ratings_count,
                "average_mood_rating": float(mood_ratings.mean()),  # Convert to float
                "total_occurrences": int(mood_ratings.count()),  # Convert to int
            }
        )
    return result


def custom_json_for_theme(df_themes):
    result = []
    for theme in df_themes["key_themes"].unique():
        mood_ratings = df_themes[df_themes["key_themes"] == theme]["mood_rating"]
        mood_ratings_count = mood_ratings.value_counts().to_dict()

        # Convert keys and values to int
        mood_ratings_count = {int(k): int(v) for k, v in mood_ratings_count.items()}

        result.append(
            {
                "theme": theme,
                "mood_ratings": mood_ratings_count,
                "average_mood_rating": float(mood_ratings.mean()),  # Convert to float
                "total_occurrences": int(mood_ratings.count()),  # Convert to int
            }
        )
    return result
