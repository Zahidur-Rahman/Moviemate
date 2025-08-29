from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
import json


@method_decorator(csrf_exempt, name='dispatch')
class CookieTokenObtainPairView(View):
    """
    Custom login view that stores JWT tokens in HTTP-only cookies
    """
    def post(self, request):
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            
            # Authenticate user
            user = authenticate(username=username, password=password)
            if user:
                # Generate JWT tokens
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)
                refresh_token = str(refresh)
                
                # Create response
                response = JsonResponse({
                    'success': True,
                    'message': 'Login successful',
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'is_staff': user.is_staff,
                        'is_superuser': user.is_superuser,
                    }
                })
                
                # Set HTTP-only cookies
                print(f"Setting access_token cookie: {access_token[:20]}...")
                print(f"Request host: {request.get_host()}")
                response.set_cookie(
                    'access_token',
                    access_token,
                    max_age=3600,  # 1 hour
                    httponly=True,  # HTTP-only for security
                    secure=False,  # Set to True in production with HTTPS
                    samesite='Lax',
                    path='/',  # Explicitly set path
                    domain=None  # Let Django handle domain
                )
                response.set_cookie(
                    'refresh_token',
                    refresh_token,
                    max_age=604800,  # 7 days
                    httponly=True,  # HTTP-only for security
                    secure=False,
                    samesite='Lax',
                    path='/',  # Explicitly set path
                    domain=None  # Let Django handle domain
                )
                
                return response
            else:
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid credentials'
                }, status=401)
                
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid JSON data'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Server error'
            }, status=500)


@method_decorator(csrf_exempt, name='dispatch')
class CookieTokenRefreshView(View):
    """
    Custom token refresh view that uses refresh token from cookies
    """
    def post(self, request):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            
            if not refresh_token:
                return JsonResponse({
                    'success': False,
                    'message': 'Refresh token not found'
                }, status=401)
            
            # Validate and refresh token
            refresh = RefreshToken(refresh_token)
            new_access_token = str(refresh.access_token)
            
            response = JsonResponse({
                'success': True,
                'message': 'Token refreshed successfully'
            })
            
            # Update access token cookie
            response.set_cookie(
                'access_token',
                new_access_token,
                max_age=3600,
                httponly=True,
                secure=False,
                samesite='Lax',
                path='/',
                domain=None
            )
            
            return response
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Invalid refresh token'
            }, status=401)


@method_decorator(csrf_exempt, name='dispatch')
class CookieLogoutView(View):
    """
    Logout view that clears JWT cookies
    """
    def post(self, request):
        response = JsonResponse({
            'success': True,
            'message': 'Logged out successfully'
        })
        
        # Clear cookies with explicit path
        response.delete_cookie('access_token', path='/')
        response.delete_cookie('refresh_token', path='/')
        
        return response


@method_decorator(csrf_exempt, name='dispatch')
class UserInfoView(View):
    """
    Get current user information from JWT token
    """
    def get(self, request):
        # Check if user is authenticated (middleware should have processed the cookie)
        if request.user.is_authenticated:
            return JsonResponse({
                'success': True,
                'user': {
                    'id': request.user.id,
                    'username': request.user.username,
                    'email': request.user.email,
                    'first_name': request.user.first_name,
                    'last_name': request.user.last_name,
                    'is_staff': request.user.is_staff,
                    'is_superuser': request.user.is_superuser,
                }
            })
        else:
            return JsonResponse({
                'success': False,
                'message': 'Not authenticated'
            }, status=401)
