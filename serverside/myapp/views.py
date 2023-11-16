from django.shortcuts import render
from rest_framework import generics
from .models import MoodEntry, JournalEntry
from .serializers import MoodEntrySerializer, JournalEntrySerializer
from django.http import JsonResponse
from rest_framework import viewsets


# Create your views here.


class JournalEntryViewSet(viewsets.ModelViewSet):
    serializer_class = JournalEntrySerializer
    queryset = JournalEntry.objects.all()

    def get_queryset(self):
        queryset = JournalEntry.objects.all()
        user_id = self.request.query_params.get("user")
        if user_id is not None:
            queryset = queryset.filter(user=user_id)
        return queryset


class MoodEntryListCreate(generics.ListCreateAPIView):
    queryset = MoodEntry.objects.all()
    serializer_class = MoodEntrySerializer
