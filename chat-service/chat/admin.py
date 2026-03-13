from django.contrib import admin
from chat.models import Message, PrivateChatRoom

# Register your models here.
admin.site.register(PrivateChatRoom)
admin.site.register(Message)
