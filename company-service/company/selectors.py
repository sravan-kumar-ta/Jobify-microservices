def build_job_matching_metadata(job):
    return {
        "job_id": job.id,
        "updated_at": job.updated_at,
        "is_matchable": True,
    }


def build_job_matching_payload(job):
    raw_skills = job.skills or ""
    skills_list = [item.strip() for item in raw_skills.split(",")] if raw_skills else []

    return {
        "job_id": job.id,
        "company_id": job.company_id,
        "title": job.title,
        "description": job.description,
        "required_skills": skills_list,
        "min_experience_years": job.experience,
        "is_matchable": True,
        "updated_at": job.updated_at,
    }
