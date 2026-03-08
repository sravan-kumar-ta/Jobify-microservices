from django.urls import path
from rest_framework.routers import DefaultRouter

from seeker import views

router = DefaultRouter()
router.register(r'profile', views.SeekerProfileViewSet)
router.register(r'resume', views.ResumeViewSet)
router.register(r'experience', views.ExperienceViewSet)
router.register(r'education', views.EducationViewSet)

urlpatterns = [
                  path("skills/", views.SkillsView.as_view())
              ] + router.urls
