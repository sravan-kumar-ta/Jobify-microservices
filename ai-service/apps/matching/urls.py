from django.urls import path
from .views import GenerateMatchV1View, GenerateMatchV2View

urlpatterns = [
    path("v1/generate/", GenerateMatchV1View.as_view(), name="generate-match-v1"),
    path("v2/generate/", GenerateMatchV2View.as_view(), name="generate-match-v2"),
]
