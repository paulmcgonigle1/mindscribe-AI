from django.shortcuts import render
from rest_framework import generics
from .models import MoodEntry, JournalEntry
from .serializers import MoodEntrySerializer, JournalEntrySerializer
from django.http import JsonResponse
from rest_framework import viewsets


# Create your views here.
# Add this view temporarily to test your URL configuration.
def test_view(request):
    return JsonResponse({"status": "ok"}, safe=False)


class JournalEntryViewSet(viewsets.ModelViewSet):
    queryset = JournalEntry.objects.all()
    serializer_class = JournalEntrySerializer


# just creating a test view
class MoodEntryListCreate(generics.ListCreateAPIView):
    queryset = MoodEntry.objects.all()
    serializer_class = MoodEntrySerializer
