from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied

from company.models import Company, Job, Application


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = "__all__"
        read_only_fields = ['user_id']

    def create(self, validated_data):
        validated_data['user_id'] = self.context['request'].user.id
        print("validatesss", validated_data)
        return super().create(validated_data)


class JobSerializer(serializers.ModelSerializer):
    company = CompanySerializer(required=False)

    class Meta:
        model = Job
        fields = "__all__"
        read_only_fields = ['user_id']

    def create(self, validated_data):
        user_id = self.context['request'].user.id

        try:
            company = Company.objects.get(user_id=user_id)
        except ObjectDoesNotExist:
            raise serializers.ValidationError("The user does not have an associated company.")

        if not company.is_active:
            raise PermissionDenied("The company approval is pending at the Admin.")

        validated_data['company'] = company
        return super().create(validated_data)


class ApplicationSerializer(serializers.ModelSerializer):
    job = serializers.PrimaryKeyRelatedField(queryset=Job.objects.all())

    class Meta:
        model = Application
        fields = "__all__"
        read_only_fields = ['applicant_id']

    def create(self, validated_data):
        validated_data['applicant_id'] = self.context['request'].user.id
        return super().create(validated_data)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['job'] = JobSerializer(instance.job).data
        # representation['applicant'] = SeekerProfileSerializer(instance.applicant).data
        return representation


class JobMatchingPayloadSerializer(serializers.Serializer):
    job_id = serializers.UUIDField()
    company_id = serializers.UUIDField(allow_null=True)
    title = serializers.CharField()
    description = serializers.CharField()
    # required_skills = serializers.ListField(child=serializers.CharField())
    required_skills = serializers.JSONField()
    min_experience_years = serializers.IntegerField()
    is_matchable = serializers.BooleanField()
    updated_at = serializers.DateTimeField()
