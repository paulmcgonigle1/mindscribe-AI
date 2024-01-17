from django.shortcuts import render
from myapp.models import JournalEntry, Insight, UserImprovement, User
from django.views.decorators.csrf import csrf_exempt
from langchain.chains import create_extraction_chain
from langchain.chat_models import ChatOpenAI
import os
import json

llm = ChatOpenAI(
    temperature=0,
    model="gpt-3.5-turbo",
    api_key=os.environ.get("OPENAI_API_KEY"),
)

user_id = 1
user_name = "paul"
style = "Marcus Aurelius"


# Extracts properties from journal to DB
def process_entry(journal_entry):
    # Create a dictionary with the required inputs
    inputs = {
        "user": user_name,  # The name of the user
        "input": journal_entry.content,  # The content of the journal entry
    }

    schema = {
        "properties": {
            "emotions": {"type": "string"},
            "sentiment": {"type": "string"},
            "themes": {"type": "string"},
        },
        "required": ["emotions", "sentiment", "themes"],
    }
    # extraction_prompt = ChatPromptTemplate.from_template(_CUSTOM_EXTRACTION_TEMPLATE)

    chain = create_extraction_chain(schema, llm, verbose=True)
    insights_data = chain.run(inputs)
    print("Insights data: ", insights_data)
    print("Type of insights data: ", type(insights_data))

    # Check if insights_data is a dictionary
    if isinstance(insights_data, list):
        # Process each dictionary of insights in the list
        for insight_data in insights_data:
            insight = Insight(
                entry=journal_entry,
                moods=insight_data.get("emotions", "no emotions found"),
                sentiment=insight_data.get("sentiment", "no sentiments found"),
                key_themes=insight_data.get("themes", "no themes"),
            )
            insight.save()
    else:
        print("Unexpected type for insights_data")


# Calls the LLM
def interact_with_llm(prompt):
    print("Interacting with LLM")
    response = llm.invoke(prompt)
    # Debugging: Print the response object to understand its structure
    print("Response object:", response)

    return response.content.strip()


def create_message_of_the_day():
    prompt = (
        "I am an AI mental health assistant, I write up a personal message to "
        + user_name
        + " to help them start their day in the style of "
        + style
        + "Mention the users name, and keep it short and sweet:\n\n"
    )
    message = interact_with_llm(prompt)

    if message:
        user_improvement = UserImprovement.objects.get(user__id=user_id)
        user_improvement.message_of_the_day = message
        user_improvement.save()
        print("Message of the day: ", message)
