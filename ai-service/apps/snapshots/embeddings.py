import hashlib
from django.utils import timezone

from apps.integrations.clients.openai_client import OpenAIClient


def build_job_embedding_text(job_snapshot) -> str:
    parts = [
        f"Job Title: {job_snapshot.title}",
        f"Description: {job_snapshot.description}",
        f"Required Skills: {', '.join(job_snapshot.required_skills or [])}",
        f"Minimum Experience: {job_snapshot.min_experience_years} years",
    ]
    return "\n".join([p for p in parts if p]).strip()


def build_seeker_embedding_text(seeker_snapshot) -> str:
    education_text = []
    for edu in seeker_snapshot.education or []:
        degree = edu.get("degree", "")
        start_year = edu.get("start_year", "")
        end_year = edu.get("end_year", "")
        education_text.append(f"{degree} ({start_year} - {end_year})")

    experience_text = []
    for exp in seeker_snapshot.experience or []:
        job_title = exp.get("job_title", "")
        start_date = exp.get("start_date", "")
        end_date = exp.get("end_date", "")
        is_current = exp.get("is_current", False)
        end_label = "Present" if is_current else end_date
        experience_text.append(f"{job_title} ({start_date} - {end_label})")

    parts = [
        f"Skills: {', '.join(seeker_snapshot.skills or [])}",
        f"Education: {'; '.join(education_text)}",
        f"Experience: {'; '.join(experience_text)}",
        f"Total Experience: {seeker_snapshot.total_experience_years} years",
    ]
    return "\n".join([p for p in parts if p]).strip()


def get_text_hash(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def ensure_job_embedding(job_snapshot):
    embedding_text = build_job_embedding_text(job_snapshot)
    current_hash = get_text_hash(embedding_text)
    
    if (
            job_snapshot.embedding is not None
            and job_snapshot.embedding_text_hash == current_hash
    ):
        return job_snapshot

    client = OpenAIClient()
    vector = client.create_embedding(embedding_text)

    job_snapshot.embedding = vector
    job_snapshot.embedding_model = client.model
    job_snapshot.embedding_text_hash = current_hash
    job_snapshot.embedding_generated_at = timezone.now()
    job_snapshot.save(update_fields=[
        "embedding",
        "embedding_model",
        "embedding_text_hash",
        "embedding_generated_at",
        "updated_at",
    ])

    return job_snapshot


def ensure_seeker_embedding(seeker_snapshot):
    embedding_text = build_seeker_embedding_text(seeker_snapshot)
    current_hash = get_text_hash(embedding_text)

    if (
            seeker_snapshot.embedding is not None
            and seeker_snapshot.embedding_text_hash == current_hash
    ):
        return seeker_snapshot

    client = OpenAIClient()
    vector = client.create_embedding(embedding_text)

    seeker_snapshot.embedding = vector
    seeker_snapshot.embedding_model = client.model
    seeker_snapshot.embedding_text_hash = current_hash
    seeker_snapshot.embedding_generated_at = timezone.now()
    seeker_snapshot.save(update_fields=[
        "embedding",
        "embedding_model",
        "embedding_text_hash",
        "embedding_generated_at",
        "updated_at",
    ])

    return seeker_snapshot
