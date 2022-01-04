from django.contrib import admin
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser

admin.site.register(CustomUser)


class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = CustomUser
        fields = ["user_name", "email", "password1"]