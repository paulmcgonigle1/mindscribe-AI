# following tutorial of authentication and authorization
from rest_framework.response import Response
from rest_framework.decorators import api_view


@api_view(["GET"])
def getRoutes(request):
    routes = [
        "/api/token",
        "/api/token/refresh",
    ]
    return Response(routes)
