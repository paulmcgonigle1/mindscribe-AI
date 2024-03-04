from django.shortcuts import render
from myapp.models import JournalEntry, Insight, UserImprovement, User
from django.views.decorators.csrf import csrf_exempt
from langchain.chains import create_extraction_chain
from langchain.chat_models import ChatOpenAI
import os
import json
