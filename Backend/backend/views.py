
from django.http import JsonResponse
import os
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
from django.db import IntegrityError
import logging
import re
from django.db import transaction, IntegrityError
from django.core.exceptions import MultipleObjectsReturned
from rest_framework import status


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
        "avatar": donor_profile.avatar_url if getattr(donor_profile, 'avatar_url', None) else None,
        "total_donations": str(donor_profile.total_donations),
        "tier": donor_profile.tier.name if donor_profile.tier else None,
        "tier_benefits": donor_profile.tier.benefits if donor_profile.tier else None,
    })

@api_view(['GET'])
@authentication_classes([])  
@permission_classes([AllowAny])
def discover_students(request):
    # Only get students with exactly one campaign
    students = StudentProfile.objects.select_related("campaign").filter(
        campaign__isnull=False
    ).order_by("full_name")
    
    data = [
        {
            "id": s.id,
            "full_name": s.full_name,
            "email": s.email,
            "avatar": s.avatar_url if getattr(s, 'avatar_url', None) else None,            "university": s.university,
            "major": s.major,
            "academic_year": s.academic_year,
            "gpa": str(s.gpa) if s.gpa is not None else None,
            "campaign": {
                "id": s.campaign.id,
                "title": s.campaign.title,
                "goal_amount": str(s.campaign.goal_amount),
                "current_amount": str(s.campaign.current_amount),
                "category": s.campaign.category,
            } if s.campaign else None,
        }
        for s in students
    ]
    return Response(data)

@api_view(["GET"])
@permission_classes([AllowAny])
def get_student_by_id(request, id):
    try:
        student = StudentProfile.objects.select_related("user", "campaign").get(id=id)
    except StudentProfile.DoesNotExist:
        return Response({"error": "Student not found"}, status=404)

    campaign_data = None
    if student.campaign:
        campaign_data = {
            "id": student.campaign.id,
            "title": student.campaign.title,
            "description": student.campaign.description,
            "goal_amount": str(student.campaign.goal_amount),
            "current_amount": str(student.campaign.current_amount),
            "category": student.campaign.category,
            "progress_percentage": student.campaign.progress_percentage,
            "image_url": student.campaign.image_url,
            "deadline": student.campaign.deadline.isoformat(),
        }

    return Response({
        "id": student.id,
        "full_name": student.full_name,
        "avatar": student.avatar_url if getattr(student, 'avatar_url', None) else None,
        "email": student.email,
        "university": student.university,
        "major": student.major,
        "academic_year": student.academic_year,
        "gpa": str(student.gpa) if student.gpa else None,
        "campaign": campaign_data,
    })
def get_edu_user_from_supabase(request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None, Response({"error": "Missing Authorization header"}, status=401)

    token = auth_header.split(" ", 1)[1]
    try:
        res = requests.get(
            f"{SUPABASE_URL}/auth/v1/user",
            headers={"Authorization": f"Bearer {token}", "apikey": SUPABASE_ANON_KEY},
            timeout=10,
        )
    except requests.RequestException as e:
        return None, Response({"error": "Failed to contact Supabase", "detail": str(e)}, status=502)

    if res.status_code != 200:
        return None, Response({"error": "Invalid Supabase token", "supabase_status": res.status_code, "supabase_body": res.text}, status=401)

    try:
        user_data = res.json()
    except ValueError:
        return None, Response({"error": "Invalid JSON from Supabase", "body": res.text}, status=502)

    email = user_data.get("email")
    if not email:
        # Reject early instead of attempting DB writes with a None email
        return None, Response({"error": "Supabase returned no email for user", "body": user_data}, status=400)

    metadata = user_data.get("user_metadata", {}) or user_data.get("raw_user_meta_data", {}) or {}
    role = metadata.get("role")

    try:
        edu_user, _ = EduUser.objects.get_or_create(
            email=email,
            defaults={
                "username": email,
                "password": make_password(None),
                "is_active": True,
                "is_student": (role == "student") if role else False,
                "is_donor": (role == "donor") if role else False,
            },
        )
    except Exception as e:
        # Log server-side, but return a controlled 500 to client
        return None, Response({"error": "Database error while fetching/creating user"}, status=500)

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
            "avatar": s.avatar_url if getattr(s, 'avatar_url', None) else None,
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

@api_view(["GET", "PUT"])
@authentication_classes([])      
@permission_classes([AllowAny])
def get_my_profile(request):
    """
    GET  -> return the caller's profile (student or donor) as JSON
    PUT  -> allow students to update profile fields (full_name, university, major,
            academic_year, gpa, avatar). Donor updates are not supported here.
    """
    logger = logging.getLogger(__name__)

    edu_user, error_response = get_edu_user_from_supabase(request)
    if error_response:
        return error_response

    # --------------------------
    # Student path
    # --------------------------
    if edu_user.is_student:
        # Ensure we handle DB duplicates / schema issues gracefully
        try:
            profile, _ = StudentProfile.objects.get_or_create(
                user=edu_user,
                defaults={
                    "full_name": f"{edu_user.first_name} {edu_user.last_name}".strip() or edu_user.email,
                    "email": edu_user.email,
                },
            )
        except MultipleObjectsReturned:
            logger.exception("Multiple StudentProfile rows for user id=%s email=%s", getattr(edu_user, "id", None), edu_user.email)
            return Response({"error": "Multiple student profiles exist for this account; contact support"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except IntegrityError as e:
            logger.exception("IntegrityError when getting/creating StudentProfile for %s: %s", edu_user.email, e)
            return Response({"error": "Database error while accessing profile"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.exception("Unexpected error when accessing StudentProfile for %s: %s", edu_user.email, e)
            return Response({"error": "Server error while accessing profile"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # GET request -> return profile
        if request.method == "GET":
            return Response({
                'id': profile.id,
                'full_name': profile.full_name,
                'email': profile.email,
                'avatar': profile.avatar_url if getattr(profile, 'avatar_url', None) else None,
                'university': profile.university,
                'major': profile.major,
                'academic_year': profile.academic_year,
                'gpa': str(profile.gpa) if profile.gpa is not None else None,
            }, status=status.HTTP_200_OK)

        # PUT -> update student profile
        data = request.data

        # Basic validation helpers
        def is_valid_url(val: str) -> bool:
            # simple heuristic; tighten if you need to whitelist domains
            return bool(re.match(r"^https?://", val or ""))

        # apply updates inside a transaction to avoid partial saves
        try:
            with transaction.atomic():
                # editable fields
                if "full_name" in data:
                    profile.full_name = data.get("full_name") or profile.full_name

                if "university" in data:
                    profile.university = data.get("university") or None

                if "major" in data:
                    profile.major = data.get("major") or None

                if "academic_year" in data:
                    profile.academic_year = data.get("academic_year") or None

                # GPA: allow null to clear; validate numeric and range
                if "gpa" in data:
                    gpa_val = data.get("gpa")
                    if gpa_val in (None, "", "null"):
                        profile.gpa = None
                    else:
                        try:
                            gpa_f = float(gpa_val)
                            if gpa_f < 0.0 or gpa_f > 4.0:
                                return Response({"error": "GPA must be between 0.0 and 4.0"}, status=status.HTTP_400_BAD_REQUEST)
                            profile.gpa = gpa_f
                        except (TypeError, ValueError):
                            return Response({"error": "Invalid GPA value"}, status=status.HTTP_400_BAD_REQUEST)

                # Avatar: accept hosted URL (from Supabase) or null/empty to clear
                if "avatar" in data:
                    avatar_val = data.get("avatar")
                    if avatar_val in (None, "", "null"):
                        profile.avatar_url = None
                    else:
                        if not isinstance(avatar_val, str) or not is_valid_url(avatar_val):
                            # Reject obviously invalid URLs
                            return Response({"error": "Invalid avatar URL"}, status=status.HTTP_400_BAD_REQUEST)
                        profile.avatar_url = avatar_val

                profile.save()
        except IntegrityError as e:
            logger.exception("IntegrityError saving StudentProfile for %s: %s", edu_user.email, e)
            return Response({"error": "Database error saving profile"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.exception("Unexpected error saving StudentProfile for %s: %s", edu_user.email, e)
            return Response({"error": "Server error saving profile"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Return updated profile
        return Response({
            'id': profile.id,
            'full_name': profile.full_name,
            'email': profile.email,
            'avatar': profile.avatar_url if getattr(profile, 'avatar_url', None) else None,
            'university': profile.university,
            'major': profile.major,
            'academic_year': profile.academic_year,
            'gpa': str(profile.gpa) if profile.gpa is not None else None,
        }, status=status.HTTP_200_OK)

    # --------------------------
    # Donor path (read-only here)
    # --------------------------
    elif edu_user.is_donor:
        try:
            profile = DonorProfile.objects.select_related("tier").get(user=edu_user)
        except DonorProfile.DoesNotExist:
            return Response({"error": "Donor profile not found"}, status=status.HTTP_404_NOT_FOUND)
        except MultipleObjectsReturned:
            logger.exception("Multiple DonorProfile rows for user id=%s email=%s", getattr(edu_user, "id", None), edu_user.email)
            return Response({"error": "Multiple donor profiles exist for this account; contact support"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.exception("Error fetching DonorProfile for %s: %s", edu_user.email, e)
            return Response({"error": "Server error while fetching profile"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            "id": profile.id,
            "full_name": profile.full_name,
            "email": profile.email,
            "avatar": profile.avatar_url if getattr(profile, 'avatar_url', None) else None,
            "total_donations": str(profile.total_donations),
            "tier": profile.tier.name if profile.tier else None,
            "tier_benefits": profile.tier.benefits if profile.tier else None,
        }, status=status.HTTP_200_OK)
    else:
        return Response({"error": "User has no profile"}, status=status.HTTP_403_FORBIDDEN)

@api_view(['POST'])
@permission_classes([AllowAny])
def upload_avatar(request):
    edu_user, err = get_edu_user_from_supabase(request)
    if err:
        return err

    if 'avatar' not in request.FILES:
        return Response({'error': 'No file uploaded'}, status=400)

    file = request.FILES['avatar']

    if edu_user.is_student:
        profile = StudentProfile.objects.get(user=edu_user)
    else:
        profile = DonorProfile.objects.get(user=edu_user)

    # Save uploaded file using Django default storage and persist public URL
    from django.core.files.storage import default_storage

    save_path = f"avatars/{edu_user.id}/{file.name}"
    try:
        saved = default_storage.save(save_path, file)
        public_url = default_storage.url(saved)
    except Exception as e:
        return Response({"error": "Failed to save file on server", "detail": str(e)}, status=500)

    profile.avatar_url = public_url
    profile.save()

    return Response({"avatar_url": public_url})


@api_view(['GET'])
@permission_classes([AllowAny])
def get_avatar_signed_url(request):
    """Return a short-lived signed URL for a file in the avatars bucket.

    Query params:
      - path: the object path inside the avatars bucket (e.g. "<supabase_uid>/avatar.png")
      - expires: optional seconds until expiry (default 60)
    """
    path = request.query_params.get('path')
    expires = int(request.query_params.get('expires', 60))

    if not path:
        return Response({"error": "Missing 'path' query parameter"}, status=400)

    service_role = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
    if not service_role:
        return Response({"error": "Supabase service role key not configured on server"}, status=500)

    sign_url = f"{SUPABASE_URL}/storage/v1/object/sign/avatars/{path}"
    try:
        resp = requests.post(
            sign_url,
            headers={
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': f'Bearer {service_role}',
            },
            json={"expiresIn": expires},
            timeout=10,
        )
    except Exception as e:
        return Response({"error": "Failed to contact Supabase storage", "detail": str(e)}, status=500)

    if resp.status_code != 200:
        return Response({"error": "Supabase returned an error", "detail": resp.text}, status=resp.status_code)

    return Response(resp.json())

@api_view(['POST'])
@authentication_classes([])      
@permission_classes([AllowAny])
def create_campaign(request):
    """Create a new campaign (same auth pattern as get_my_profile)"""
    from app.models import Campaign
    from django.utils import timezone
    from datetime import datetime
    
    edu_user, error_response = get_edu_user_from_supabase(request)
    if error_response:
        return error_response

    if not edu_user.is_student:
        return Response({"error": "Only students can create campaigns"}, status=403)

    student_profile = StudentProfile.objects.filter(user=edu_user).first()
    if not student_profile:
        return Response({"error": "Student profile not found"}, status=404)
    

    # Prevent creating more than one campaign per student (fast-fail)
    if getattr(student_profile, "campaign", None) is not None:
        return Response({"error": "A campaign already exists for this student"}, status=400)

    # Validate input
    try:
        title = request.data.get("title", "").strip()
        description = request.data.get("description", "").strip()
        goal_amount = float(request.data.get("goal_amount", 0))
        category = request.data.get("category", "education")
        image_url = request.data.get("image_url")
        deadline_str = request.data.get("deadline")

        if not title or len(title) > 200:
            return Response({"error": "Title is required (max 200 characters)"}, status=400)

        if not description or len(description) > 2000:
            return Response({"error": "Description is required (max 2000 characters)"}, status=400)

        if goal_amount <= 0:
            return Response({"error": "Goal amount must be greater than 0"}, status=400)

        if not deadline_str:
            return Response({"error": "Deadline is required"}, status=400)

        # Parse deadline string - handle both ISO format and simple datetime-local format
        try:
            # Try ISO format first (with timezone)
            if 'T' in deadline_str:
                # ISO format with timezone
                deadline = datetime.fromisoformat(deadline_str.replace('Z', '+00:00'))
            else:
                # Fallback for other formats
                deadline = datetime.fromisoformat(deadline_str)
                # Make timezone aware if naive
                if deadline.tzinfo is None:
                    deadline = timezone.make_aware(deadline)
        except Exception as e:
            return Response({"error": f"Invalid deadline format: {str(e)}"}, status=400)
        
        if deadline <= timezone.now():
            return Response({"error": "Deadline must be in the future"}, status=400)

        if category not in dict(Campaign.CATEGORY_CHOICES):
            return Response({"error": "Invalid category"}, status=400)

    except (ValueError, TypeError) as e:
        return Response({"error": f"Invalid input: {str(e)}"}, status=400)

    # Create campaign (DB constraint + transaction protects against race)
    try:
        with transaction.atomic():
            campaign = Campaign.objects.create(
                student=student_profile,
                title=title,
                description=description,
                goal_amount=goal_amount,
                category=category,
                image_url=image_url,
                deadline=deadline,
                status='active'
            )

        return Response({
            "id": campaign.id,
            "title": campaign.title,
            "description": campaign.description,
            "goal_amount": str(campaign.goal_amount),
            "category": campaign.category,
            "image_url": campaign.image_url,
            "deadline": campaign.deadline.isoformat(),
            "created_at": campaign.created_at.isoformat(),
            "message": "Campaign created successfully"
        }, status=201)

    except IntegrityError:
        # concurrent create hit DB unique constraint
        return Response({"error": "A campaign already exists for this student (concurrent request)"}, status=400)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(['GET'])
@authentication_classes([])      
@permission_classes([AllowAny])
def get_campaigns(request):
    """Get all active campaigns"""
    from app.models import Campaign
    
    try:
        student_id = request.query_params.get('student_id')
        
        if student_id:
            campaigns = Campaign.objects.filter(
                student_id=student_id,
                status='active'
            ).order_by('-created_at')
        else:
            campaigns = Campaign.objects.filter(
                status='active'
            ).order_by('-created_at')

        data = []
        for campaign in campaigns:
            data.append({
                "id": campaign.id,
                "title": campaign.title,
                "description": campaign.description[:200] + "..." if len(campaign.description) > 200 else campaign.description,
                "goal_amount": str(campaign.goal_amount),
                "current_amount": str(campaign.current_amount),
                "progress_percentage": campaign.progress_percentage,
                "category": campaign.category,
                "image_url": campaign.image_url,
                "student": {
                    "id": campaign.student.id,
                    "full_name": campaign.student.full_name,
                },
                "deadline": campaign.deadline.isoformat(),
                "created_at": campaign.created_at.isoformat(),
            })

        return Response(data, status=200)

    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(['GET'])
@authentication_classes([])      
@permission_classes([AllowAny])
def get_campaign_detail(request, campaign_id):
    """Get campaign details"""
    from app.models import Campaign
    
    try:
        campaign = Campaign.objects.get(id=campaign_id)

        return Response({
            "id": campaign.id,
            "title": campaign.title,
            "description": campaign.description,
            "goal_amount": str(campaign.goal_amount),
            "current_amount": str(campaign.current_amount),
            "progress_percentage": campaign.progress_percentage,
            "category": campaign.category,
            "image_url": campaign.image_url,
            "status": campaign.status,
            "student": {
                "id": campaign.student.id,
                "full_name": campaign.student.full_name,
                "email": campaign.student.email,
                "university": campaign.student.university,
                "major": campaign.student.major,
            },
            "deadline": campaign.deadline.isoformat(),
            "is_deadline_passed": campaign.is_deadline_passed,
            "created_at": campaign.created_at.isoformat(),
            "updated_at": campaign.updated_at.isoformat(),
        }, status=200)

    except Campaign.DoesNotExist:
        return Response({"error": "Campaign not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(['PUT'])
@authentication_classes([])      
@permission_classes([AllowAny])
def update_campaign(request, campaign_id):
    """Update campaign details"""
    from app.models import Campaign
    from django.utils import timezone
    from datetime import datetime
    
    edu_user, error_response = get_edu_user_from_supabase(request)
    if error_response:
        return error_response

    if not edu_user.is_student:
        return Response({"error": "Only students can update campaigns"}, status=403)

    try:
        campaign = Campaign.objects.get(id=campaign_id)
        
        # Verify this campaign belongs to the logged-in student
        if campaign.student.user.id != edu_user.id:
            return Response({"error": "You can only update your own campaigns"}, status=403)

        # Update fields
        title = request.data.get("title")
        description = request.data.get("description")
        goal_amount = request.data.get("goal_amount")
        category = request.data.get("category")
        image_url = request.data.get("image_url")
        deadline_str = request.data.get("deadline")

        if title:
            if len(title.strip()) == 0 or len(title) > 200:
                return Response({"error": "Title must be between 1 and 200 characters"}, status=400)
            campaign.title = title.strip()

        if description:
            if len(description.strip()) == 0 or len(description) > 2000:
                return Response({"error": "Description must be between 1 and 2000 characters"}, status=400)
            campaign.description = description.strip()

        if goal_amount is not None:
            try:
                goal = float(goal_amount)
                if goal <= 0:
                    return Response({"error": "Goal amount must be greater than 0"}, status=400)
                campaign.goal_amount = goal
            except (ValueError, TypeError):
                return Response({"error": "Invalid goal amount"}, status=400)

        if category:
            if category not in dict(Campaign.CATEGORY_CHOICES):
                return Response({"error": "Invalid category"}, status=400)
            campaign.category = category

        if image_url is not None:
            campaign.image_url = image_url if image_url else None

        if deadline_str:
            try:
                if 'T' in deadline_str:
                    deadline = datetime.fromisoformat(deadline_str.replace('Z', '+00:00'))
                else:
                    deadline = datetime.fromisoformat(deadline_str)
                    if deadline.tzinfo is None:
                        deadline = timezone.make_aware(deadline)
                
                if deadline <= timezone.now():
                    return Response({"error": "Deadline must be in the future"}, status=400)
                
                campaign.deadline = deadline
            except Exception as e:
                return Response({"error": f"Invalid deadline format: {str(e)}"}, status=400)

        campaign.save()

        return Response({
            "id": campaign.id,
            "title": campaign.title,
            "description": campaign.description,
            "goal_amount": str(campaign.goal_amount),
            "category": campaign.category,
            "image_url": campaign.image_url,
            "deadline": campaign.deadline.isoformat(),
            "updated_at": campaign.updated_at.isoformat(),
            "message": "Campaign updated successfully"
        }, status=200)

    except Campaign.DoesNotExist:
        return Response({"error": "Campaign not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(['DELETE'])
@authentication_classes([])      
@permission_classes([AllowAny])
def delete_campaign(request, campaign_id):
    """Delete a campaign"""
    from app.models import Campaign
    
    edu_user, error_response = get_edu_user_from_supabase(request)
    if error_response:
        return error_response

    if not edu_user.is_student:
        return Response({"error": "Only students can delete campaigns"}, status=403)

    try:
        campaign = Campaign.objects.get(id=campaign_id)
        
        # Verify this campaign belongs to the logged-in student
        if campaign.student.user.id != edu_user.id:
            return Response({"error": "You can only delete your own campaigns"}, status=403)

        campaign_title = campaign.title
        campaign.delete()

        return Response({
            "message": f"Campaign '{campaign_title}' deleted successfully"
        }, status=200)

    except Campaign.DoesNotExist:
        return Response({"error": "Campaign not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)
