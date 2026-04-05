from django.conf import settings
from .base import BaseServiceClient


class CompanyServiceClient(BaseServiceClient):
    def get_job_matching_metadata(self, job_id):
        url = f"{settings.COMPANY_SERVICE_BASE_URL}/job/{job_id}/matching-metadata/"
        return self.get(url)

    def get_job_matching_payload(self, job_id):
        url = f"{settings.COMPANY_SERVICE_BASE_URL}/job/{job_id}/matching-payload/"
        return self.get(url)
