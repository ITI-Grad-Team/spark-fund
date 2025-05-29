from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,generics, permissions
from api.models import CustomUser, Project,Comment
from api.serializers import CustomUserSerializer, ProjectSerializer,CommentSerializer,ReplySerializer, RegisterSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated

class CustomUserAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        users = CustomUser.objects.all()
        serializer = CustomUserSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            password = serializer.validated_data.pop('password')
            user = serializer.save()
            user.set_password(password)
            user.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, id):
        user = get_object_or_404(CustomUser, id=id)
        serializer = CustomUserSerializer(user, data=request.data)
        if serializer.is_valid():
            password = serializer.validated_data.get('password', None)
            user = serializer.save()
            if password:
                user.set_password(password)
                user.save()
            return Response(CustomUserSerializer(user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, id):
        user = CustomUser.objects.get(id=id)
        serializer = CustomUserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        user = CustomUser.objects.get(id=id)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]



class UserProfileView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated] #Only authenticated users can access this view

    def get_object(self):   
        return self.request.user
    
    def delete(self, request, *args, **kwargs):
        password = request.data.get('password')
        if not password:
            return Response({"error": "Password is required."},status=status.HTTP_404_NOT_FOUND)
        if not request.user.check_password(password):
            request.user.delete()
            return Response({"message": "Account deleted."}, status=status.HTTP_204_NO_CONTENT)
        request.user.delete()
        return Response({"message": "Account deleted."}, status=status.HTTP_204_NO_CONTENT)
    


class ProjectCreateView(generics.CreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]


class ProjectAPIView(APIView):
    def get(self, request, id=None):
        if id:
            project = get_object_or_404(Project, id=id)
            serializer = ProjectSerializer(project)
            return Response(serializer.data)
        projects = Project.objects.all()
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)


class ProjectRateAPIView(APIView):
    def patch(self, request, id):
        project = get_object_or_404(Project, id=id)
        rating = request.data.get('rating')


        if not rating:
            return Response({"error": "Rating is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            rating = float(rating)
            if not (1 <= rating <= 5):
                raise ValueError
        except ValueError:
            return Response({"error": "Rating must be a number between 1 and 5."}, status=status.HTTP_400_BAD_REQUEST)

        project.sum_of_ratings += rating
        project.rates_count += 1
        project.save()

        return Response({
            "message": "Rating added.",
            "new_average": project.average_rating()
        }, status=status.HTTP_200_OK)
    


class ProjectAddCommentAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, project_id):
        project = get_object_or_404(Project, id=project_id)
        
        serializer = CommentSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(user=request.user, project=project) # I needed to pass user and project like that instead of expecting any in the data, so nobody can POST with whatever user or project they want.
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
        amount = request.data.get('amount')

        if not amount:
            return Response({"error": "Donation amount is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            amount = float(amount)
            if amount <= 0:
                raise ValueError
        except ValueError:
            return Response({"error": "Amount must be a positive number."}, status=status.HTTP_400_BAD_REQUEST)

        project.donation_amount += amount
        project.save()

        return Response({
            "message": "Donation added successfully.",
            "new_total": project.donation_amount
        }, status=status.HTTP_200_OK)