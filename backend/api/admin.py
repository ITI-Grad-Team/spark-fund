from django.contrib import admin

from api.models import Category, CustomUser

admin.site.register(CustomUser)
admin.site.register(Category)
