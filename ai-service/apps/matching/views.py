from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from apps.common.exceptions import ServiceIntegrationError
from .serializers import GenerateMatchRequestSerializer, MatchResultResponseSerializer
from .services import generate_match


class GenerateMatchView(APIView):
    def post(self, request):
        serializer = GenerateMatchRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            result = generate_match(
                job_id=serializer.validated_data["job_id"],
                seeker_id=serializer.validated_data["seeker_id"],
            )
        except ServiceIntegrationError as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_502_BAD_GATEWAY,
            )
        except ValueError as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            MatchResultResponseSerializer(result).data,
            status=status.HTTP_201_CREATED,
        )
