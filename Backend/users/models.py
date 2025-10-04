from django.db import models
from django.utils import timezone
from django.conf import settings
import random
from datetime import timedelta
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from phonenumber_field.modelfields import PhoneNumberField

# Gestionnaire pour le modèle User
class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("L'utilisateur doit avoir une adresse email")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)  
        return self.create_user(email, password, **extra_fields)

# Modèle User principal
class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)

    # CHANGED: make non-auth fields optional so they are NOT required at registration
    phone_number = PhoneNumberField(region='CM', unique=True, null=True, blank=True)  # was required
    name = models.CharField(max_length=30, null=True, blank=True)                     # was required
    address = models.CharField(max_length=30, null=True, blank=True)                  # was required
    gender = models.CharField(max_length=10, null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profiles/', null=True, blank=True)

    # ADD THIS LINE
    profile_completed = models.BooleanField(default=False)

    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    role = models.ForeignKey('Role', on_delete=models.SET_NULL, null=True, blank=True)  # lien avec le rôle

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []  # CHANGED: remove phone_number → only email+password required

    objects = UserManager()

    def __str__(self):
        return self.email

# Modèle Role (rôle utilisateur)
class Role(models.Model):
    name = models.CharField(max_length=50, unique=True)  # Nom du rôle, exemple: 'Cleaner', 'Employer', 'Admin'
    
    def __str__(self):
        return self.name

# Modèle Cleaner
class Cleaner(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    # CHANGED: these are optional at signup; can be set later
    portfolio = models.TextField(null=True, blank=True)                 # was required
    years_of_experience = models.IntegerField(null=True, blank=True)    # was required
    dbs_check = models.BooleanField(default=False)
    insurance_details = models.CharField(max_length=255, null=True, blank=True)  # was required
    availibility_status = models.BooleanField(default=False)
    clean_level = models.IntegerField(default=0, null=True, blank=True)

    def __str__(self):
        return f"Cleaner {self.user.email}"

# Modèle Employer
class Employer(models.Model):
    """Modèle pour Employer."""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employer')

    # CHANGED: optional at signup; can be set later
    business_name = models.CharField(max_length=255, null=True, blank=True)  # was required
    location = models.CharField(max_length=255, null=True, blank=True)       # was required

    def __str__(self):
        return f"Employer {self.user.email} ({'Disponibility' if True else 'Indisponibility'})"

# Modèle Admin
class Admin(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    logs = models.TextField(null=True, blank=True)  # CHANGED: optional
    def __str__(self):
        return f"Admin {self.user.email}"
