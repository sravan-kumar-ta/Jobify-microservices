from django.db import models


class MatchResult(models.Model):
    seeker_id = models.UUIDField(db_index=True)
    job_id = models.IntegerField(db_index=True)

    required_skill_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    experience_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    education_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    # V2 fields
    rule_based_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    semantic_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    score = models.DecimalField(max_digits=5, decimal_places=2)
    matched_required_skills = models.JSONField(default=list)
    missing_required_skills = models.JSONField(default=list)
    explanation = models.JSONField(default=dict)
    algorithm_version = models.CharField(max_length=50, db_index=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["seeker_id", "job_id", "algorithm_version"]),
        ]
        ordering = ["-updated_at"]

    def __str__(self):
        return f"{self.seeker_id} -> {self.job_id} [{self.algorithm_version}]"
