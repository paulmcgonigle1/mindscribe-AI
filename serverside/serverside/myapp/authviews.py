# following tutorial of authentication and authorization
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import RegisterSerializer


# got these from django simplejwt docs
# this is for what we are getting back in the jwt token when you login
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token["username"] = user.username
        # ...

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# method for user to sign in and get token
@api_view(["GET"])
def getRoutes(request):
    routes = [
        "/api/token",
        "/api/token/refresh",
    ]
    return Response(routes)


# method for user to sign up
@api_view(["POST"])
def register(request):
    if request.method == "POST":
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {"message": "User created successfully"}, status=status.HTTP_201_CREATED
            )
        else:
            # Log serializer errors
            print(
                serializer.errors
            )  # This line will print errors to your console or logs
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
