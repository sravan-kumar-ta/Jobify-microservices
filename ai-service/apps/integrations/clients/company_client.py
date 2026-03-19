from django.conf import settings
from .base import BaseServiceClient


class CompanyServiceClient(BaseServiceClient):
    def get_job_matching_payload(self, job_id):
        # url = f"{settings.COMPANY_SERVICE_BASE_URL}/api/v1/internal/jobs/{job_id}/matching-payload/"
        url = f"http://localhost:8000/api/company/job/{job_id}/matching-payload/"
        return self.get(url)
