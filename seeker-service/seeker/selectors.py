from datetime import date
from django.shortcuts import get_object_or_404
from django.db.models import Max

from seeker.models import SeekerProfile, Skills, Education, Experience


def calculate_total_experience_years(experiences):
    total_days = 0
    today = date.today()

    for exp in experiences:
        start = exp.start_date
        end = today if exp.is_current or not exp.end_date else exp.end_date

        if start and end and end >= start:
            total_days += (end - start).days

    total_years = total_days / 365
    return round(total_years, 2)


def get_seeker_payload_updated_at(skills_obj, education_qs, experience_qs):
    timestamps = []

    if skills_obj and getattr(skills_obj, "updated_at", None):
        timestamps.append(skills_obj.updated_at)

    latest_education = education_qs.aggregate(latest=Max("updated_at"))["latest"]
    if latest_education:
        timestamps.append(latest_education)

    latest_experience = experience_qs.aggregate(latest=Max("updated_at"))["latest"]
    if latest_experience:
        timestamps.append(latest_experience)

    return max(timestamps) if timestamps else None


def build_seeker_matching_payload(seeker_id):
    seeker = get_object_or_404(SeekerProfile, user_id=seeker_id)

    skills_obj = Skills.objects.filter(seeker=seeker).first()
    education_qs = Education.objects.filter(seeker=seeker).order_by("start_year")
    experience_qs = Experience.objects.filter(seeker=seeker).order_by("start_date")

    skills = skills_obj.skills if skills_obj else []

    education = [
        {
            "degree": edu.degree,
            "start_year": edu.start_year,
            "end_year": edu.end_year,
        }
        for edu in education_qs
    ]

    experience = [
        {
            "job_title": exp.job_title,
            "start_date": exp.start_date,
            "end_date": exp.end_date,
            "is_current": exp.is_current,
        }
        for exp in experience_qs
    ]

    total_experience_years = calculate_total_experience_years(experience_qs)

    updated_at = get_seeker_payload_updated_at(
        skills_obj=skills_obj,
        education_qs=education_qs,
        experience_qs=experience_qs,
    )

    return {
        "seeker_id": seeker.user_id,
        "skills": skills,
        "education": education,
        "experience": experience,
        "total_experience_years": total_experience_years,
        "is_matchable": True,
        "updated_at": updated_at,
    }


def build_seeker_matching_metadata(seeker_id):
    seeker = get_object_or_404(SeekerProfile, user_id=seeker_id)

    skills_obj = Skills.objects.filter(seeker=seeker).first()
    education_qs = Education.objects.filter(seeker=seeker)
    experience_qs = Experience.objects.filter(seeker=seeker)

    updated_at = get_seeker_payload_updated_at(
        skills_obj=skills_obj,
        education_qs=education_qs,
        experience_qs=experience_qs,
    )

    return {
        "seeker_id": seeker.user_id,
        "updated_at": updated_at,
        "is_matchable": True,
    }
