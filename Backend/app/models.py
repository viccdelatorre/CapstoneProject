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
    avatar_url = models.URLField(null=True, blank=True)
    university = models.CharField(max_length=255, null=True, blank=True)
    major = models.CharField(max_length=255, null=True, blank=True)
    academic_year = models.CharField(max_length=50, null=True, blank=True)
    gpa = models.FloatField(null=True, blank=True)

    def __str__(self):
        return self.full_name

    @property
    def donors_count(self):
        """Count unique donors for this student's campaign"""
        campaign = getattr(self, 'campaign', None)  # OneToOne gives direct attribute
        if campaign:
            return campaign.donation_set.values('donor').distinct().count()
        return 0


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
    avatar_url = models.URLField(null=True, blank=True)
    total_donations = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tier = models.ForeignKey(DonorTier, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.full_name
    # add more donor-specific fields here

class Campaign(models.Model):
    """Campaign model for student fundraising"""
    
    CATEGORY_CHOICES = [
        ('education', 'Education'),
        ('tuition', 'Tuition'),
        ('scholarship', 'Scholarship'),
        ('student_loans', 'Student Loans'),
        ('living_expenses', 'Living Expenses'),
        ('other', 'Other'),
    ]

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    student = models.OneToOneField(StudentProfile, on_delete=models.CASCADE, related_name='campaign')
    title = models.CharField(max_length=200)
    description = models.TextField()
    goal_amount = models.DecimalField(max_digits=10, decimal_places=2)
    current_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='education')
    image_url = models.URLField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    deadline = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'app_campaign'
        ordering = ['-created_at']
        
    def __str__(self):
        return self.title

    @property
    def progress_percentage(self):
        if self.goal_amount == 0:
            return 0
        return float((self.current_amount / self.goal_amount) * 100)

    @property
    def is_deadline_passed(self):
        from django.utils import timezone
        return timezone.now() > self.deadline
