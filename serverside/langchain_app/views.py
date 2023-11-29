from django.shortcuts import render
from myapp.models import JournalEntry, Insight, UserImprovement, User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from langchain.chains import create_extraction_chain
from langchain.chat_models import ChatOpenAI
from langchain.llms import openai
from langchain.output_parsers import PydanticOutputParser
from langchain.prompts import PromptTemplate
import os
import json

llm = ChatOpenAI(
    temperature=0,
    model="gpt-3.5-turbo",
    api_key=os.environ.get("OPENAI_API_KEY"),
)

user_id = 1


def process_entry(journal_entry):
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


def interact_with_llm(prompt):
    print("Interacting with LLM")
    response = llm.invoke(prompt)
    # Debugging: Print the response object to understand its structure
    print("Response object:", response)

    return response.content.strip()


def create_plan_from_insights(insights, user_id):
    formatted_insights = format_insights_for_prompt(insights)
    # create prompt
    prompt = create_prompt_with_insights(formatted_insights)

    # get mental health plan from openAI
    mental_health_plan = interact_with_llm(prompt)

    # Save mental_health_plan to UserImprovement database

    user_improvement = UserImprovement(
        user=User.objects.get(id=user_id),
        tipType="recommendation",
        tipText=mental_health_plan,
    )
    user_improvement.save()

    return mental_health_plan


def format_insights_for_prompt(insights):
    formatted_insights = ""
    for insight in insights:
        # Assuming insights have 'moods', 'sentiment', 'keywords', and 'key_themes' fields
        formatted_insights += f"Moods: {insight['moods']}, Sentiment: {insight['sentiment']}, Keywords: {insight['keywords']}, Themes: {insight['key_themes']}.\n"
    return formatted_insights


def create_prompt_with_insights(formatted_insights):
    prompt = (
        "I am an AI mental health assistant providing personalized advice based on a user's daily insights. "
        "It is important to tailor the recommendations specifically to the user's moods, sentiments, keywords, and themes from today. "
        "For each suggestion, include reasons why it would be beneficial for the user's specific situation.\n\n"
        "User's insights from today:\n"
        f"{formatted_insights}\n"
        "Based on these insights, what specific activities or practices should the user consider for improving their mood and mental health, and why would these be particularly effective in their case?"
    )
    return prompt
