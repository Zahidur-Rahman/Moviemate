from django.utils.deprecation import MiddlewareMixin
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.contrib.auth.models import AnonymousUser
from django.contrib.auth import get_user_model

User = get_user_model()

class JWTCookieMiddleware(MiddlewareMixin):
    """
    Middleware to extract JWT tokens from HTTP-only cookies
    and authenticate the user for DRF views
    """
    
    def process_request(self, request):
        # Get access token from cookie
        access_token = request.COOKIES.get('access_token')
        
        if access_token:
            # Add token to Authorization header for DRF
            request.META['HTTP_AUTHORIZATION'] = f'Bearer {access_token}'
            
            # Try to authenticate the user directly
            try:
                jwt_auth = JWTAuthentication()
                validated_token = jwt_auth.get_validated_token(access_token)
                user = jwt_auth.get_user(validated_token)
                request.user = user
            except (InvalidToken, TokenError):
                # Token is invalid, keep user as anonymous
                pass
        
        return None
