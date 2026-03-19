import uuid
from django.db import models
from apps.common.models import TimeStampedModel


class MatchResult(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    seeker_id = models.UUIDField(db_index=True)
    job_id = models.IntegerField(db_index=True)

    score = models.DecimalField(max_digits=5, decimal_places=2)

    required_skill_score = models.DecimalField(
        max_digits=5, decimal_places=2, default=0)
    experience_score = models.DecimalField(
        max_digits=5, decimal_places=2, default=0)
    education_score = models.DecimalField(
        max_digits=5, decimal_places=2, default=0)

    matched_required_skills = models.JSONField(default=list)
    missing_required_skills = models.JSONField(default=list)

    explanation = models.JSONField(default=dict)
    algorithm_version = models.CharField(
        max_length=50, default="v1_rule_based")

    class Meta:
        indexes = [
            models.Index(fields=["seeker_id", "job_id"]),
        ]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.seeker_id} -> {self.job_id} = {self.score}"
