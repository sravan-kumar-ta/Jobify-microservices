from django.db import models


class PrivateChatRoom(models.Model):
    user1_id = models.UUIDField()
    user2_id = models.UUIDField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user1_id', 'user2_id')

    def save(self, *args, **kwargs):
        if self.user1_id > self.user2_id:
            self.user1_id, self.user2_id = self.user2_id, self.user1_id
        super().save(*args, **kwargs)

    def get_room_name(self):
        return f"room_{self.user1_id}_{self.user2_id}"


class Message(models.Model):
    room_name = models.CharField(max_length=255, db_index=True)
    sender_id = models.UUIDField()
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"{self.sender_id} -> {self.room_name}: {self.text[:20]}"
