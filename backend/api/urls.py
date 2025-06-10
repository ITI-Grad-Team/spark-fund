"""
URL configuration for project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.urls import path
from django.conf.urls.static import static
from project import settings
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("profile/", views.UserProfileView.as_view(), name="user-profile"),
    path("projects/create/", views.ProjectCreateView.as_view(), name="project-create"),
    path("categories/", views.CategoryListView.as_view(), name="category-list"),
    path("projects/", views.ProjectAPIView.as_view(), name="project-list"),
    path("projects/<int:id>/", views.ProjectAPIView.as_view(), name="project-detail"),
    path(
        "projects/<int:project_id>/comment/",
        views.ProjectAddCommentAPIView.as_view(),
        name="project-add-comment",
    ),
    path(
        "comments/<int:comment_id>/reply/",
        views.CommentAddReplyAPIView.as_view(),
        name="comment-add-reply",
    ),
    path("register/", views.RegisterView.as_view(), name="register"),
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("google-login/", views.GoogleAuthView.as_view(), name="google_register"),
    path(
        "projects/<int:project_id>/report/",
        views.ProjectReportView.as_view(),
        name="project-report",
    ),
    path(
        "comments/<int:comment_id>/report/",
        views.CommentReportView.as_view(),
        name="comment-report",
    ),
    path("customuser/", views.UserListView.as_view(), name="user-list"),
    path("customuser/<int:id>/", views.UserDetailView.as_view(), name="user-detail"),
    path("update-user/<int:id>/", views.CustomUserAPIView.as_view(), name="update-user"),
    path(
        "projects/<int:project_id>/report/",
        views.ProjectReportView.as_view(),
        name="project-report",
    ),
    path("customuser/", views.UserListView.as_view(), name="user-list"),
    path("customuser/<int:id>/", views.UserDetailView.as_view(), name="user-detail"),
    path(
        "projects/<int:pk>/rate/",
        views.ProjectRatingView.as_view(),
        name="rate_project",
    ),
    path(
        "projects/<int:project_id>/my-rating/",
        views.UserProjectRatingView.as_view(),
        name="user_project_rating",
    ),
    path(
        "projects/<int:pk>/cancel/",
        views.CancelProjectAPIView.as_view(),
        name="cancel-project",
    ),
    path("projects/<int:project_id>/donate/", views.DonateToProject.as_view()),
    path(
        "projects/<int:project_id>/donation-amount/", views.UserDonationAmount.as_view()
    ),
    path('customuser/me/', views.CurrentUserView.as_view(), name='current_user'),
    path('my-donations/', views.MyDonationsAPIView.as_view(), name='my-donations'),
    path("logout/", views.LogoutView.as_view(), name="logout"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
