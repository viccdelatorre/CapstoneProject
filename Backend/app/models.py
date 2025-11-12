from django.contrib.auth.models import AbstractUser
from django.db import models

class EduUser(AbstractUser):
    # Make sure to override groups and user_permissions to avoid reverse accessor clashes
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='eduuser_set',  # custom related_name
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='eduuser_set_permissions',  # custom related_name
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )
    
    # Add custom fields for Student / Donor
    is_student = models.BooleanField(default=False)
    is_donor = models.BooleanField(default=False)

class StudentProfile(models.Model):
    user = models.OneToOneField(EduUser, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=255)
    email = models.EmailField()

    # new fields
    university = models.CharField(max_length=255, null=True, blank=True)
    major = models.CharField(max_length=255, null=True, blank=True)
    academic_year = models.CharField(max_length=50, null=True, blank=True)
    gpa = models.FloatField(null=True, blank=True)

    def __str__(self):
        return self.full_name

    # add more student-specific fields here

class DonorProfile(models.Model):
    user = models.OneToOneField(EduUser, on_delete=models.CASCADE, related_name='donor_profile')
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    # add more donor-specific fields here
