import re
import json
from rest_framework import serializers
from api.models import CustomUser
from .models import Project, Tag, Category, ProjectImage, Reply, Comment,ProjectReport,CommentReport,ProjectRating,Donation
from django.contrib.auth import get_user_model
from rest_framework.fields import ListField


class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = CustomUser
        fields = [
            "id",
            "first_name",
            "last_name",
            "username",
            "email",
            "password",
            "phone",
            "profile_picture",
            "birth_date",
            "facebook_profile",
            "country",
        ]

    def validate_phone(self, value):
        if value and not re.match(r"^01[0-2,5]{1}[0-9]{8}$", value):
            raise serializers.ValidationError("Must be a valid Egyptian Phone Number")
        return value




class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ["username", "email", "password", "confirm_password", "profile_picture", "phone"]

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs
    
    def validate_phone(self, value):
        if value and not re.match(r"^01[0-2,5]{1}[0-9]{8}$", value):
            raise serializers.ValidationError("Must be a valid Egyptian Phone Number")
        return value

    def create(self, validated_data):
        validated_data.pop("confirm_password")
        password = validated_data.pop("password")
        user = self.Meta.model(**validated_data)
        user.set_password(password)
        user.save()
        return user


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name"]

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'profile_picture'] 


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]


class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ["id", "image"]


class ReplySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Reply
        fields = ["id", "user", "content", "created_at"]
        read_only_fields = ["id", "user", "created_at"]


class CommentSerializer(serializers.ModelSerializer):
    replies = ReplySerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True) 

    class Meta:
        model = Comment
        fields = ["id", "user", "project", "content", "created_at", "replies"]
        read_only_fields = ["id", "user", "project", "created_at", "replies"]

class ProjectSerializer(serializers.ModelSerializer):
    project_creator = UserSerializer(read_only=True)
    images = ProjectImageSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    tags_detail = TagSerializer(source='tags', many=True, read_only=True) 
    category_detail = CategorySerializer(source='category', read_only=True) 

    tags = serializers.CharField(write_only=True)
    category = serializers.CharField(write_only=True)

    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'details',
            'total_target', 'tags', 'tags_detail',
            'start_date', 'end_date','donation_amount',
            'category', 'category_detail',
            'project_creator',
            'created_at',
            'images', 'comments', 'average_rating','is_cancelled'
        ]

    def get_average_rating(self, obj):
        return obj.average_rating


    def create(self, validated_data):
        tags_str = validated_data.pop('tags', '')
        category_name = validated_data.pop('category')

        user = self.context['request'].user
        project = Project.objects.create(**validated_data, project_creator=user)

        category, created = Category.objects.get_or_create(name=category_name)
        project.category = category
        project.save()

        tags_list = [t.strip() for t in tags_str.split(",") if t.strip()]
        for tag_name in tags_list:
            tag, created = Tag.objects.get_or_create(name=tag_name)
            project.tags.add(tag)

        request = self.context.get('request')
        if request and request.FILES:
            images_files = request.FILES.getlist('images')
            for image_file in images_files:
                ProjectImage.objects.create(project=project, image=image_file)

        return project

class ProjectReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectReport
        fields = ['id', 'project', 'reason', 'created_at']
        read_only_fields = ['id', 'created_at']

class CommentReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentReport
        fields = ['id', 'comment', 'reason', 'created_at']
        read_only_fields = ['id', 'created_at']

class ProjectRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectRating
        fields = ['rating']

class DonationSerializer(serializers.ModelSerializer):
    project_title = serializers.CharField(source="project.title", read_only=True)
    class Meta:
        model = Donation
        fields = ['id', 'user', 'project', 'amount', 'created_at', 'project_title']
        read_only_fields = ['user', 'created_at']