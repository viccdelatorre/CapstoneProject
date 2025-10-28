"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from backend.views import register_user,login_user, verify_user
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Define the URL patterns for the backend application
# URL patterns map URL paths to their corresponding view functions
# Each path function takes a URL pattern and a view function as arguments
urlpatterns = [
    path('auth/registeQr', register_user),
    path("auth/login", login_user),
    path("auth/verify_user", verify_user),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/verify_user', verify_user),
]