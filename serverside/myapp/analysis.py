from django.http import JsonResponse
import pandas as pd
from .models import JournalEntry, Insight
import numpy as np
import scipy as sp


def perform_mood_and_emotion_analysis(user_id):
    print("Performing mood and emotion analysis")
    entries = JournalEntry.objects.filter(user__id=user_id).prefetch_related("insights")
    # Flatten the data
    data = []
    for entry in entries:
        for insight in entry.insights.all():
            if insight.key_themes:
                themes = insight.key_themes.split(",")
                for theme in themes:
                    data.append(
                        {"moodRating": entry.moodRating, "theme": theme.strip()}
                    )

    # Convert to DataFrame
    df = pd.DataFrame(data)

    # Create a frequency matrix
    frequency_matrix = pd.crosstab(df["moodRating"], df["theme"])

    # Optional: Normalize the data
    normalized_matrix = frequency_matrix.div(frequency_matrix.sum(axis=1), axis=0)

    # Convert to matrix format
    matrix = normalized_matrix.to_numpy()

    # Return matrix and column names (themes) for visualization
    return matrix, normalized_matrix.columns.tolist()


def analyze_data(request, user_id):
    try:
        matrix, themes = perform_mood_and_emotion_analysis(user_id)
        data = {
            "matrix": matrix.tolist(),  # Convert numpy array to list
            "themes": themes,
        }
        return JsonResponse(data, safe=False)  # Set safe to False
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
