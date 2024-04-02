from django.contrib import admin
from django.urls import path, include

# from myapp.views import ReactAppView

urlpatterns = [
    path("admin/", admin.site.urls),
    # path("myapp/", include("myapp.urls")),
    # path("", ReactAppView.as_view(), name="react-app"),
]
