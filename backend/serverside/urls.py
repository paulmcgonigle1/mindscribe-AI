from django.contrib import admin
from django.urls import path, include, re_path

from myapp.views import ReactAppView

# updated import
urlpatterns = [
    path("admin/", admin.site.urls),
    path("myapp/", include("myapp.urls")),
    re_path(r"^.*$", ReactAppView.as_view(), name="react-app"),
]
