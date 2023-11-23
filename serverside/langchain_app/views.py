from django.shortcuts import render
from myapp.models import JournalEntry, Insight
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from langchain.chains import create_extraction_chain
from langchain.chat_models import ChatOpenAI
from langchain.llms import openai
from langchain.output_parsers import PydanticOutputParser
from langchain.prompts import PromptTemplate
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
            "moods": {"type": "string"},
            "sentiment": {"type": "string"},
            "keywords": {"type": "string"},
            "key_themes": {"type": "string"},
        },
        "required": ["moods", "sentiment", "key"],
    }

    chain = create_extraction_chain(schema, llm)
    insights_data = chain.run(journal_entry.content)
    print("Insights data: ", insights_data)
    print("Type of insights data: ", type(insights_data))

    # Check if insights_data is a dictionary
    if isinstance(insights_data, list):
        # Process each dictionary of insights in the list
        for insight_data in insights_data:
            insight = Insight(
                moods=insight_data.get("moods", "no moods found"),
                sentiment=insight_data.get("sentiment", "no sentiments found"),
                keywords=insight_data.get(
                    "keywords", "no habits found"
                ),  # Update this if 'habits' key exists
                key_themes=insight_data.get("key_themes", "no themes"),
            )
            insight.save()
    else:
        print("Unexpected type for insights_data")


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
