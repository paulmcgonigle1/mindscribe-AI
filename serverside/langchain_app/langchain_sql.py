from myapp.models import Insight
from myapp.serializers import InsightSerializer


def fetch_insights(user_id):
    insights = Insight.objects.filter(user_id=user_id)
    serialized_insights = InsightSerializer(insights, many=True).data
    return serialized_insights
