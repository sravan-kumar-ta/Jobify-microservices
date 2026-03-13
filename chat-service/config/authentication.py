from uuid import UUID
import jwt
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed


class SimpleUser:
    def __init__(self, payload):
        user_id = payload.get("id")
        if not user_id:
            raise AuthenticationFailed("Invalid token payload: missing user id")

        self.id = UUID(str(user_id))
        self.username = payload.get("username")
        self.role = payload.get("role")
        self.is_authenticated = True

    def __str__(self):
        return f"{self.username or 'User'} ({self.id})"


class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")

        if not auth_header or not auth_header.startswith("Bearer "):
            return None

        token = auth_header.split(" ")[1]

        try:
            payload = jwt.decode(
                token,
                settings.SIMPLE_JWT_SECRET_KEY,
                algorithms=["HS256"]
            )
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token expired")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Invalid token")

        user = SimpleUser(payload)
        return (user, None)
