from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,generics, permissions
from api.models import CustomUser, Project
from api.serializers import CustomUserSerializer, ProjectSerializer, RegisterSerializer
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


