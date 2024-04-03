from django.contrib import admin
from django.urls import path, include

# from backend.myapp.views import ReactAppView

# updated import
urlpatterns = [
    path("admin/", admin.site.urls),
    # path("myapp/", include("backend.myapp.urls")),
    # path("", ReactAppView.as_view(), name="react-app"),
]
