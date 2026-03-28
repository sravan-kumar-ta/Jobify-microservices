from django.urls import path
from .views import GenerateCoverLetterView

urlpatterns = [
    path("generate/", GenerateCoverLetterView.as_view(), name="generate-cover-letter"),
]
