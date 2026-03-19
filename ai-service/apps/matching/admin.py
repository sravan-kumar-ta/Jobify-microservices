from django.contrib import admin
from .models import MatchResult


@admin.register(MatchResult)
class MatchResultAdmin(admin.ModelAdmin):
    list_display = ("seeker_id", "job_id", "score",
                    "algorithm_version", "created_at")
    search_fields = ("seeker_id", "job_id")
