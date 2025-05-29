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
    path('customuser/', views.CustomUserAPIView.as_view()),
    path('customuser/<int:id>/', views.CustomUserAPIView.as_view()),
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('projects/create/', views.ProjectCreateView.as_view(), name='project-create'),
    path('projects/', views.ProjectAPIView.as_view(), name='project-list'),
    path('projects/<int:id>/', views.ProjectAPIView.as_view(), name='project-detail'),
    path('projects/rate/<int:id>/', views.ProjectRateAPIView.as_view(), name='project-rate'),
    path('projects/<int:project_id>/comment/', views.ProjectAddCommentAPIView.as_view(), name='project-add-comment'),
    path('comments/<int:comment_id>/reply/', views.CommentAddReplyAPIView.as_view(), name='comment-add-reply'),
    path('projects/<int:id>/donate/', views.ProjectDonateAPIView.as_view(), name='add-donation'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),

]



if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
