import json
from uuid import UUID

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from .models import Message, PrivateChatRoom


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope.get("user")

        if not self.user or not getattr(self.user, "is_authenticated", False):
            await self.close()
            return

        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"

        is_allowed = await self.user_can_access_room(self.user.id, self.room_name)
        if not is_allowed:
            await self.close()
            return

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, "room_group_name"):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        if not self.user or not getattr(self.user, "is_authenticated", False):
            await self.close()
            return

        try:
            data = json.loads(text_data)
        except json.JSONDecodeError:
            return

        text = data.get("text", "").strip()
        if not text:
            return

        saved_message = await self.save_message(
            room_name=self.room_name,
            sender_id=self.user.id,
            text=text
        )

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "id": saved_message["id"],
                "room_name": saved_message["room_name"],
                "sender_id": saved_message["sender_id"],
                "text": saved_message["text"],
                "timestamp": saved_message["timestamp"],
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "id": event["id"],
            "room_name": event["room_name"],
            "sender_id": event["sender_id"],
            "text": event["text"],
            "timestamp": event["timestamp"],
        }))

    @database_sync_to_async
    def save_message(self, room_name, sender_id, text):
        msg = Message.objects.create(
            room_name=room_name,
            sender_id=sender_id,
            text=text
        )

        return {
            "id": msg.id,
            "room_name": msg.room_name,
            "sender_id": str(msg.sender_id),
            "text": msg.text,
            "timestamp": msg.timestamp.isoformat(),
        }

    @database_sync_to_async
    def user_can_access_room(self, user_id, room_name):
        try:
            prefix, user1_str, user2_str = room_name.split("_")
            if prefix != "room":
                return False

            user1_id = UUID(user1_str)
            user2_id = UUID(user2_str)
            current_user_id = UUID(str(user_id))

            if current_user_id not in [user1_id, user2_id]:
                return False

            low_id, high_id = sorted([user1_id, user2_id])

            return PrivateChatRoom.objects.filter(
                user1_id=low_id,
                user2_id=high_id
            ).exists()

        except Exception:
            return False
