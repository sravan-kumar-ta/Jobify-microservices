from decimal import Decimal


def calculate_v1_score(required_skill_score, experience_score, education_score):
    final = (
        float(required_skill_score) * 0.75
        + float(experience_score) * 0.20
        + float(education_score) * 0.05
    )
    return Decimal(str(round(min(final, 100), 2)))
