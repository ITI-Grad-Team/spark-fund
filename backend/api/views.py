from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, permissions
from rest_framework.generics import ListAPIView
from api.models import (
    Category,
    CustomUser,
    Project,
    Comment,
    ProjectReport,
    CommentReport,
    ProjectRating,
    Donation,
)
from api.serializers import (
    CategorySerializer,
    CustomUserSerializer,
    ProjectSerializer,
    CommentSerializer,
    ReplySerializer,
    RegisterSerializer,
    CommentReportSerializer,
    ProjectReportSerializer,
    DonationSerializer,
)
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Sum


class CustomUserAPIView(APIView):
    permission_classes = [IsAuthenticated]

    
    def get(self, request, id=None):
        if id:
            user = get_object_or_404(CustomUser, id=id)
            serializer = CustomUserSerializer(user)
        else:
            users = CustomUser.objects.all()
            serializer = CustomUserSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            password = serializer.validated_data.pop("password")
            user = serializer.save()
            user.set_password(password)
            user.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, id):
        user = get_object_or_404(CustomUser, id=id)
        serializer = CustomUserSerializer(user, data=request.data)
        if serializer.is_valid():
            password = serializer.validated_data.get("password", None)
            user = serializer.save()
            if password:
                user.set_password(password)
                user.save()
            return Response(CustomUserSerializer(user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, id):
        user = get_object_or_404(CustomUser, id=id)
        serializer = CustomUserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        user = get_object_or_404(CustomUser, id=id)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class GoogleAuthView(APIView):
    def post(self, request):
        email = request.data.get("email")
        name = request.data.get("name")

        user, created = CustomUser.objects.get_or_create(
            email=email,
            defaults={
                "username": email.split("@")[0],
                "first_name": name.split()[0],
            },
        )

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "msg": "User created" if created else "User verified",
            }
        )


class UserProfileView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def delete(self, request, *args, **kwargs):
        password = request.data.get("password")
        if not password:
            return Response(
                {"error": "Password is required."}, status=status.HTTP_404_NOT_FOUND
            )
        if not request.user.check_password(password):
            return Response(
                {"message": "Incorrect Password."}, status=status.HTTP_401_UNAUTHORIZED
            )
        request.user.delete()
        return Response(
            {"message": "Account deleted."}, status=status.HTTP_204_NO_CONTENT
        )


class ProjectCreateView(generics.CreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return self.create(request, *args, **kwargs)


class ProjectAPIView(APIView):
    def get(self, request, id=None):
        if id:
            project = get_object_or_404(
                Project.objects.select_related("project_creator", "category")
                .prefetch_related("tags", "images", "comments__replies"),
                id=id,
            )
            serializer = ProjectSerializer(project)
            return Response(serializer.data)

        projects = Project.objects.select_related("project_creator", "category") \
            .prefetch_related("tags", "images", "comments__replies")

        project_creator_id = request.query_params.get("project_creator")
        if project_creator_id and project_creator_id.isdigit():
            projects = projects.filter(project_creator_id=int(project_creator_id))

        tag_name = request.query_params.get("tag")
        if tag_name:
            projects = projects.filter(tags__name__iexact=tag_name)

        limit = request.query_params.get("limit")
        if limit and limit.isdigit():
            projects = projects[:int(limit)]

        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)




class CategoryListView(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class ProjectRateAPIView(APIView):
    def patch(self, request, id):
        project = get_object_or_404(Project, id=id)
        rating = request.data.get("rating")

        if not rating:
            return Response(
                {"error": "Rating is required."}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            rating = float(rating)
            if not (1 <= rating <= 5):
                raise ValueError
        except ValueError:
            return Response(
                {"error": "Rating must be a number between 1 and 5."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        project.sum_of_ratings += rating
        project.rates_count += 1
        project.save()

        return Response(
            {"message": "Rating added.", "new_average": project.average_rating()},
            status=status.HTTP_200_OK,
        )


class ProjectAddCommentAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, project_id):
        project = get_object_or_404(Project, id=project_id)
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, project=project)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CommentAddReplyAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, comment_id):
        comment = get_object_or_404(Comment, id=comment_id)
        serializer = ReplySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, comment=comment)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProjectDonateAPIView(APIView):
    def post(self, request, id):
        project = get_object_or_404(Project, id=id)
        amount = request.data.get("amount")

        if not amount:
            return Response(
                {"error": "Donation amount is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            amount = float(amount)
            if amount <= 0:
                raise ValueError
        except ValueError:
            return Response(
                {"error": "Amount must be a positive number."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        project.donation_amount += amount
        project.save()

        return Response(
            {
                "message": "Donation added successfully.",
                "new_total": project.donation_amount,
            },
            status=status.HTTP_200_OK,
        )


class ProjectReportView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):
        project = get_object_or_404(Project, id=project_id)
        data = request.data.copy()
        data["project"] = project.id
        serializer = ProjectReportSerializer(data=data)

        if serializer.is_valid():
            serializer.save(reporter=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserListView(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated]


class UserDetailView(generics.RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    lookup_field = "id"
    permission_classes = [permissions.IsAuthenticated]


class CommentReportView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, comment_id):
        comment = get_object_or_404(Comment, id=comment_id)
        data = request.data.copy()
        data["comment"] = comment.id
        serializer = CommentReportSerializer(data=data)

        if serializer.is_valid():
            serializer.save(reporter=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh_token")
            if not refresh_token:
                return Response(
                    {"error": "Refresh token is required."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(
                {"message": "Successfully logged out."},
                status=status.HTTP_205_RESET_CONTENT,
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ProjectRatingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            project = Project.objects.get(pk=pk)
        except Project.DoesNotExist:
            return Response(
                {"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND
            )

        user = request.user
        rating = request.data.get("rating")

        try:
            rating = int(rating)
            if rating < 1 or rating > 5:
                raise ValueError
        except (ValueError, TypeError):
            return Response(
                {"error": "Rating must be an integer between 1 and 5"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check if user already rated
        if ProjectRating.objects.filter(user=user, project=project).exists():
            return Response(
                {"error": "You have already rated this project"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        # Save new rating
        ProjectRating.objects.create(user=user, project=project, rating=rating)

        # Update aggregate fields on Project model
        project.sum_of_ratings += rating
        project.rates_count += 1
        project.save()

        return Response(
            {
                "message": "Rating submitted successfully",
                "average_rating": project.average_rating,
                "rates_count": project.rates_count,
            },
            status=status.HTTP_200_OK,
        )


class UserProjectRatingView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return Response(
                {"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND
            )

        try:
            rating = ProjectRating.objects.get(user=request.user, project=project)
            return Response({"rating": rating.rating}, status=status.HTTP_200_OK)
        except ProjectRating.DoesNotExist:
            return Response({"rating": None}, status=status.HTTP_200_OK)


class CancelProjectAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        project = get_object_or_404(Project, pk=pk)

        if project.project_creator != request.user:
            return Response(
                {"detail": "You are not the creator of this project."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if project.total_target > 0:
            donation_percentage = (project.donation_amount / project.total_target) * 100
            if donation_percentage >= 25:
                return Response(
                    {
                        "detail": "Cannot cancel project with donations >= 25% of the target."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        project.is_cancelled = True
        project.save()
        return Response(
            {"detail": "Project cancelled successfully."}, status=status.HTTP_200_OK
        )


from decimal import Decimal


class DonateToProject(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return Response({"error": "Project not found"}, status=404)

        amount = request.data.get("amount")
        if not amount:
            return Response({"error": "Donation amount is required"}, status=400)

        try:
            amount = Decimal(amount)
        except Exception:
            return Response({"error": "Invalid donation amount"}, status=400)

        if amount <= 0:
            return Response({"error": "Amount must be positive"}, status=400)

        donation, created = Donation.objects.get_or_create(
            user=request.user, project=project, defaults={"amount": amount}
        )
        if not created:
            donation.amount = donation.amount + amount
            donation.save()

        project.donation_amount = amount + project.donation_amount
        project.save()

        return Response({"message": "Donation successful"}, status=201)


class UserDonationAmount(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):
        user = request.user

        total = Donation.objects.filter(user=user, project_id=project_id).aggregate(
            total_donation=Sum("amount")
        )["total_donation"] or Decimal("0")

        return Response({"donation_amount": total}, status=200)


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = CustomUserSerializer(request.user)
        return Response(serializer.data)
    
class MyDonationsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        donations = Donation.objects.filter(user=request.user).select_related("project")
        serializer = DonationSerializer(donations, many=True)
        return Response(serializer.data)

    