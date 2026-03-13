from uuid import UUID
from urllib.parse import parse_qs
import jwt

from django.conf import settings
from channels.middleware import BaseMiddleware


class AnonymousSimpleUser:
    is_authenticated = False
    id = None
    username = None
    role = None

    def __str__(self):
        return "AnonymousUser"


class SimpleUser:
    def __init__(self, payload):
        user_id = payload.get("id")
        if not user_id:
            raise ValueError("Invalid token payload: missing user id")

        self.id = UUID(str(user_id))
        self.username = payload.get("username")
        self.role = payload.get("role")
        self.is_authenticated = True

    def __str__(self):
        return f"{self.username or 'User'} ({self.id})"


class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        scope["user"] = AnonymousSimpleUser()

        try:
            query_string = scope.get("query_string", b"").decode()
            query_params = parse_qs(query_string)

            token_list = query_params.get("token")
            token = token_list[0] if token_list else None

            if token:
                payload = jwt.decode(
                    token,
                    settings.SIMPLE_JWT_SECRET_KEY,
                    algorithms=["HS256"]
                )
                scope["user"] = SimpleUser(payload)

        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, ValueError):
            scope["user"] = AnonymousSimpleUser()
        except Exception:
            scope["user"] = AnonymousSimpleUser()

        return await super().__call__(scope, receive, send)
