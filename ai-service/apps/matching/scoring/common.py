from decimal import Decimal


def normalize_skill(skill: str) -> str:
    return skill.strip().lower()


def score_required_skills(job_required_skills: list, seeker_skills: list):
    job_set = {normalize_skill(s) for s in (job_required_skills or []) if s}
    seeker_set = {normalize_skill(s) for s in (seeker_skills or []) if s}

    if not job_set:
        return Decimal("100.00"), [], []

    matched = sorted(list(job_set & seeker_set))
    missing = sorted(list(job_set - seeker_set))

    score = (len(matched) / len(job_set)) * 100
    return Decimal(str(round(score, 2))), matched, missing


def score_experience(min_experience_years, seeker_total_experience_years):
    min_exp = float(min_experience_years or 0)
    seeker_exp = float(seeker_total_experience_years or 0)

    if min_exp <= 0:
        return Decimal("100.00")

    ratio = min(seeker_exp / min_exp, 1.0)
    score = ratio * 100
    return Decimal(str(round(score, 2)))


def score_education(job_snapshot, seeker_snapshot):
    # V1/V2-A simple neutral heuristic
    return Decimal("100.00")
