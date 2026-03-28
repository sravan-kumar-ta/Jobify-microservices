from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from apps.common.exceptions import ServiceIntegrationError
from .serializers import (
    GenerateCoverLetterRequestSerializer,
    CoverLetterResponseSerializer,
)
from .services import generate_cover_letter


class GenerateCoverLetterView(APIView):
    def post(self, request):
        serializer = GenerateCoverLetterRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            cover_letter = generate_cover_letter(
                job_id=serializer.validated_data["job_id"],
                seeker_id=serializer.validated_data["seeker_id"],
            )
        except ServiceIntegrationError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_502_BAD_GATEWAY)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(
            CoverLetterResponseSerializer(cover_letter).data,
            status=status.HTTP_201_CREATED,
        )
