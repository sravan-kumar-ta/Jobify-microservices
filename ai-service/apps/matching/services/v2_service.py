from django.db import transaction

from apps.matching.models import MatchResult
from apps.matching.services.common import ensure_fresh_snapshots
from apps.matching.scoring.common import (
    score_required_skills,
    score_experience,
    score_education,
)
from apps.matching.scoring.v1_scoring import calculate_v1_score
from apps.matching.scoring.v2_scoring import (
    cosine_similarity,
    cosine_to_score,
    calculate_v2_hybrid_score,
)
from apps.matching.explainers import build_v2_explanation
from apps.snapshots.embeddings import ensure_job_embedding, ensure_seeker_embedding


@transaction.atomic
def generate_match_v2(job_id, seeker_id):
    job_snapshot, seeker_snapshot = ensure_fresh_snapshots(job_id, seeker_id)

    # ---------- structured ----------
    required_skill_score, matched_required_skills, missing_required_skills = score_required_skills(
        job_snapshot.required_skills,
        seeker_snapshot.skills,
    )

    experience_score = score_experience(
        job_snapshot.min_experience_years,
        seeker_snapshot.total_experience_years,
    )

    education_score = score_education(job_snapshot, seeker_snapshot)

    rule_based_score = calculate_v1_score(
        required_skill_score=required_skill_score,
        experience_score=experience_score,
        education_score=education_score,
    )

    # ---------- semantic ----------
    job_snapshot = ensure_job_embedding(job_snapshot)
    seeker_snapshot = ensure_seeker_embedding(seeker_snapshot)

    cosine_value = cosine_similarity(
        job_snapshot.embedding, seeker_snapshot.embedding)
    semantic_score = cosine_to_score(cosine_value)

    # ---------- final ----------
    final_score = calculate_v2_hybrid_score(
        rule_based_score=rule_based_score,
        semantic_score=semantic_score,
    )

    explanation = build_v2_explanation(
        required_skill_score=required_skill_score,
        experience_score=experience_score,
        education_score=education_score,
        rule_based_score=rule_based_score,
        semantic_score=semantic_score,
        matched_required_skills=matched_required_skills,
        missing_required_skills=missing_required_skills,
    )

    result, _ = MatchResult.objects.update_or_create(
        seeker_id=seeker_snapshot.seeker_id,
        job_id=job_snapshot.job_id,
        algorithm_version="v2_hybrid",
        defaults={
            "score": final_score,
            "required_skill_score": required_skill_score,
            "experience_score": experience_score,
            "education_score": education_score,
            "rule_based_score": rule_based_score,
            "semantic_score": semantic_score,
            "matched_required_skills": matched_required_skills,
            "missing_required_skills": missing_required_skills,
            "explanation": explanation,
        }
    )

    return result
