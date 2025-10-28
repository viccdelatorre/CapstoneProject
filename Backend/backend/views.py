
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth.hashers import make_password
from django.db import transaction
from app.models import EduUser, StudentProfile, DonorProfile
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from app.models import EduUser
import requests
from rest_framework.permissions import AllowAny

SUPABASE_URL = "https://zumkrhrasldshlnfgpft.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1bWtyaHJhc2xkc2hsbmZncGZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1Mjg0NDMsImV4cCI6MjA3NjEwNDQ0M30.XO969jHsvXNXWVK1-q9UvqoOu78hm4EZdML6qwYAFtE"  # move to .env

# verify_user view for session refresh
# it is in charge of verifying the token sent by the frontend
# to ensure the user is authenticated
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def verify_user(request):
    user = request.user
    return Response({
        "id": user.id,
        "email": user.email,
        "name": f"{user.first_name} {user.last_name}",
        "is_student": user.is_student,
        "is_donor": user.is_donor
    })

# regiester_user view for user registration
# it handles the registration of new users
# it creates a new EduUser and associated profile based on the role
# received from the frontend
@csrf_exempt
def register_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            first_name = data.get('firstName')
            last_name = data.get('lastName')
            email = data.get('email')
            password = data.get('password')  # optional (may be None if Supabase)
            role = data.get('role')

            if EduUser.objects.filter(email=email).exists():
                return JsonResponse({'error': 'Email already in use'}, status=400)

            with transaction.atomic():
                user = EduUser.objects.create(
                    username=email,
                    first_name=first_name,
                    last_name=last_name,
                    email=email,
                    password=make_password(password) if password else make_password(None),
                    is_student=(role == 'student'),
                    is_donor=(role == 'donor'),
                )

                full_name = f"{first_name} {last_name}"
                if role == 'student':
                    StudentProfile.objects.create(user=user, full_name=full_name, email=email)
                elif role == 'donor':
                    DonorProfile.objects.create(user=user, full_name=full_name, email=email)

            return JsonResponse({'message': 'Registration successful', 'userId': user.id}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=400)

# login_user is responsible for authenticating users via Supabase tokens
# It verifies the token with Supabase and syncs the local EduUser record
# If the user does not exist locally, it creates a new record
@csrf_exempt
def login_user(request):
    """
    Frontend sends { "access_token": "<supabase_access_token>" }.
    Django verifies it with Supabase and syncs a local EduUser.
    """
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=400)

    try:
        data = json.loads(request.body.decode("utf-8"))
        token = data.get("access_token")

        if not token:
            return JsonResponse({"error": "Missing access_token"}, status=400)

        # Verify token via Supabase
        res = requests.get(
            f"{SUPABASE_URL}/auth/v1/user",
            headers={
                "Authorization": f"Bearer {token}",
                "apikey": SUPABASE_ANON_KEY,
            },
        )

        if res.status_code != 200:
            return JsonResponse({"error": "Invalid Supabase token"}, status=401)

        user_data = res.json()
        email = user_data.get("email")
        metadata = user_data.get("user_metadata", {})
        role = metadata.get("role", "student")  # default if missing

        # Sync local user record
        edu_user, created = EduUser.objects.get_or_create(
            email=email,
            defaults={
                "username": email,
                "first_name": metadata.get("first_name", ""),
                "last_name": metadata.get("last_name", ""),
                "is_active": True,
                "is_student": role == "student",
                "is_donor": role == "donor",
                "password": make_password(None),  # 🔥 No local password
            },
        )

        if created:
            full_name = f"{edu_user.first_name} {edu_user.last_name}".strip()
            if edu_user.is_student:
                StudentProfile.objects.create(user=edu_user, full_name=full_name, email=email)
            elif edu_user.is_donor:
                DonorProfile.objects.create(user=edu_user, full_name=full_name, email=email)

        return JsonResponse({
            "message": "Login verified via Supabase",
            "user": {
                "id": edu_user.id,
                "email": edu_user.email,
                "first_name": edu_user.first_name,
                "last_name": edu_user.last_name,
                "is_student": edu_user.is_student,
                "is_donor": edu_user.is_donor,
            },
            "is_new": created,
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

#verify_user view for token verification
# it verifies the Supabase JWT sent via Authorization header
# and ensures a local EduUser record exists

@api_view(["GET"])
@permission_classes([AllowAny])
def verify_user(request):
    """
    Verifies a Supabase JWT sent via Authorization: Bearer <token>.
    Returns decoded user data and ensures local record exists.
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return Response({"error": "Missing Authorization header"}, status=401)

    token = auth_header.split(" ")[1]

    res = requests.get(
        f"{SUPABASE_URL}/auth/v1/user",
        headers={
            "Authorization": f"Bearer {token}",
            "apikey": SUPABASE_ANON_KEY,
        },
    )

    if res.status_code != 200:
        return Response({"error": "Invalid Supabase token"}, status=401)

    user_data = res.json()
    email = user_data.get("email")

    edu_user, _ = EduUser.objects.get_or_create(
    email=email,
    defaults={"username": email, "password": make_password(None), "is_active": True},
    )


    return Response({
        "id": edu_user.id,
        "email": edu_user.email,
        "supabase_id": user_data.get("id"),
        "is_student": edu_user.is_student,
        "is_donor": edu_user.is_donor,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_profile(request):
    user = request.user
    data = request.data
    full_name = data.get('full_name')
    email = user.email

    profile, created = StudentProfile.objects.get_or_create(
        user=user,
        defaults={'full_name': full_name, 'email': email}
    )

    if not created:
        return Response({'error': 'Profile already exists'}, status=400)

    return Response({
        'id': profile.id,
        'full_name': profile.full_name,
        'email': profile.email
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_profile(request):
    user = request.user
    try:
        profile = user.student_profile
        return Response({
            'id': profile.id,
            'full_name': profile.full_name,
            'email': profile.email
        })
    except StudentProfile.DoesNotExist:
        return Response({'error': 'Profile not found'}, status=404)
    
    