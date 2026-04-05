from django.conf import settings
from .base import BaseServiceClient


class SeekerServiceClient(BaseServiceClient):
    def get_seeker_matching_metadata(self, seeker_id):
        url = f"{settings.SEEKER_SERVICE_BASE_URL}/{seeker_id}/matching-metadata/"
        return self.get(url)

    def get_seeker_matching_payload(self, seeker_id):
        url = f"{settings.SEEKER_SERVICE_BASE_URL}/{seeker_id}/matching-payload/"
        return self.get(url)
