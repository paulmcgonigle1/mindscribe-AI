from langchain.llms import OpenAI
from langchain.utilities import SQLDatabase
from langchain_experimental.sql import SQLDatabaseChain
from langchain.chat_models import ChatOpenAI
from langchain.agents import create_sql_agent
from langchain.agents.agent_toolkits import SQLDatabaseToolkit
from myapp.models import Insight
from myapp.serializers import InsightSerializer
from langchain.agents.agent_types import AgentType
from django.conf import settings
import os
import django


def fetch_insights(user_id):
    insights = Insight.objects.filter(user_id=user_id)
    serialized_insights = InsightSerializer(insights, many=True).data
    return serialized_insights
