from rest_framework import serializers


class GenerateCoverLetterRequestSerializer(serializers.Serializer):
    job_id = serializers.IntegerField()
    seeker_id = serializers.UUIDField()


class CoverLetterResponseSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    seeker_id = serializers.UUIDField()
    job_id = serializers.IntegerField()
    content = serializers.CharField()

    model_name = serializers.CharField()
    prompt_version = serializers.CharField()
    generation_status = serializers.CharField()

    job_snapshot_updated_at = serializers.DateTimeField(allow_null=True)
    seeker_snapshot_updated_at = serializers.DateTimeField(allow_null=True)

    created_at = serializers.DateTimeField()
    updated_at = serializers.DateTimeField()
