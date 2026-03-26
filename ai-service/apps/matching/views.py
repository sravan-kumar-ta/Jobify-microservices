from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from apps.common.exceptions import ServiceIntegrationError
from .serializers import GenerateMatchRequestSerializer, MatchResultResponseSerializer
from .services.v1_service import generate_match_v1
from .services.v2_service import generate_match_v2


class GenerateMatchV1View(APIView):
    def post(self, request):
        serializer = GenerateMatchRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            result = generate_match_v1(
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


class GenerateMatchV2View(APIView):
    def post(self, request):
        serializer = GenerateMatchRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            result = generate_match_v2(
                job_id=serializer.validated_data["job_id"],
                seeker_id=serializer.validated_data["seeker_id"],
            )
        except ServiceIntegrationError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_502_BAD_GATEWAY)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(
            MatchResultResponseSerializer(result).data,
            status=status.HTTP_200_OK,
        )
