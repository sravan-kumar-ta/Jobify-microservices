from django.db import models
from apps.common.models import TimeStampedModel


class JobSnapshot(TimeStampedModel):
    job_id = models.IntegerField(unique=True, db_index=True)
    company_id = models.IntegerField(null=True, blank=True)

    title = models.CharField(max_length=255)
    description = models.TextField()
    required_skills = models.JSONField(default=list)

    min_experience_years = models.DecimalField(
        max_digits=4, decimal_places=1, default=0)
    normalized_text = models.TextField()

    raw_payload = models.JSONField(default=dict)

    source_updated_at = models.DateTimeField(null=True, blank=True)
    is_matchable = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.job_id} | {self.title}"


class SeekerSnapshot(TimeStampedModel):
    seeker_id = models.UUIDField(unique=True, db_index=True)

    skills = models.JSONField(default=list)
    education = models.JSONField(default=list)
    experience = models.JSONField(default=list)

    total_experience_years = models.DecimalField(
        max_digits=4, decimal_places=2, default=0)
    normalized_text = models.TextField()

    raw_payload = models.JSONField(default=dict)

    source_updated_at = models.DateTimeField(null=True, blank=True)
    is_matchable = models.BooleanField(default=True)

    def __str__(self):
        return str(self.seeker_id)
