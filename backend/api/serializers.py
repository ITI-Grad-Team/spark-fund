from rest_framework import serializers
from api.models import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name','username', 'email', 'password', 'phone', 'profile_picture']
