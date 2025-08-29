from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.contrib.auth.models import AnonymousUser
from django.conf import settings


class JWTCookieAuthentication(JWTAuthentication):
    """
    Custom JWT authentication that reads tokens from HTTP-only cookies
    """
    
    def authenticate(self, request):
        # Get the access token from cookies
        cookie_name = settings.SIMPLE_JWT.get('AUTH_COOKIE', 'access_token')
        raw_token = request.COOKIES.get(cookie_name)
        
        # Debug logging
        print(f"Cookie name: {cookie_name}")
        print(f"Available cookies: {list(request.COOKIES.keys())}")
        print(f"Raw token: {raw_token}")
        print(f"Request path: {request.path}")
        print(f"Request method: {request.method}")
        print(f"Request headers: {dict(request.headers)}")
        
        if raw_token is None:
            return None
            
        try:
            # Validate the token using parent class method
            validated_token = self.get_validated_token(raw_token)
            user = self.get_user(validated_token)
            print(f"Successfully authenticated user: {user.username}")
            return (user, validated_token)
        except (InvalidToken, TokenError) as e:
            print(f"Token validation failed: {e}")
            return None
