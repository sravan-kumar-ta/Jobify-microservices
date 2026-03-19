
from django.conf import settings
from rest_framework.permissions import BasePermission


class IsCompanyOrAdmin(BasePermission):
    def has_permission(self, request, view):
        if view.action in ['retrieve', 'list']:
            return True

        if view.action in ['create', 'update', 'partial_update']:
            return request.user.role in ['admin', 'company']

        return False


class IsCompany(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == "company"


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == "admin"


class RoleBasedPermission(BasePermission):
    def has_permission(self, request, view):
        user = request.user

        if user.role == 'admin':
            return True

        if user.role == 'company':
            if view.action in ['retrieve', 'list', 'partial_update']:
                return True

        if user.role == 'job_seeker':
            if view.action in ['create', 'destroy', 'retrieve', 'list']:
                return True

        return False


class IsInternalService(BasePermission):
    def has_permission(self, request, view):
        token = request.headers.get("X-Internal-Service-Token")
        return token == settings.INTERNAL_SERVICE_TOKEN
