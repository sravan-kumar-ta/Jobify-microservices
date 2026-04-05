from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import mixins, viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from . import serializers
from .models import Company, Job, Application
from .permissions import IsCompanyOrAdmin, IsCompany, IsInternalService, RoleBasedPermission
from .selectors import build_job_matching_payload, build_job_matching_metadata

class UserCompanyCheckView(generics.GenericAPIView):
    serializer_class = serializers.CompanySerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            company = Company.objects.get(user_id=request.user.id)
            serializer = self.get_serializer(company)
            return Response({
                "company_exists": True,
                "company": serializer.data
            })
        except Company.DoesNotExist:
            return Response({
                "company_exists": False,
                "company": None
            }, status=status.HTTP_200_OK)

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = serializers.CompanySerializer
    permission_classes = [IsAuthenticated, IsCompanyOrAdmin]


class JobsListPagination(PageNumberPagination):
    page_size = 10
    max_page_size = 50


class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = serializers.JobSerializer
    permission_classes = [IsAuthenticated, IsCompanyOrAdmin]
    filter_backends = [SearchFilter, DjangoFilterBackend, OrderingFilter]
    search_fields = ['title', 'company__location']
    filterset_fields = ['salary']
    ordering_fields = ['salary', 'date_posted']
    ordering = ['-date_posted']
    pagination_class = JobsListPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        min_salary = self.request.query_params.get('min_salary', None)
        max_salary = self.request.query_params.get('max_salary', None)
        if min_salary:
            queryset = queryset.filter(salary__gte=min_salary)
        if max_salary:
            queryset = queryset.filter(salary__lte=max_salary)
        return queryset


class UserCompanyView(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
    serializer_class = serializers.CompanySerializer
    permission_classes = [IsAuthenticated, IsCompany]

    def get_queryset(self):
        return Company.objects.filter(user_id=self.request.user.id)

    def get_object(self):
        return Company.objects.get(user_id=self.request.user.id)

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)


class CompanyJobsView(APIView):
    permission_classes = [IsAuthenticated, IsCompany]

    def get(self, request):
        jobs = Job.objects.filter(company__user_id=request.user.id)
        serializer = serializers.JobSerializer(jobs, many=True)
        return Response(serializer.data)

    def patch(self, request, pk=None):
        job = Job.objects.filter(company__user_id=request.user.id, pk=pk).first()
        if not job or job.company.user_id != request.user.id:
            raise PermissionDenied("You do not have permission to update this job.")

        serializer = serializers.JobSerializer(job, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all().order_by('-id')
    serializer_class = serializers.ApplicationSerializer
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get_queryset(self):
        user = self.request.user
        objects = super().get_queryset()

        if user.role == 'admin':
            return objects.all()

        elif user.role == 'company':
            return objects.filter(job__company__user_id=user.id)

        elif user.role == 'job_seeker':
            return objects.filter(applicant_id=user.id)


        return objects.none()

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        job_id = data.get('job')
        # resume_id = data.get('resume')

        if Application.objects.filter(job=job_id, applicant_id=request.user.id).exists():
            return Response(
                {"detail": "You have already applied for this job."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # data['resume'] = get_object_or_404(Resume, id=resume_id).resume

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED,
                        headers=self.get_success_headers(serializer.data))

    @action(detail=False, methods=['GET'], permission_classes=[IsCompany])
    def list_by_job(self, request):
        job_id = request.query_params.get('jobID', None)
        if not job_id:
            return Response({"detail": "jobID parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

        applications = self.get_queryset().filter(job__id=job_id)
        serializer = self.get_serializer(applications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['GET'], permission_classes=[IsCompany])
    def filter_applications(self, request):
        app_status = request.query_params.get('status')
        job_id = request.query_params.get('jobID')

        if not app_status or not job_id:
            return Response(
                {"detail": "Both jobID and status query parameters are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        applications = self.get_queryset().filter(job__id=job_id)
        if app_status != "all":
            applications = applications.filter(status=app_status)

        serializer = self.get_serializer(applications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class InternalJobMatchingPayloadView(APIView):
    permission_classes = [IsInternalService]

    def get(self, request, job_id):
        job = get_object_or_404(Job, id=job_id)

        payload = build_job_matching_payload(job)
        serializer = serializers.JobMatchingPayloadSerializer(payload)

        return Response(serializer.data)

class InternalJobMatchingMetadataView(APIView):
    permission_classes = [IsInternalService]

    def get(self, request, job_id):
        job = get_object_or_404(Job, id=job_id)

        metadata = build_job_matching_metadata(job)
        serializer = serializers.JobMatchingMetadataSerializer(metadata)

        return Response(serializer.data)
