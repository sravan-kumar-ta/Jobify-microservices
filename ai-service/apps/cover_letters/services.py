from django.db import transaction

from apps.integrations.clients.openai_client import OpenAIClient
from apps.matching.services.common import ensure_fresh_snapshots
from .models import CoverLetter
from .prompts import build_cover_letter_prompt


@transaction.atomic
def generate_cover_letter(job_id, seeker_id):
    job_snapshot, seeker_snapshot = ensure_fresh_snapshots(job_id, seeker_id)

    if not job_snapshot.is_matchable:
        raise ValueError("Job is not eligible for cover letter generation.")

    if not seeker_snapshot.is_matchable:
        raise ValueError("Seeker is not eligible for cover letter generation.")

    prompt = build_cover_letter_prompt(job_snapshot, seeker_snapshot)

    client = OpenAIClient()
    content = client.generate_cover_letter(prompt)

    cover_letter = CoverLetter.objects.create(
        seeker_id=seeker_snapshot.seeker_id,
        job_id=job_snapshot.job_id,
        content=content,
        model_name=client.chat_model,
        prompt_version="v1_cover_letter",
        generation_status="completed",
        job_snapshot_updated_at=job_snapshot.source_updated_at,
        seeker_snapshot_updated_at=seeker_snapshot.source_updated_at,
        prompt_preview=prompt[:2000],  # optional safe preview
    )

    return cover_letter
