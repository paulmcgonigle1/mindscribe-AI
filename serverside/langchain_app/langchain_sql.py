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


# def create_plan_from_insights(insights):

#     return plan

# db_uri = "sqlite:////Users/paulmcgonigle/Documents/Year4/PR400/mindscribe-AI/serverside/db.sqlite3"
# db = SQLDatabase.from_uri(db_uri)

# agent_executor = create_sql_agent(
#     llm=ChatOpenAI(
#         temperature=0,
#         model="gpt-3.5-turbo",
#         api_key=os.environ.get("OPENAI_API_KEY"),
#     ),
#     toolkit=SQLDatabaseToolkit(
#         db=db,
#         llm=ChatOpenAI(
#             temperature=0,
#             model="gpt-3.5-turbo",
#             api_key=os.environ.get("OPENAI_API_KEY"),
#         ),
#     ),
#     verbose=True,
#     agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
# )

# agent_executor.run(
#     "What was user1s insights today?, from this, what can i do to make my mood better?",
#     handle_parsing_errors=True,
# )


# def init_sql_chain():
#     db = SQLDatabase.from_uri(db_uri)
#     llm = ChatOpenAI(
#         temperature=0,
#         model="gpt-3.5-turbo",
#         api_key=os.environ.get("OPENAI_API_KEY"),
#     )
#     return SQLDatabaseChain.from_llm(llm, db, verbose=True)


# def run_query(query):
#     db_chain = init_sql_chain()
#     return db_chain.run(query)


# if __name__ == "__main__":
#     sample_query = "How many journal entries are there?"
#     result = run_query(sample_query)
#     print("Query Result:", result)
