from django.urls import path
from rest_framework.routers import DefaultRouter
from company.views import CompanyViewSet, JobViewSet, ApplicationViewSet
from company import admin_views as admin
from company import views

router = DefaultRouter()
router.register(r'companies', CompanyViewSet)
router.register(r'jobs', JobViewSet)
router.register(r'applications', ApplicationViewSet)

urlpatterns = [
    path("check-company/", views.UserCompanyCheckView.as_view()),
    path('user-company/', views.UserCompanyView.as_view()),
    path('company-jobs/', views.CompanyJobsView.as_view()),
    path('company-jobs/<int:pk>/', views.CompanyJobsView.as_view()),
    # admin views
    path('admin/job-stats/', admin.JobStatsView.as_view()),
    path('admin/companies/', admin.CompaniesListView.as_view()),
    path('admin/company-approval/', admin.ApproveCompany.as_view()),
    path('admin/jobs/', admin.AllJobsListView.as_view()),
    path('admin/applications/', admin.AllApplicationListView.as_view()),
    # Internal service
    path(
        "job/<int:job_id>/matching-payload/",
        views.InternalJobMatchingPayloadView.as_view(),
        name="internal-job-matching-payload",
    ),
] + router.urls
