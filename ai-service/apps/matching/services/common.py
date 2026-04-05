from apps.common.exceptions import ServiceIntegrationError
from apps.integrations.services.fetch_payloads import (
    fetch_matching_metadata,
    fetch_job_matching_payload,
    fetch_seeker_matching_payload,
)
from apps.snapshots.selectors import get_job_snapshot, get_seeker_snapshot
from apps.snapshots.services import (
    is_snapshot_stale_against_source,
    is_snapshot_stale_by_ttl,
    upsert_job_snapshot,
    upsert_seeker_snapshot,
)


def ensure_fresh_snapshots(job_id, seeker_id):
    """
    1. Load local snapshots
    2. Try metadata-based freshness check
    3. If metadata fails, fallback to TTL
    4. Fetch ONLY the payload(s) that are stale/missing
    5. Upsert stale snapshot(s)
    """
    job_snapshot = get_job_snapshot(job_id)
    seeker_snapshot = get_seeker_snapshot(seeker_id)

    # Default: stale if missing
    need_job_refresh = not bool(job_snapshot)
    need_seeker_refresh = not bool(seeker_snapshot)

    # Step 1: Prefer source-aware freshness via metadata endpoints
    try:
        job_metadata, seeker_metadata = fetch_matching_metadata(job_id, seeker_id)

        need_job_refresh = is_snapshot_stale_against_source(
            job_snapshot,
            job_metadata.get("updated_at"),
        )

        need_seeker_refresh = is_snapshot_stale_against_source(
            seeker_snapshot,
            seeker_metadata.get("updated_at"),
        )

    except ServiceIntegrationError:
        # Step 2: Metadata unavailable -> fallback to TTL
        need_job_refresh = is_snapshot_stale_by_ttl(job_snapshot)
        need_seeker_refresh = is_snapshot_stale_by_ttl(seeker_snapshot)

    # Step 3: Fetch only the stale payload(s)
    if need_job_refresh:
        job_payload = fetch_job_matching_payload(job_id)
        job_snapshot = upsert_job_snapshot(job_payload)

    if need_seeker_refresh:
        seeker_payload = fetch_seeker_matching_payload(seeker_id)
        seeker_snapshot = upsert_seeker_snapshot(seeker_payload)

    # Final validation
    if not job_snapshot:
        raise ValueError("Job snapshot could not be created.")

    if not seeker_snapshot:
        raise ValueError("Seeker snapshot could not be created.")

    if not job_snapshot.is_matchable:
        raise ValueError("Job is not matchable.")

    if not seeker_snapshot.is_matchable:
        raise ValueError("Seeker is not matchable.")

    return job_snapshot, seeker_snapshot
