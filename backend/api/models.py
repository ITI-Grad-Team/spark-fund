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
    total_target = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    donation_amount = models.DecimalField(max_digits=10, decimal_places=2)
    sum_of_ratings = models.PositiveIntegerField(default=0)
    rates_count = models.PositiveIntegerField(default=0)
    tags = models.ManyToManyField('Tag') #Django automatically creates a third table to store the relationships between the two models
    start_date = models.DateField()  #The planned start date of the campaign.
    end_date = models.DateField()
    category = models.ForeignKey('Category', on_delete=models.SET_NULL,null=True,blank=True)
    project_creator = models.ForeignKey(get_user_model(), on_delete=models.SET_NULL,null=True) #get_user_model()returns the custom user model you are using for authentication in your project(Best Practice)
    created_at = models.DateTimeField(auto_now_add=True)#The actual creation date of the project in the system(for filteriation)
    
    def average_rating(self):
        if self.rates_count == 0:
            return 0
        return round(self.sum_of_ratings / self.rates_count, 2) 
    
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
    

class Comment(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user} on {self.project.title}"


class Reply(models.Model):
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='replies')
    user = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reply by {self.user} on Comment {self.comment.id}"

