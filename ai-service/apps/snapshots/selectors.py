from .models import JobSnapshot, SeekerSnapshot


def get_job_snapshot(job_id):
    return JobSnapshot.objects.filter(job_id=job_id).first()


def get_seeker_snapshot(seeker_id):
    return SeekerSnapshot.objects.filter(seeker_id=seeker_id).first()
