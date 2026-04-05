from apps.integrations.clients.company_client import CompanyServiceClient
from apps.integrations.clients.seeker_client import SeekerServiceClient


def fetch_matching_metadata(job_id, seeker_id):
    """
    Fetch lightweight freshness metadata from source services.
    """
    company_client = CompanyServiceClient()
    seeker_client = SeekerServiceClient()

    job_metadata = company_client.get_job_matching_metadata(job_id)
    seeker_metadata = seeker_client.get_seeker_matching_metadata(seeker_id)

    return job_metadata, seeker_metadata


def fetch_job_matching_payload(job_id):
    """
    Fetch full normalized job payload from company-service.
    """
    company_client = CompanyServiceClient()
    return company_client.get_job_matching_payload(job_id)


def fetch_seeker_matching_payload(seeker_id):
    """
    Fetch full normalized seeker payload from seeker-service.
    """
    seeker_client = SeekerServiceClient()
    return seeker_client.get_seeker_matching_payload(seeker_id)
