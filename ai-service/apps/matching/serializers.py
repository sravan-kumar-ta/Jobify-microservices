from rest_framework import serializers


class GenerateMatchRequestSerializer(serializers.Serializer):
    job_id = serializers.IntegerField()
    seeker_id = serializers.UUIDField()


class MatchResultResponseSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    seeker_id = serializers.UUIDField()
    job_id = serializers.IntegerField()
    score = serializers.DecimalField(max_digits=5, decimal_places=2)

    required_skill_score = serializers.DecimalField(
        max_digits=5, decimal_places=2)
    experience_score = serializers.DecimalField(max_digits=5, decimal_places=2)
    education_score = serializers.DecimalField(max_digits=5, decimal_places=2)

    matched_required_skills = serializers.ListField(
        child=serializers.CharField())
    missing_required_skills = serializers.ListField(
        child=serializers.CharField())

    explanation = serializers.JSONField()
    algorithm_version = serializers.CharField()
    created_at = serializers.DateTimeField()
