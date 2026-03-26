from django.db import transaction

from apps.matching.models import MatchResult
from apps.matching.services.common import ensure_fresh_snapshots
from apps.matching.scoring.common import (
    score_required_skills,
    score_experience,
    score_education,
)
from apps.matching.scoring.v1_scoring import calculate_v1_score
from apps.matching.explainers import build_v1_explanation


@transaction.atomic
def generate_match_v1(job_id, seeker_id):
    job_snapshot, seeker_snapshot = ensure_fresh_snapshots(job_id, seeker_id)

    required_skill_score, matched_required_skills, missing_required_skills = score_required_skills(
        job_snapshot.required_skills,
        seeker_snapshot.skills,
    )

    experience_score = score_experience(
        job_snapshot.min_experience_years,
        seeker_snapshot.total_experience_years,
    )

    education_score = score_education(job_snapshot, seeker_snapshot)

    final_score = calculate_v1_score(
        required_skill_score=required_skill_score,
        experience_score=experience_score,
        education_score=education_score,
    )

    explanation = build_v1_explanation(
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
        defaults={
            "score": final_score,
            "required_skill_score": required_skill_score,
            "experience_score": experience_score,
            "education_score": education_score,
            "rule_based_score": final_score,  # keep response shape consistent
            "semantic_score": None,
            "matched_required_skills": matched_required_skills,
            "missing_required_skills": missing_required_skills,
            "explanation": explanation,
        }
    )

    return result
