
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



@csrf_exempt
def register_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            first_name = data.get('firstName')
            last_name = data.get('lastName')
            email = data.get('email')
            password = data.get('password')
            role = data.get('role')

            if EduUser.objects.filter(email=email).exists():
                return JsonResponse({'error': 'Email already in use'}, status=400)

            with transaction.atomic():
                user = EduUser.objects.create(
                    username=email,
                    first_name=first_name,
                    last_name=last_name,
                    email=email,
                    password=make_password(password),
                    is_student=(role == 'student'),
                    is_donor=(role == 'donor')
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


@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')

        user = authenticate(username=email, password=password)

        if user is not None:
            return JsonResponse({
                'accessToken': 'dummy-token',  # later replace with real JWT
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'role': 'student' if user.is_student else 'donor'
                }
            })
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)

    return JsonResponse({'error': 'Invalid request method'}, status=400)

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
    
    