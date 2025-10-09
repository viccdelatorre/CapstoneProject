from pathlib import Path
import psycopg2
import os
from dotenv import load_dotenv
import hashlib
from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from app.models import EduUser, StudentProfile, DonorProfile
import webbrowser
import os
import django

env_path = Path(__file__).resolve().parent.parent / "backend" / ".env"
load_dotenv(env_path)

DATABASE_URL = os.getenv("DATABASE_URL")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")  # adjust if your settings module is different
django.setup()

# now you can import your models
from app.models import EduUser, StudentProfile, DonorProfile

class Command(BaseCommand):
    help = 'Create a student or donor user'

    def handle(self, *args, **kwargs):
        choice = input("Create (1) Student or (2) Donor? ")

        if choice == "1":
            self.create_student()
        elif choice == "2":
            self.create_donor()
        else:
            self.stdout.write(self.style.ERROR("Invalid choice"))

    def create_student(self):
        full_name = input("Student Name: ")
        email = input("Student Email: ")
        password = input("Password: ")

        user = EduUser.objects.create(
            username=email,
            first_name=full_name.split()[0],
            last_name=" ".join(full_name.split()[1:]),
            email=email,
            password=make_password(password),
            role="student"
        )
        StudentProfile.objects.create(user=user)
        self.stdout.write(self.style.SUCCESS(f"Student account created with ID {user.id}"))

        # Optional SSO
        url = "http://localhost:8000/sso-login"
        print("Opening browser to log in via university SSO...")
        webbrowser.open(url)
        input("Press Enter after completing the SSO login in your browser...")

    def create_donor(self):
        full_name = input("Donor Name: ")
        email = input("Donor Email: ")
        password = input("Password: ")

        user = EduUser.objects.create(
            username=email,
            first_name=full_name.split()[0],
            last_name=" ".join(full_name.split()[1:]),
            email=email,
            password=make_password(password),
            role="donor"
        )
        DonorProfile.objects.create(user=user)
        self.stdout.write(self.style.SUCCESS(f"Donor account created with ID {user.id}"))
