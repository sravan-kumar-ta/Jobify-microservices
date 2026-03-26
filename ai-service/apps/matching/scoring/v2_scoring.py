from decimal import Decimal
import math


def cosine_similarity(vec1: list[float], vec2: list[float]) -> float:
    if not vec1 or not vec2:
        return 0.0

    dot_product = sum(a * b for a, b in zip(vec1, vec2))
    norm1 = math.sqrt(sum(a * a for a in vec1))
    norm2 = math.sqrt(sum(b * b for b in vec2))

    if norm1 == 0 or norm2 == 0:
        return 0.0

    return dot_product / (norm1 * norm2)


def cosine_to_score(cosine_value: float) -> Decimal:
    cosine_value = max(min(cosine_value, 1.0), -1.0)
    score = ((cosine_value + 1) / 2) * 100
    return Decimal(str(round(score, 2)))


def calculate_v2_hybrid_score(rule_based_score, semantic_score):
    final = (float(rule_based_score) * 0.70) + (float(semantic_score) * 0.30)
    return Decimal(str(round(min(final, 100), 2)))
