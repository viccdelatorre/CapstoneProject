
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
from rest_framework.decorators import authentication_classes
from app.models import DonorProfile, DonorTier

SUPABASE_URL = "https://zumkrhrasldshlnfgpft.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1bWtyaHJhc2xkc2hsbmZncGZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1Mjg0NDMsImV4cCI6MjA3NjEwNDQ0M30.XO969jHsvXNXWVK1-q9UvqoOu78hm4EZdML6qwYAFtE"  # move to .env

@api_view(['GET'])
@permission_classes([AllowAny])
def list_donor_tiers(request):
    tiers = DonorTier.objects.all().order_by('min_donation')
    data = [
        {
            "name": t.name,
            "description": t.description,
            "min_donation": str(t.min_donation),
            "benefits": t.benefits or {},
        }
        for t in tiers
    ]
    return Response(data)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_donor_profile(request):
    edu_user, error_response = get_edu_user_from_supabase(request)
    if error_response:
        return error_response

    if not edu_user.is_donor:
        return Response({"error": "Not a donor account"}, status=403)

    try:
        donor_profile = DonorProfile.objects.select_related("tier").get(user=edu_user)
    except DonorProfile.DoesNotExist:
        return Response({"error": "Donor profile not found"}, status=404)

    return Response({
        "full_name": donor_profile.full_name,
        "email": donor_profile.email,
        "total_donations": str(donor_profile.total_donations),
        "tier": donor_profile.tier.name if donor_profile.tier else None,
        "tier_benefits": donor_profile.tier.benefits if donor_profile.tier else None,
    })
@api_view(['GET'])
@authentication_classes([])  
@permission_classes([AllowAny])
def discover_students(request):
    students = StudentProfile.objects.all().order_by("full_name")
    data = [
        {
            "id": s.id,
            "full_name": s.full_name,
            "email": s.email,
            "university": s.university,
            "major": s.major,
            "academic_year": s.academic_year,
            "gpa": str(s.gpa) if s.gpa is not None else None,
        }
        for s in students
    ]
    return Response(data)
@api_view(["GET"])
@permission_classes([AllowAny])
def get_student_by_id(request, id):
    try:
        student = StudentProfile.objects.get(id=id)
    except StudentProfile.DoesNotExist:
        return Response({"error": "Student not found"}, status=404)

    return Response({
        "id": student.id,
        "full_name": student.full_name,
        "email": student.email,
        "university": student.university,
        "major": student.major,
        "academic_year": student.academic_year,
        "gpa": str(student.gpa) if student.gpa else None,
    })

def get_edu_user_from_supabase(request):
    """
    Read Authorization: Bearer <supabase_jwt>, verify it with Supabase,
    and return the matching EduUser.
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None, Response({"error": "Missing Authorization header"}, status=401)

    token = auth_header.split(" ")[1]

    res = requests.get(
        f"{SUPABASE_URL}/auth/v1/user",
        headers={
            "Authorization": f"Bearer {token}",
            "apikey": SUPABASE_ANON_KEY,
        },
    )

    if res.status_code != 200:
        return None, Response(
            {
                "error": "Invalid Supabase token",
                "supabase_status": res.status_code,
                "supabase_body": res.text,
            },
            status=401,
        )

    user_data = res.json()
    email = user_data.get("email")
    metadata = user_data.get("user_metadata", {}) or user_data.get("raw_user_meta_data", {})
    role = metadata.get("role")

    edu_user, _ = EduUser.objects.get_or_create(
        email=email,
        defaults={
            "username": email,
            "password": make_password(None),
            "is_active": True,
            "is_student": role == "student" if role else False,
            "is_donor": role == "donor" if role else False,
        },
    )

    return edu_user, None



@api_view(["GET"])
@permission_classes([AllowAny])  # we rely on Supabase JWT, not Django auth
def list_students_for_donor(request):
    edu_user, error_response = get_edu_user_from_supabase(request)
    if error_response:
        return error_response

    # donor-only access
    if not edu_user.is_donor:
        return Response({"error": "Not a donor account"}, status=403)

    students = StudentProfile.objects.all().order_by("full_name")

    data = []
    for s in students:
        data.append({
            "id": s.id,
            "full_name": s.full_name,
            "email": s.email,
            "university": s.university,
            "major": s.major,
            "academic_year": s.academic_year,
            "gpa": str(s.gpa) if s.gpa is not None else None,
        })

    return Response(data)

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
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=400)

    try:
        data = json.loads(request.body.decode("utf-8"))
        token = data.get("access_token")

        if not token:
            return JsonResponse({"error": "Missing access_token"}, status=400)

        # Ask Supabase who this token belongs to
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

        # use user_metadata OR raw_user_meta_data, whichever is present
        metadata = user_data.get("user_metadata", {}) or user_data.get("raw_user_meta_data", {})
        role = metadata.get("role", "student")  # default to student if missing

        # Create if missing
        edu_user, created = EduUser.objects.get_or_create(
            email=email,
            defaults={
                "username": email,
                "first_name": metadata.get("first_name", ""),
                "last_name": metadata.get("last_name", ""),
                "is_active": True,
                "is_student": role == "student",
                "is_donor": role == "donor",
                "password": make_password(None),
            },
        )

        # 🔧 If user already existed, update their role & names to match Supabase
        if not created:
            changed = False

            first_name = metadata.get("first_name")
            last_name = metadata.get("last_name")

            if first_name is not None and edu_user.first_name != first_name:
                edu_user.first_name = first_name
                changed = True
            if last_name is not None and edu_user.last_name != last_name:
                edu_user.last_name = last_name
                changed = True

            desired_is_student = role == "student"
            desired_is_donor = role == "donor"

            if edu_user.is_student != desired_is_student or edu_user.is_donor != desired_is_donor:
                edu_user.is_student = desired_is_student
                edu_user.is_donor = desired_is_donor
                changed = True

            if changed:
                edu_user.save()

        # If we just created the user, also make a profile
        if created:
            full_name = f"{edu_user.first_name} {edu_user.last_name}".strip() or email
            if edu_user.is_student:
                StudentProfile.objects.create(user=edu_user, full_name=full_name, email=email)
            elif edu_user.is_donor:
                DonorProfile.objects.create(user=edu_user, full_name=full_name, email=email)

        if edu_user.is_student:
            role_str = "student"
        elif edu_user.is_donor:
            role_str = "donor"
        else:
            role_str = None

        return JsonResponse({
            "message": "Login verified via Supabase",
            "user": {
                "id": edu_user.id,
                "email": edu_user.email,
                "first_name": edu_user.first_name,
                "last_name": edu_user.last_name,
                "is_student": edu_user.is_student,
                "is_donor": edu_user.is_donor,
                "role": role_str,
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
    metadata = user_data.get("user_metadata", {}) or user_data.get("raw_user_meta_data", {})
    role = metadata.get("role")

    edu_user, created = EduUser.objects.get_or_create(
        email=email,
        defaults={
            "username": email,
            "password": make_password(None),
            "is_active": True,
            "is_student": role == "student" if role else False,
            "is_donor": role == "donor" if role else False,
        },
    )

    if not created and role:
        changed = False
        if role == "student" and (not edu_user.is_student or edu_user.is_donor):
            edu_user.is_student = True
            edu_user.is_donor = False
            changed = True
        elif role == "donor" and (not edu_user.is_donor or edu_user.is_student):
            edu_user.is_donor = True
            edu_user.is_student = False
            changed = True
        if changed:
            edu_user.save()

    return Response({
        "id": edu_user.id,
        "email": edu_user.email,
        "supabase_id": user_data.get("id"),
        "is_student": edu_user.is_student,
        "is_donor": edu_user.is_donor,
    })

@api_view(['POST'])
@authentication_classes([])      
@permission_classes([AllowAny])  # we do auth via Supabase JWT above
def create_profile(request):
    edu_user, error_response = get_edu_user_from_supabase(request)
    if error_response:
        return error_response

    if not edu_user.is_student:
        return Response({"error": "Not a student account"}, status=403)

    data = request.data
    full_name = data.get('full_name') or f"{edu_user.first_name} {edu_user.last_name}".strip() or edu_user.email
    email = edu_user.email

    # ✅ academic fields from request
    university = data.get("university")
    major = data.get("major")
    academic_year = data.get("academic_year")
    gpa = data.get("gpa")

    profile, created = StudentProfile.objects.get_or_create(
        user=edu_user,
        defaults={
            'full_name': full_name,
            'email': email,
            'university': university,
            'major': major,
            'academic_year': academic_year,
            'gpa': gpa if gpa is not None else None,
        }
    )

    if not created:
        return Response({'error': 'Profile already exists'}, status=400)

    return Response({
        'id': profile.id,
        'full_name': profile.full_name,
        'email': profile.email,
        'university': profile.university,
        'major': profile.major,
        'academic_year': profile.academic_year,
        'gpa': str(profile.gpa) if profile.gpa is not None else None,
    })
@api_view(['GET', 'PUT'])
@authentication_classes([])      
@permission_classes([AllowAny])  # Supabase auth, not Django session/JWT
def get_my_profile(request):
    edu_user, error_response = get_edu_user_from_supabase(request)
    if error_response:
        return error_response

    if not edu_user.is_student:
        return Response({"error": "Not a student account"}, status=403)

    profile, _ = StudentProfile.objects.get_or_create(
        user=edu_user,
        defaults={
            "full_name": f"{edu_user.first_name} {edu_user.last_name}".strip() or edu_user.email,
            "email": edu_user.email,
        },
    )

    if request.method == "GET":
        return Response({
            'id': profile.id,
            'full_name': profile.full_name,
            'email': profile.email,
            'university': profile.university,
            'major': profile.major,
            'academic_year': profile.academic_year,
            'gpa': str(profile.gpa) if profile.gpa is not None else None,
        })

    # PUT -> update profile
    data = request.data
    profile.full_name = data.get("full_name", profile.full_name)
    profile.university = data.get("university", profile.university)
    profile.major = data.get("major", profile.major)
    profile.academic_year = data.get("academic_year", profile.academic_year)

    gpa = data.get("gpa", None)
    if gpa is not None:
        try:
            profile.gpa = float(gpa)
        except (TypeError, ValueError):
            return Response({"error": "Invalid GPA value"}, status=400)

    profile.save()

    return Response({
        'id': profile.id,
        'full_name': profile.full_name,
        'email': profile.email,
        'university': profile.university,
        'major': profile.major,
        'academic_year': profile.academic_year,
        'gpa': str(profile.gpa) if profile.gpa is not None else None,
    })
