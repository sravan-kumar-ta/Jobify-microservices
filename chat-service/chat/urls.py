from django.urls import path
from .views import GetOrCreateRoomView, RoomListView, MessageListView

urlpatterns = [
    path("get-room/", GetOrCreateRoomView.as_view(), name="get-or-create-room"),
    path("rooms/", RoomListView.as_view(), name="room-list"),
    path("messages/<str:room_name>/", MessageListView.as_view(), name="message-list"),
]
