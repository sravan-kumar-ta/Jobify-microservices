from django.urls import path
from .views import GenerateMatchView

urlpatterns = [
    path("generate/", GenerateMatchView.as_view(), name="generate-match"),
]
