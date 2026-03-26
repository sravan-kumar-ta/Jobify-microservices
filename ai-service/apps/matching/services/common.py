from apps.integrations.services.fetch_payloads import fetch_matching_payloads
from apps.snapshots.selectors import get_job_snapshot, get_seeker_snapshot
from apps.snapshots.services import (
    is_snapshot_stale,
    upsert_job_snapshot,
    upsert_seeker_snapshot,
)


def ensure_fresh_snapshots(job_id, seeker_id):
    job_snapshot = get_job_snapshot(job_id)
    seeker_snapshot = get_seeker_snapshot(seeker_id)

    need_job_refresh = is_snapshot_stale(job_snapshot)
    need_seeker_refresh = is_snapshot_stale(seeker_snapshot)

    if need_job_refresh or need_seeker_refresh:
        job_payload, seeker_payload = fetch_matching_payloads(
            job_id, seeker_id)

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

    return job_snapshot, seeker_snapshot
