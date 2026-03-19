from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from seeker import serializers
from seeker.models import SeekerProfile, Experience, Resume, Skills, Education
from seeker.permissions import IsAdminOrOwner, IsInternalService
from .selectors import build_seeker_matching_payload


class SeekerProfileViewSet(viewsets.ModelViewSet):
    queryset = SeekerProfile.objects.all()
    serializer_class = serializers.SeekerProfileSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['GET', 'PATCH'], permission_classes=[IsAuthenticated])
    def my_profile(self, request):
        obj, created = SeekerProfile.objects.get_or_create(user_id=request.user.id)

        if request.method == 'GET':
            serializer = self.get_serializer(obj)
            return Response(serializer.data, status=status.HTTP_200_OK)

        elif request.method == 'PATCH':
            serializer = self.get_serializer(obj, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResumeViewSet(viewsets.ModelViewSet):
    queryset = Resume.objects.all()
    serializer_class = serializers.ResumeSerializer
    permission_classes = [IsAuthenticated, IsAdminOrOwner]

    def get_queryset(self):
        return Resume.objects.filter(seeker__user_id=self.request.user.id).order_by('-id')

    def get_object(self):
        try:
            obj = Resume.objects.get(pk=self.kwargs['pk'])
        except Resume.DoesNotExist:
            raise NotFound("Resume not found.")

        if obj.seeker.user_id == self.request.user.id:
            return obj

        if getattr(self.request.user, "role", None) == "company":
            return obj

        raise PermissionDenied("You do not have permission to access this resume.")


class ExperienceViewSet(viewsets.ModelViewSet):
    queryset = Experience.objects.all()
    serializer_class = serializers.ExperienceSerializer
    permission_classes = [IsAuthenticated, IsAdminOrOwner]

    def get_queryset(self):
        return Experience.objects.filter(seeker__user_id=self.request.user.id).order_by('-id')


class SkillsView(GenericAPIView):
    serializer_class = serializers.SkillsSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return Skills.objects.filter(
            seeker__user_id=self.request.user.id
        ).first()

    def get(self, request):
        skills = self.get_object()

        if not skills:
            return Response(
                {"detail": "Skills record not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(skills)
        return Response(serializer.data)

    def post(self, request):
        skills = self.get_object()

        # UPDATE if exists
        if skills:
            serializer = self.get_serializer(
                skills,
                data=request.data,
                partial=True
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

        # CREATE if not exists
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        seeker = get_object_or_404(
            SeekerProfile,
            user_id=request.user.id
        )

        serializer.save(seeker=seeker)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class EducationViewSet(viewsets.ModelViewSet):
    queryset = Education.objects.all()
    serializer_class = serializers.EducationSerializer
    permission_classes = [IsAuthenticated, IsAdminOrOwner]

    def get_queryset(self):
        return Education.objects.filter(seeker__user_id=self.request.user.id).order_by('-start_year')

class InternalSeekerMatchingPayloadView(APIView):
    permission_classes = [IsInternalService]

    def get(self, request, seeker_id):
        payload = build_seeker_matching_payload(seeker_id)
        serializer = serializers.SeekerMatchingPayloadSerializer(payload)

        return Response(serializer.data)
