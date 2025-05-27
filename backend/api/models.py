from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    phone = models.CharField(max_length=11, blank=True, null=True, unique=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
