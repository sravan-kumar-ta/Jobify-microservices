from datetime import datetime
from rest_framework import serializers
from seeker.models import Education, SeekerProfile, Resume, Experience, Skills


class SeekerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SeekerProfile
        fields = "__all__"
        read_only_fields = ['user_id']

    def create(self, validated_data):
        validated_data['user_id'] = self.context['request'].user.id
        return super().create(validated_data)


class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = "__all__"
        read_only_fields = ['seeker']

    def create(self, validated_data):
        user = self.context['request'].user

        seeker_qs = SeekerProfile.objects.filter(user_id=user.id)
        if not seeker_qs.exists():
            raise serializers.ValidationError("Seeker profile does not exist for the current user.")

        validated_data['seeker'] = SeekerProfile.objects.get(user_id=self.context['request'].user.id)
        return super().create(validated_data)


class MonthField(serializers.DateField):
    def to_internal_value(self, value):
        try:
            return datetime.strptime(f"{value}-01", "%Y-%m-%d").date()
        except ValueError:
            raise serializers.ValidationError("Invalid month format. Expected 'YYYY-MM'.")

    def to_representation(self, value):
        return value.strftime("%Y-%m")


class ExperienceSerializer(serializers.ModelSerializer):
    start_date = MonthField()
    end_date = MonthField(required=False, allow_null=True)

    class Meta:
        model = Experience
        fields = "__all__"
        read_only_fields = ['seeker']

    def validate(self, attrs):
        start_date = attrs.get("start_date")
        end_date = attrs.get("end_date")
        is_current = attrs.get("is_current", False)

        if is_current:
            attrs["end_date"] = None
        else:
            if not end_date:
                raise serializers.ValidationError({
                    "end_date": "End date is required if this is not your current job."
                })

        if start_date and end_date and end_date < start_date:
            raise serializers.ValidationError({
                "end_date": "End date cannot be earlier than start date."
            })

        return attrs

    def create(self, validated_data):
        validated_data['seeker'] = SeekerProfile.objects.get(
            user_id=self.context['request'].user.id
        )
        return super().create(validated_data)


class SkillsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skills
        fields = "__all__"
        read_only_fields = ['seeker']

    def create(self, validated_data):
        validated_data['seeker'] = SeekerProfile.objects.get(
            user_id=self.context['request'].user.id)
        return super().create(validated_data)


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = "__all__"
        read_only_fields = ['seeker']

    def create(self, validated_data):
        validated_data['seeker'] = SeekerProfile.objects.get(
            user_id=self.context['request'].user.id)
        return super().create(validated_data)


class SeekerMatchingPayloadSerializer(serializers.Serializer):
    seeker_id = serializers.UUIDField()
    skills = serializers.ListField(child=serializers.CharField())
    education = serializers.ListField()
    experience = serializers.ListField()
    total_experience_years = serializers.FloatField()
    is_matchable = serializers.BooleanField()
    updated_at = serializers.DateTimeField()


class SeekerMatchingMetadataSerializer(serializers.Serializer):
    seeker_id = serializers.UUIDField()
    updated_at = serializers.DateTimeField(allow_null=True)
    is_matchable = serializers.BooleanField()
