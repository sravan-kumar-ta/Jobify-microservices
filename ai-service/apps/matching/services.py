from django.db import transaction

from apps.integrations.services.fetch_payloads import fetch_matching_payloads
from apps.snapshots.selectors import get_job_snapshot, get_seeker_snapshot
from apps.snapshots.services import (
    is_snapshot_stale,
    upsert_job_snapshot,
    upsert_seeker_snapshot,
)
from apps.matching.models import MatchResult
from apps.matching.scoring import (
    score_required_skills,
    score_experience,
    score_education,
    calculate_final_score,
)
from apps.matching.explainers import build_match_explanation


# Main generate function
@transaction.atomic
def generate_match(job_id, seeker_id):
    job_snapshot = get_job_snapshot(job_id)
    seeker_snapshot = get_seeker_snapshot(seeker_id)

    need_job_refresh = is_snapshot_stale(job_snapshot)
    need_seeker_refresh = is_snapshot_stale(seeker_snapshot)
    
    if need_job_refresh or need_seeker_refresh:
        job_payload, seeker_payload = fetch_matching_payloads(job_id, seeker_id)

        if need_job_refresh:
            job_snapshot = upsert_job_snapshot(job_payload)

        if need_seeker_refresh:
            seeker_snapshot = upsert_seeker_snapshot(seeker_payload)

    if not job_snapshot:
        raise ValueError("Job snapshot could not be created.")

    if not seeker_snapshot:
        raise ValueError("Seeker snapshot could not be created.")

    if not job_snapshot.is_matchable:
        raise ValueError("Job is not matchable.")

    if not seeker_snapshot.is_matchable:
        raise ValueError("Seeker is not matchable.")

    required_skill_score, matched_required_skills, missing_required_skills = score_required_skills(
        job_snapshot.required_skills,
        seeker_snapshot.skills,
    )

    experience_score = score_experience(
        job_snapshot.min_experience_years,
        seeker_snapshot.total_experience_years,
    )

    education_score = score_education(job_snapshot, seeker_snapshot)

    final_score = calculate_final_score(
        required_skill_score=required_skill_score,
        experience_score=experience_score,
        education_score=education_score,
    )

    explanation = build_match_explanation(
        required_skill_score=required_skill_score,
        experience_score=experience_score,
        education_score=education_score,
        matched_required_skills=matched_required_skills,
        missing_required_skills=missing_required_skills,
    )

    result, _ = MatchResult.objects.update_or_create(
        seeker_id=seeker_snapshot.seeker_id,
        job_id=job_snapshot.job_id,
        algorithm_version="v1_rule_based",
        defaults = {
            "score": final_score,
            "required_skill_score": required_skill_score,
            "experience_score": experience_score,
            "education_score": education_score,
            "matched_required_skills": matched_required_skills,
            "missing_required_skills": missing_required_skills,
            "explanation": explanation,
        }
    )

    return result
