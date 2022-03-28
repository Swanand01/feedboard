from django.contrib.auth.base_user import AbstractBaseUser
from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import PermissionsMixin

class CustomUserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, user_name, email, password):
        """
        Creates and saves a User with the given username and password.
        """
        if not user_name:
            raise ValueError('Users must have an username')

        if not email:
            raise ValueError('Users must have an email')

        if not password:
            raise ValueError('Users must have an password')

        user = self.model(
            user_name=user_name,
            email=email
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, user_name, email, password):
        """
        Creates and saves a superuser with the given username and password.
        """
        user = self.create_user(
            user_name,
            email,
            password=password,
        )
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class CustomUser(AbstractBaseUser, PermissionsMixin):
	"""The Custom User model"""
	user_name = models.CharField(max_length=25, unique=True)
	email = models.EmailField()
	date_joined = models.DateTimeField('date joined', auto_now_add=True)
	is_active = models.BooleanField('active', default=True)
	is_staff = models.BooleanField(default=False)
	is_superuser = models.BooleanField(default=False)

	USERNAME_FIELD = 'user_name'
	REQUIRED_FIELDS = ['email']

	objects = CustomUserManager()
