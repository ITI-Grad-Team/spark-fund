import re
from rest_framework import serializers
from api.models import CustomUser
from .models import Project, Tag, Category, ProjectImage
from django.contrib.auth import get_user_model

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name','username', 'email', 'password', 'phone', 'profile_picture','birth_date','facebook_profile','country']
        read_only_fields = ['email','username']


    def validate_phone(self, value):
            if value and not re.match(r'^01[0-2,5]{1}[0-9]{8}$', value):
                raise serializers.ValidationError("Must be a valid Egyptian Phone Number")
            return value    


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class CategorySerializer(serializers.ModelSerializer):
     class Meta:
        model = Category
        fields = ['id', 'name']

class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ['id', 'name']

class ProjectSerializer(serializers.ModelSerializer):
    pass
