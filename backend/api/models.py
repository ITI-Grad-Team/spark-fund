from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth import get_user_model

class CustomUser(AbstractUser):
    phone = models.CharField(max_length=11, blank=True, null=True, unique=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    birth_date = models.DateField(null=True,blank=True)
    facebook_profile = models.URLField(max_length=200,null=True,blank=True)
    country = models.CharField(max_length=100,null=True,blank=True)

class Project(models.Model):
    title = models.CharField(max_length=100)
    details = models.TextField()
    total_target = models.DecimalField(max_digits=10, decimal_places=2)
    tags = models.ManyToManyField('Tag') #Django automatically creates a third table to store the relationships between the two models
    start_date = models.DateField()  #The planned start date of the campaign.
    end_date = models.DateField()
    category = models.ForeignKey('Category', on_delete=models.SET_NULL,null=True,blank=True)
    project_creator = models.ForeignKey(get_user_model(), on_delete=models.SET_NULL,null=True) #get_user_model()returns the custom user model you are using for authentication in your project(Best Practice)
    created_at = models.DateTimeField(auto_now_add=True)#The actual creation date of the project in the system(for filteriation)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.title
    
class ProjectImage(models.Model):
    project = models.ForeignKey('Project', on_delete=models.CASCADE,related_name='images')
    image = models.ImageField(upload_to='project_images/')
    def __str__(self):
        return f"Image for {self.project.title}"
    
class Tag(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name
    
