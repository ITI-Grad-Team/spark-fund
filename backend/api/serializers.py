import re
import json
from rest_framework import serializers
from api.models import CustomUser
from .models import Project, Tag, Category, ProjectImage, Reply, Comment
from django.contrib.auth import get_user_model
from rest_framework.fields import ListField, DictField

class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name','username', 'email', 'password', 'phone', 'profile_picture','birth_date','facebook_profile','country']



    def validate_phone(self, value):
            if value and not re.match(r'^01[0-2,5]{1}[0-9]{8}$', value):
                raise serializers.ValidationError("Must be a valid Egyptian Phone Number")
            return value    

class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'confirm_password']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('confirm_password') 
        password = validated_data.pop('password')
        user = self.Meta.model(**validated_data)
        user.set_password(password)
        user.save()
        return user
    


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
        fields = ['id', 'image']


# --------------------------------------------
# ProjectSerializer
# --------------------------------------------
# This serializer is responsible for:
# - Handling Project creation logic (tags, category, and creator assignment).
# - Serializing nested relationships (tags, category, images).
# - Ensuring that related objects (tags, category) are created or fetched as needed.

# Technical Advantage of Using Serializer over View:
# ------------------------------------------------------------------------------
#  Separation of Concerns:
#   - The view handles HTTP-level logic (authentication, request/response).
#   - The serializer handles data-level logic (validation, object creation).
#
#  Reusability:
#   - This serializer can be reused across multiple views (CreateAPIView, ViewSets, etc.)
#   - Avoids duplicating logic in different views if needed later.
#
#   Maintainability:
#   - Centralized business logic in the serializer makes it easier to update fields or logic.
#
#  Validation:
#   - Built-in validation methods (e.g. validate_<field>) can be used easily in serializers.
#
#   Cleaner Views:
#   - Views remain clean and focused on routing and permissions instead of data handling.

class ReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = Reply
        fields = ['id', 'user', 'content', 'created_at']
        read_only_fields = ['id', 'user',  'created_at']

class CommentSerializer(serializers.ModelSerializer):
    replies = ReplySerializer(many=True, read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'user', 'project' ,'content', 'created_at', 'replies']
        read_only_fields = ['id', 'user', 'project' , 'created_at', 'replies']




class ProjectSerializer(serializers.ModelSerializer):
    project_creator = serializers.PrimaryKeyRelatedField(queryset=get_user_model().objects.all(), required=False)
    images = serializers.ListField(child=serializers.ImageField(), required=False, write_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    tags = ListField(child=DictField(), write_only=True)
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'details',
            'total_target', 'tags',
            'start_date', 'end_date',
            'category', 'project_creator',
            'created_at', 
            'images',  'comments' ,'average_rating'
        ]

    def get_average_rating(self, obj):
        return obj.average_rating()
    def to_internal_value(self, data):
            # Convert tags JSON string to Python objects before validation
            if isinstance(data.get('tags'), str):
                try:
                    data['tags'] = json.loads(data['tags'])
                except json.JSONDecodeError:
                    raise serializers.ValidationError({'tags': 'Invalid format'})
            return super().to_internal_value(data)
    
    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])
        category_data = validated_data.pop('category')

        # Create the Project instance
        project = Project.objects.create(
            **validated_data,
            category=category_data,
            project_creator=self.context['request'].user
        )

        # Handle tag creation or reuse
        for tag_data in tags_data:
            tag, created = Tag.objects.get_or_create(name=tag_data['name'])
            project.tags.add(tag)

        # Handle images
        images_data = self.context['request'].FILES.getlist('images')
        for image in images_data:
            ProjectImage.objects.create(project=project, image=image)

        return project

