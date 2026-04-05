from datetime import timedelta

from django.utils import timezone
from django.utils.dateparse import parse_datetime

from .models import JobSnapshot, SeekerSnapshot


# Fallback TTL if metadata endpoint fails or source timestamp is unavailable
SNAPSHOT_FALLBACK_TTL_HOURS = 24


def parse_source_updated_at(value):
    """
    Accepts:
    - ISO datetime string from source services
    - already parsed datetime
    - None

    Returns:
    - aware datetime or None
    """
    if not value:
        return None

    if hasattr(value, "tzinfo"):
        return value

    parsed = parse_datetime(value)
    return parsed


def is_snapshot_stale_against_source(snapshot, source_updated_at):
    """
    Primary freshness logic:
    - no snapshot => stale
    - snapshot has no source_updated_at => stale
    - source_updated_at newer than snapshot.source_updated_at => stale

    Fallback:
    - if source_updated_at unavailable => use TTL fallback
    """
    if not snapshot:
        return True

    source_dt = parse_source_updated_at(source_updated_at)

    if snapshot.source_updated_at is None:
        return True

    if source_dt:
        return source_dt > snapshot.source_updated_at

    # metadata missing/invalid => fallback to TTL
    fallback_cutoff = timezone.now() - timedelta(hours=SNAPSHOT_FALLBACK_TTL_HOURS)
    return snapshot.updated_at < fallback_cutoff


def is_snapshot_stale_by_ttl(snapshot, hours=SNAPSHOT_FALLBACK_TTL_HOURS):
    """
    Fallback-only freshness check.
    """
    if not snapshot:
        return True

    cutoff = timezone.now() - timedelta(hours=hours)
    return snapshot.updated_at < cutoff


def build_job_normalized_text(job_payload):
    required_skills = job_payload.get("required_skills") or []

    parts = [
        f"Job Title: {job_payload.get('title', '')}",
        f"Description: {job_payload.get('description', '')}",
        f"Required Skills: {', '.join(required_skills)}",
        f"Minimum Experience: {job_payload.get('min_experience_years', 0)} years",
    ]

    return "\n".join([p for p in parts if p]).strip()


def build_seeker_normalized_text(seeker_payload):
    skills = seeker_payload.get("skills") or []
    education = seeker_payload.get("education") or []
    experience = seeker_payload.get("experience") or []

    education_lines = []
    for edu in education:
        degree = edu.get("degree", "")
        start_year = edu.get("start_year", "")
        end_year = edu.get("end_year", "")
        education_lines.append(f"{degree} ({start_year} - {end_year or 'Present'})")

    experience_lines = []
    for exp in experience:
        job_title = exp.get("job_title", "")
        start_date = exp.get("start_date", "")
        end_date = exp.get("end_date", "")
        is_current = exp.get("is_current", False)
        end_label = "Present" if is_current else (end_date or "")
        experience_lines.append(f"{job_title} ({start_date} - {end_label})")

    parts = [
        f"Skills: {', '.join(skills)}",
        f"Education: {'; '.join(education_lines)}",
        f"Experience: {'; '.join(experience_lines)}",
        f"Total Experience: {seeker_payload.get('total_experience_years', 0)} years",
    ]

    return "\n".join([p for p in parts if p]).strip()


# Upsert JobSnapshot
def upsert_job_snapshot(payload: dict):
    normalized_text = build_job_normalized_text(payload)
    incoming_source_updated_at = parse_source_updated_at(payload.get("updated_at"))

    existing = JobSnapshot.objects.filter(job_id=payload["job_id"]).first()

    embedding_should_reset = False
    if existing and existing.normalized_text != normalized_text:
        embedding_should_reset = True

    defaults={
        "company_id": payload.get("company_id"),
        "title": payload.get("title", ""),
        "description": payload.get("description", ""),
        "required_skills": payload.get("required_skills", []),
        "min_experience_years": payload.get("min_experience_years", 0),
        "normalized_text": normalized_text,
        "raw_payload": payload,
        "source_updated_at": incoming_source_updated_at,
        "is_matchable": payload.get("is_matchable", True),
    }

    # IMPORTANT for V2: invalidate embedding if semantic source text changed
    if embedding_should_reset:
        defaults.update({
            "embedding": None,
            "embedding_model": "",
            "embedding_text_hash": "",
            "embedding_generated_at": None,
        })

    snapshot, _ = JobSnapshot.objects.update_or_create(
        job_id=payload["job_id"],
        defaults=defaults,
    )
    
    return snapshot


# Upsert SeekerSnapshot
def upsert_seeker_snapshot(payload: dict):
    normalized_text = build_seeker_normalized_text(payload)
    incoming_source_updated_at = parse_source_updated_at(payload.get("updated_at"))

    existing = SeekerSnapshot.objects.filter(seeker_id=payload["seeker_id"]).first()

    embedding_should_reset = False
    if existing and existing.normalized_text != normalized_text:
        embedding_should_reset = True

    defaults={
        "skills": payload.get("skills", []),
        "education": payload.get("education", []),
        "experience": payload.get("experience", []),
        "total_experience_years": payload.get("total_experience_years", 0),
        "normalized_text": normalized_text,
        "raw_payload": payload,
        "source_updated_at": incoming_source_updated_at,
        "is_matchable": payload.get("is_matchable", True),
    }

    # IMPORTANT for V2: invalidate embedding if semantic source text changed
    if embedding_should_reset:
        defaults.update({
            "embedding": None,
            "embedding_model": "",
            "embedding_text_hash": "",
            "embedding_generated_at": None,
        })

    snapshot, _ = SeekerSnapshot.objects.update_or_create(
        seeker_id=payload["seeker_id"],
        defaults=defaults,
    )

    return snapshot
