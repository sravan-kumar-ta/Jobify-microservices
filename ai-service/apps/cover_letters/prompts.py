def build_cover_letter_prompt(job_snapshot, seeker_snapshot) -> str:
    job_skills = ", ".join(job_snapshot.required_skills or [])
    seeker_skills = ", ".join(seeker_snapshot.skills or [])

    education_lines = []
    for edu in seeker_snapshot.education or []:
        degree = edu.get("degree", "")
        start_year = edu.get("start_year", "")
        end_year = edu.get("end_year", "")
        education_lines.append(
            f"- {degree} ({start_year} to {end_year or 'Present'})")

    experience_lines = []
    for exp in seeker_snapshot.experience or []:
        title = exp.get("job_title", "")
        start_date = exp.get("start_date", "")
        end_date = exp.get("end_date", "")
        is_current = exp.get("is_current", False)
        end_label = "Present" if is_current else (end_date or "")
        experience_lines.append(f"- {title} ({start_date} to {end_label})")

    education_text = "\n".join(
        education_lines) if education_lines else "- Not provided"
    experience_text = "\n".join(
        experience_lines) if experience_lines else "- Not provided"

    return f"""
You are an expert career assistant.

Write a professional, concise, and realistic cover letter for a job application.

RULES:
- Output ONLY the cover letter body text.
- Do NOT include placeholders like [Your Name], [Company Name], or [Hiring Manager].
- Do NOT invent fake achievements, projects, certifications, or companies.
- Use only the information provided.
- If seeker information is limited, write a modest but confident letter.
- Keep it between 80 and 150 words.
- Use a professional tone.
- Avoid exaggerated claims.
- Make the letter tailored to the job description and required skills.
- Focus on relevant alignment between the seeker profile and the job.

JOB INFORMATION:
Title: {job_snapshot.title}
Description: {job_snapshot.description}
Required Skills: {job_skills}
Minimum Experience: {job_snapshot.min_experience_years} years

SEEKER INFORMATION:
Skills: {seeker_skills}
Total Experience: {seeker_snapshot.total_experience_years} years

Education:
{education_text}

Experience:
{experience_text}
""".strip()
