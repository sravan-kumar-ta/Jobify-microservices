from .models import CoverLetter


def get_latest_cover_letter(job_id, seeker_id):
    return CoverLetter.objects.filter(
        job_id=job_id,
        seeker_id=seeker_id,
    ).order_by("-created_at").first()
