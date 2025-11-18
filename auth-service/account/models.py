import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models

ROLE_CHOICES = (
    ('job_seeker', 'Job Seeker'),
    ('company', 'Company'),
    ('admin', 'Admin'),
)

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='admin')
    email = models.EmailField(unique=True)
