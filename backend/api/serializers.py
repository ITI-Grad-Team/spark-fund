import re
import json
from rest_framework import serializers
from api.models import CustomUser
from .models import Project, Tag, Category, ProjectImage, Reply, Comment
from django.contrib.auth import get_user_model
from rest_framework.fields import ListField
from .models import ProjectReport

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
        fields = ["username", "email", "password", "confirm_password"]

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

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


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]


class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ["id", "image"]


class ReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = Reply
        fields = ["id", "user", "content", "created_at"]
        read_only_fields = ["id", "user", "created_at"]


class CommentSerializer(serializers.ModelSerializer):
    replies = ReplySerializer(many=True, read_only=True)

    class Meta:
        model = Comment
        fields = ["id", "user", "project", "content", "created_at", "replies"]
        read_only_fields = ["id", "user", "project", "created_at", "replies"]


class ProjectSerializer(serializers.ModelSerializer):
    project_creator = serializers.PrimaryKeyRelatedField(
        queryset=get_user_model().objects.all(), required=False
    )
    images = serializers.ListField(
        child=serializers.ImageField(), required=False, write_only=True
    )
    comments = CommentSerializer(many=True, read_only=True)
    tags = serializers.JSONField(write_only=True)
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            "id",
            "title",
            "details",
            "total_target",
            "tags",
            "start_date",
            "end_date",
            "category",
            "project_creator",
            "created_at",
            "images",
            "comments",
            "average_rating",
        ]

    def get_average_rating(self, obj):
        return obj.average_rating()

    def validate_tags(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError(
                {"tags": 'Tags must be a list of objects with "name" field'}
            )
        tags = []
        for tag in value:
            if not isinstance(tag, dict) or "name" not in tag:
                raise serializers.ValidationError(
                    {"tags": 'Each tag must be an object with a "name" field'}
                )
            tag_name = str(tag["name"]).strip()
            if not tag_name:
                raise serializers.ValidationError({"tags": "Tag names cannot be empty"})
            tags.append(tag_name)
        if not tags:
            raise serializers.ValidationError(
                {"tags": "At least one valid tag is required"}
            )
        return tags

    def create(self, validated_data):
        tags_data = validated_data.pop("tags", [])
        category_data = validated_data.pop("category")
        images_data = validated_data.pop("images", [])

        project = Project.objects.create(
            **validated_data,
            category=category_data,
            project_creator=self.context["request"].user
        )

        for tag_name in tags_data:
            tag, created = Tag.objects.get_or_create(name=tag_name)
            project.tags.add(tag)

        for image in images_data:
            ProjectImage.objects.create(project=project, image=image)

        return project

class ProjectReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectReport
        fields = ['id', 'project', 'reason', 'created_at']
        read_only_fields = ['id', 'created_at']
