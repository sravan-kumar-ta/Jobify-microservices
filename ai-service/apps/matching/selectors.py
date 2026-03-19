from .models import MatchResult


def get_latest_match_result(job_id, seeker_id):
    return MatchResult.objects.filter(job_id=job_id, seeker_id=seeker_id).first()
