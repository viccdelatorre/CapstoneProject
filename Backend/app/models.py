from django.contrib.auth.models import AbstractUser
from django.db import models

class EduUser(AbstractUser):
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='eduuser_set',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='eduuser_set_permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    is_student = models.BooleanField(default=False)
    is_donor = models.BooleanField(default=False)


class StudentProfile(models.Model):
    user = models.OneToOneField(EduUser, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    university = models.CharField(max_length=255, null=True, blank=True)
    major = models.CharField(max_length=255, null=True, blank=True)
    academic_year = models.CharField(max_length=50, null=True, blank=True)
    gpa = models.FloatField(null=True, blank=True)

    def __str__(self):
        return self.full_name


class DonorTier(models.Model):
    TIER_CHOICES = [
        ("bronze", "Bronze"),
        ("silver", "Silver"),
        ("gold", "Gold"),
    ]
    name = models.CharField(max_length=20, choices=TIER_CHOICES, unique=True)
    description = models.TextField(blank=True)
    min_donation = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    benefits = models.JSONField(blank=True, null=True)

    def __str__(self):
        return f"{self.name.capitalize()} Tier"


class DonorProfile(models.Model):
    user = models.OneToOneField(EduUser, on_delete=models.CASCADE, related_name='donor_profile')
    full_name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    total_donations = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tier = models.ForeignKey(DonorTier, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.full_name