from datetime import timedelta
from django.utils import timezone

from .models import JobSnapshot, SeekerSnapshot


SNAPSHOT_MAX_AGE_MINUTES = 1

# Important: This is a simple V1 strategy.
# It is not perfect, but good enough.
# In V2, you should compare against source_updated_at from source services if they expose it reliably.
def is_snapshot_stale(snapshot) -> bool:
    if not snapshot:
        return True

    if snapshot.updated_at < timezone.now() - timedelta(minutes=SNAPSHOT_MAX_AGE_MINUTES):
        return True

    return False


# Normalize job text
def build_job_normalized_text(payload: dict) -> str:
    parts = [
        payload.get("title", ""),
        payload.get("description", ""),
        " ".join(payload.get("required_skills", [])),
        str(payload.get("min_experience_years", "")),
    ]
    return "\n".join([p for p in parts if p]).strip()


# Normalize seeker text
def build_seeker_normalized_text(payload: dict) -> str:
    parts = [
        " ".join(payload.get("skills", [])),
        str(payload.get("total_experience_years", "")),
    ]

    for item in payload.get("education", []):
        parts.append(" ".join([str(v) for v in item.values() if v]))

    for item in payload.get("experience", []):
        parts.append(" ".join([str(v) for v in item.values() if v]))

    return "\n".join([p for p in parts if p]).strip()


# Upsert JobSnapshot
def upsert_job_snapshot(payload: dict):
    normalized_text = build_job_normalized_text(payload)

    snapshot, _ = JobSnapshot.objects.update_or_create(
        job_id=payload["job_id"],
        defaults={
            # "full_name": cannot added because seeker service dont have user model,
            "company_id": payload.get("company_id"),
            "title": payload.get("title", ""),
            "description": payload.get("description", ""),
            "required_skills": payload.get("required_skills", []),
            "min_experience_years": payload.get("min_experience_years", 0),
            "normalized_text": normalized_text,
            "raw_payload": payload,
            "source_updated_at": payload.get("updated_at"),
            "is_matchable": payload.get("is_matchable", True),
        },
    )
    return snapshot


# Upsert SeekerSnapshot
def upsert_seeker_snapshot(payload: dict):
    normalized_text = build_seeker_normalized_text(payload)

    snapshot, _ = SeekerSnapshot.objects.update_or_create(
        seeker_id=payload["seeker_id"],
        defaults={
            # "full_name": cannot added because seeker service dont have user model,
            "skills": payload.get("skills", []),
            "education": payload.get("education", []),
            "experience": payload.get("experience", []),
            "total_experience_years": payload.get("total_experience_years", 0),
            "normalized_text": normalized_text,
            "raw_payload": payload,
            "source_updated_at": payload.get("updated_at"),
            "is_matchable": payload.get("is_matchable", True),
        },
    )
    return snapshot
