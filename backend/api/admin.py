from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Project, ProjectImage, Tag, Category, Comment, Reply
from .models import ProjectReport

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    fieldsets = UserAdmin.fieldsets + (
        (
            None,
            {
                "fields": (
                    "phone",
                    "profile_picture",
                    "birth_date",
                    "facebook_profile",
                    "country",
                )
            },
        ),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (
            None,
            {
                "fields": (
                    "phone",
                    "profile_picture",
                    "birth_date",
                    "facebook_profile",
                    "country",
                )
            },
        ),
    )
    list_display = ["username", "email", "phone", "is_staff"]


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ["title", "project_creator", "start_date", "end_date", "created_at"]
    search_fields = ["title", "details"]
    list_filter = ["category", "start_date", "end_date"]
    date_hierarchy = "created_at"


@admin.register(ProjectImage)
class ProjectImageAdmin(admin.ModelAdmin):
    list_display = ["project", "image"]


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ["name"]


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name"]


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ["project", "user", "created_at"]
    search_fields = ["content"]


@admin.register(Reply)
class ReplyAdmin(admin.ModelAdmin):
    list_display = ["comment", "user", "created_at"]
    search_fields = ["content"]
    
@admin.register(ProjectReport)
class ProjectReportAdmin(admin.ModelAdmin):
    list_display = ('project', 'reporter', 'created_at')
    search_fields = ('project__title', 'reporter__username', 'reason')
