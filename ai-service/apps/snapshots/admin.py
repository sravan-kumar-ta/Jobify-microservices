from django.contrib import admin
from .models import JobSnapshot, SeekerSnapshot


@admin.register(JobSnapshot)
class JobSnapshotAdmin(admin.ModelAdmin):
    list_display = ("job_id", "title", "is_matchable", "updated_at")
    search_fields = ("job_id", "title")


@admin.register(SeekerSnapshot)
class SeekerSnapshotAdmin(admin.ModelAdmin):
    list_display = ("seeker_id", "is_matchable", "updated_at")
    search_fields = ("seeker_id",)
