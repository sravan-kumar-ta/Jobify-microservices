from decimal import Decimal


def normalize_skill(skill: str) -> str:
    return skill.strip().lower()

# Required skill score
def score_required_skills(job_required_skills: list, seeker_skills: list):
    job_set = {normalize_skill(s) for s in job_required_skills if s}
    seeker_set = {normalize_skill(s) for s in seeker_skills if s}

    if not job_set:
        return Decimal("100.00"), [], []

    matched = sorted(list(job_set & seeker_set))
    missing = sorted(list(job_set - seeker_set))

    score = (len(matched) / len(job_set)) * 100
    return Decimal(str(round(score, 2))), matched, missing

# Experience score
def score_experience(min_experience_years, seeker_total_experience_years):
    min_exp = float(min_experience_years or 0)
    seeker_exp = float(seeker_total_experience_years or 0)

    if min_exp <= 0:
        return Decimal("100.00")

    ratio = min(seeker_exp / min_exp, 1.0)
    score = ratio * 100
    return Decimal(str(round(score, 2)))

def score_education(job_snapshot, seeker_snapshot):
    # V1: simple neutral score
    # Don't pretend you have strong education logic if job payload doesn't define strict requirements.
    return Decimal("100.00")

# Final weighted score
def calculate_final_score(required_skill_score, experience_score, education_score):
    final = (
        float(required_skill_score) * 0.75
        + float(experience_score) * 0.20
        + float(education_score) * 0.05
    )
    return Decimal(str(round(min(final, 100), 2)))
