def build_match_explanation(
    required_skill_score,
    experience_score,
    education_score,
    matched_required_skills,
    missing_required_skills,
):
    strengths = []
    gaps = []

    if matched_required_skills:
        strengths.append(
            f"Matched required skills: {', '.join(matched_required_skills[:5])}"
        )

    if missing_required_skills:
        gaps.append(
            f"Missing required skills: {', '.join(missing_required_skills[:5])}"
        )

    return {
        "summary": "Score is based on required skills, experience, and a basic education heuristic.",
        "strengths": strengths,
        "gaps": gaps,
        "breakdown": {
            "required_skill_score": float(required_skill_score),
            "experience_score": float(experience_score),
            "education_score": float(education_score),
        },
    }
