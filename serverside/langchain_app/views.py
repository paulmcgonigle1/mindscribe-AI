from django.shortcuts import render
from myapp.models import JournalEntry, Insight
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from langchain.chains import create_extraction_chain
from langchain.chat_models import ChatOpenAI
import os
import json


def process_entry(journal_entry):
    llm = ChatOpenAI(
        temperature=0,
        model="gpt-3.5-turbo",
        api_key=os.environ.get("OPENAI_API_KEY"),
    )
    schema = {
        "properties": {
            "sentiment": {"type": "string"},
            "emotions": {"type": "string"},
            "stressLevel": {"type": "number"},
            "anxietyIndicator": {"type": "number"},
            "mood": {"type": "string"},
            "keywords": {"type": "string"},
        },
        # You can adjust 'required' based on your essential insights
        "required": ["sentiment", "emotions"],
    }

    chain = create_extraction_chain(schema, llm)
    insights_data = chain.run(journal_entry.content)

    # Create and save insights
    for insight_data in insights_data:
        # Map the insight data to the Insight model's fields
        insight = Insight(
            entry=journal_entry,
            insightText=insight_data.get("insightText", ""),
            sentimentScore=insight_data.get("sentimentScore", 0.0),
            mood=insight_data.get("mood", ""),
            stressLevel=insight_data.get("stressLevel", 0.0),
            anxietyIndicator=insight_data.get("anxietyIndicator", 0.0),
            keywords=insight_data.get("keywords", ""),
        )
        insight.save()


@csrf_exempt
def process_journal_entry(request):
    if request.method == "POST":
        data = json.loads(request.body)
        journal_entry_id = data.get("entryID")

        try:
            journal_entry = JournalEntry.objects.get(entryID=journal_entry_id)
            process_entry(journal_entry)
            return JsonResponse(
                {"message": "Entry processed and insights saved successfully"},
                status=201,
            )
        except JournalEntry.DoesNotExist:
            return JsonResponse({"error": "Entry does not exist"}, status=404)
    else:
        return JsonResponse({"error": "Invalid"}, status=400)
