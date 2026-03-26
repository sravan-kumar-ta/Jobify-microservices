from apps.integrations.clients.company_client import CompanyServiceClient
from apps.integrations.clients.seeker_client import SeekerServiceClient


def fetch_matching_payloads(job_id, seeker_id):
    company_client = CompanyServiceClient()
    seeker_client = SeekerServiceClient()

    job_payload = company_client.get_job_matching_payload(job_id)
    seeker_payload = seeker_client.get_seeker_matching_payload(seeker_id)

    return job_payload, seeker_payload
