from django.conf import settings
from .base import BaseServiceClient


class SeekerServiceClient(BaseServiceClient):
    def get_seeker_matching_payload(self, seeker_id):
        # url = f"{settings.SEEKER_SERVICE_BASE_URL}/api/v1/internal/seekers/{seeker_id}/matching-payload/"
        url = f"http://localhost:8002/api/seeker/{seeker_id}/matching-payload/"
        return self.get(url)
