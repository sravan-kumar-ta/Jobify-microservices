from .models import MatchResult


def get_match_result(job_id, seeker_id, algorithm_version):
    return MatchResult.objects.filter(
        job_id=job_id,
        seeker_id=seeker_id,
        algorithm_version=algorithm_version,
    ).first()
