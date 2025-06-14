from django.urls import path
from . import views
from .views import (
    CustomUserAPIView,
    RegisterView,
    ActivateAccountView,
    ResendActivationEmailView,
    GoogleAuthView,
    UserProfileView,
    ProjectCreateView,
    ProjectAPIView,
    CategoryListView,
    ProjectRateAPIView,
    ProjectAddCommentAPIView,
    CommentAddReplyAPIView,
    ProjectDonateAPIView,
    ProjectReportView,
    UserListView,
    UserDetailView,
    CommentReportView,
    LogoutView,
    ProjectRatingView,
    UserProjectRatingView,
    CancelProjectAPIView,
    DonateToProject,
    UserDonationAmount,
    PasswordResetRequestView,
    PasswordResetConfirmView,
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("users/", CustomUserAPIView.as_view(), name="users"),
    path("register/", RegisterView.as_view(), name="register"),
    path("activate/<uidb64>/<token>/", ActivateAccountView.as_view(), name="activate"),
    path(
        "resend-activation/",
        ResendActivationEmailView.as_view(),
        name="resend_activation",
    ),
    path("google-login/", GoogleAuthView.as_view(), name="google_login"),
    path("profile/", UserProfileView.as_view(), name="user_profile"),
    path("projects/create/", ProjectCreateView.as_view(), name="project_create"),
    path("projects/", ProjectAPIView.as_view(), name="projects"),
    path("projects/<int:id>/", ProjectAPIView.as_view(), name="project_detail"),
    path("categories/", CategoryListView.as_view(), name="categories"),
    path("projects/<int:id>/rate/", ProjectRateAPIView.as_view(), name="project_rate"),
    path(
        "projects/<int:project_id>/comment/",
        ProjectAddCommentAPIView.as_view(),
        name="project_comment",
    ),
    path(
        "comments/<int:comment_id>/reply/",
        CommentAddReplyAPIView.as_view(),
        name="comment_reply",
    ),
    path(
        "projects/<int:id>/donate/",
        ProjectDonateAPIView.as_view(),
        name="project_donate",
    ),
    path("register/", views.RegisterView.as_view(), name="register"),
    path("login/", views.CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("google-login/", views.GoogleAuthView.as_view(), name="google_register"),
    path(
        "projects/<int:project_id>/report/",
        ProjectReportView.as_view(),
        name="project_report",
    ),
    path("users/list/", UserListView.as_view(), name="user_list"),
    path("users/<int:id>/", UserDetailView.as_view(), name="user_detail"),
    path(
        "comments/<int:comment_id>/report/",
        CommentReportView.as_view(),
        name="comment_report",
    ),
    path("customuser/", views.UserListView.as_view(), name="user-list"),
    path("customuser/<int:id>/", views.UserDetailView.as_view(), name="user-detail"),
    path(
        "update-user/<int:id>/", views.CustomUserAPIView.as_view(), name="update-user"
    ),
    path(
        "projects/<int:pk>/rating/", ProjectRatingView.as_view(), name="project_rating"
    ),
    path(
        "projects/<int:project_id>/user-rating/",
        UserProjectRatingView.as_view(),
        name="user_project_rating",
    ),
    path(
        "projects/<int:pk>/cancel/",
        CancelProjectAPIView.as_view(),
        name="cancel_project",
    ),
    path(
        "projects/<int:project_id>/donate/",
        DonateToProject.as_view(),
        name="donate_to_project",
    ),
    path(
        "projects/<int:project_id>/donation-amount/",
        UserDonationAmount.as_view(),
        name="user_donation_amount",
    ),
    path(
        "auth/password/reset/",
        PasswordResetRequestView.as_view(),
        name="password_reset",
    ),
    path(
        "auth/password/reset/confirm/<uidb64>/<token>/",
        PasswordResetConfirmView.as_view(),
        name="password_reset_confirm",
    ),
    path("customuser/me/", views.CurrentUserView.as_view(), name="current_user"),
    path("my-donations/", views.MyDonationsAPIView.as_view(), name="my-donations"),
    path(
        "change-password/", views.ChangePasswordView.as_view(), name="change-password"
    ),
    path("logout/", views.LogoutView.as_view(), name="logout"),
    path(
        "category-names/", views.CategoryNamesAPIView.as_view(), name="category-names"
    ),
]
