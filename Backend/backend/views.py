
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
SUPABASE_URL = "https://zumkrhrasldshlnfgpft.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1bWtyaHJhc2xkc2hsbmZncGZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1Mjg0NDMsImV4cCI6MjA3NjEwNDQ0M30.XO969jHsvXNXWVK1-q9UvqoOu78hm4EZdML6qwYAFtE"  # move to .env

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

    # Create campaign
    try:
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
