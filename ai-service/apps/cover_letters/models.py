from django.db import models


class CoverLetter(models.Model):
    seeker_id = models.UUIDField(db_index=True)
    job_id = models.IntegerField(db_index=True)

    # Generated text
    content = models.TextField()

    # Useful metadata
    model_name = models.CharField(max_length=100, default="")
    prompt_version = models.CharField(max_length=50, default="v1_cover_letter")
    generation_status = models.CharField(max_length=30, default="completed")

    # Track what snapshot state this was generated from
    job_snapshot_updated_at = models.DateTimeField(null=True, blank=True)
    seeker_snapshot_updated_at = models.DateTimeField(null=True, blank=True)

    # store prompt for debugging
    prompt_preview = models.TextField(blank=True, default="")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["seeker_id", "job_id"]),
        ]

    def __str__(self):
        return f"{self.seeker_id} -> {self.job_id} | {self.prompt_version}"
