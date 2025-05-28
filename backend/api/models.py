from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    phone = models.CharField(max_length=11, blank=True, null=True, unique=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    birth_date = models.DateField(null=True,blank=True)
    facebook_profile = models.URLField(max_length=200,null=True,blank=True)
    country = models.CharField(max_length=100,null=True,blank=True)

class Project():
    pass