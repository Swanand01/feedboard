from django.contrib import admin
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser

# Register your models here.
admin.site.register(CustomUser)


class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = CustomUser
        fields = ["user_name", "password1"]