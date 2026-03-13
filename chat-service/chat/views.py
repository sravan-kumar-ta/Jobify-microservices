# chat/views.py
from uuid import UUID

from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import PrivateChatRoom, Message
from .serializers import MessageSerializer


class GetOrCreateRoomView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            current_user_id = UUID(str(request.user.id))
            other_user_id = UUID(str(request.data.get("user_id")))

            if current_user_id == other_user_id:
                return Response(
                    {"error": "You cannot create a chat with yourself."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            low_id, high_id = sorted([current_user_id, other_user_id])

            room, created = PrivateChatRoom.objects.get_or_create(
                user1_id=low_id,
                user2_id=high_id
            )

            return Response(
                {
                    "room_name": room.get_room_name(),
                    "created": created,
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class RoomListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user_id = UUID(str(request.user.id))

            rooms = PrivateChatRoom.objects.filter(user1_id=user_id) | PrivateChatRoom.objects.filter(user2_id=user_id)

            data = []
            for room in rooms:
                room_name = room.get_room_name()
                other_id = room.user2_id if room.user1_id == user_id else room.user1_id

                last_msg = Message.objects.filter(room_name=room_name).order_by("-timestamp").first()

                data.append({
                    "room_id": room_name,
                    "user_id": str(other_id),
                    "last_message": last_msg.text if last_msg else "",
                    "last_message_time": last_msg.timestamp.isoformat() if last_msg else None,
                })

            data.sort(
                key=lambda x: x["last_message_time"] or "",
                reverse=True
            )

            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class MessageListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer

    def get_queryset(self):
        room_name = self.kwargs["room_name"]

        try:
            current_user_id = UUID(str(self.request.user.id))

            prefix, user1_str, user2_str = room_name.split("_")
            if prefix != "room":
                return Message.objects.none()

            user1_id = UUID(user1_str)
            user2_id = UUID(user2_str)

            if current_user_id not in [user1_id, user2_id]:
                return Message.objects.none()

            low_id, high_id = sorted([user1_id, user2_id])

            room_exists = PrivateChatRoom.objects.filter(
                user1_id=low_id,
                user2_id=high_id
            ).exists()

            if not room_exists:
                return Message.objects.none()

            return Message.objects.filter(room_name=room_name)

        except Exception:
            return Message.objects.none()
