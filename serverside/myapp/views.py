from django.shortcuts import render
from rest_framework import generics
from .models import MoodEntry, JournalEntry
from .serializers import MoodEntrySerializer, JournalEntrySerializer
from django.http import JsonResponse
from rest_framework import viewsets, status
from langchain_app.views import process_entry
import logging

# Create your views here.
logger = logging.getLogger(__name__)


class JournalEntryViewSet(viewsets.ModelViewSet):
    serializer_class = JournalEntrySerializer
    queryset = JournalEntry.objects.all()

    def create(self, request, *args, **kwargs):
        response = super(JournalEntryViewSet, self).create(request, *args, **kwargs)
        if response.status_code == status.HTTP_201_CREATED:
            journal_entry_id = response.data.get("entryID")
            journal_entry = JournalEntry.objects.get(entryID=journal_entry_id)
            process_entry(journal_entry)
        return response

    def get_queryset(self):
        queryset = JournalEntry.objects.all()
        user_id = self.request.query_params.get("user")
        if user_id is not None:
            queryset = queryset.filter(user=user_id)
        return queryset


class MoodEntryListCreate(generics.ListCreateAPIView):
    queryset = MoodEntry.objects.all()
    serializer_class = MoodEntrySerializer
