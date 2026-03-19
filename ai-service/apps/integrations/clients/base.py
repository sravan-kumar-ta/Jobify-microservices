import httpx
from django.conf import settings
from apps.common.exceptions import ServiceIntegrationError


class BaseServiceClient:
    timeout = 10.0

    def __init__(self):
        self.headers = {
            "X-Internal-Service-Token": settings.INTERNAL_SERVICE_TOKEN,
            "Content-Type": "application/json",
        }

    def get(self, url: str):
        try:
            with httpx.Client(timeout=self.timeout, headers=self.headers) as client:
                response = client.get(url)
                response.raise_for_status()
                return response.json()
        except httpx.TimeoutException:
            raise ServiceIntegrationError(
                "External service request timed out.")
        except httpx.HTTPStatusError as exc:
            raise ServiceIntegrationError(
                f"External service returned {exc.response.status_code}."
            )
        except httpx.HTTPError:
            raise ServiceIntegrationError("External service request failed.")
