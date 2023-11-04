from django.shortcuts import render
from rest_framework import generics
from .models import MoodEntry
from .serializers import MoodEntrySerializer
from django.http import JsonResponse


# Create your views here.
# Add this view temporarily to test your URL configuration.
def test_view(request):
    return JsonResponse({"status": "ok"}, safe=False)


# just creating a test view
class MoodEntryListCreate(generics.ListCreateAPIView):
    queryset = MoodEntry.objects.all()
    serializer_class = MoodEntrySerializer
