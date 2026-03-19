from django.conf import settings
from rest_framework.permissions import BasePermission


class IsAdminOrOwner(BasePermission):
    def has_permission(self, request, view):
        if view.action in ['retrieve', 'list']:
            return True

        if view.action in ['create', 'update', 'partial_update', 'destroy']:
            return request.user.role in ['admin', 'job_seeker']

        return False

    def has_object_permission(self, request, view, obj):
        if request.user.role == 'admin':
            return True

        if request.user.role == 'job_seeker' and obj.seeker.user_id == request.user.id:
            return True

        return False


class IsInternalService(BasePermission):
    def has_permission(self, request, view):
        token = request.headers.get("X-Internal-Service-Token")
        return token == settings.INTERNAL_SERVICE_TOKEN
