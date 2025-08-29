from rest_framework.decorators import api_view
from rest_framework.response import Response
from user_app.api.serializers import RegistrationSerializer
from rest_framework.authtoken.models import Token
# from user_app import models
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings




@api_view(['POST',])
def logout_view(request):
    if request.method == 'POST':
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)






@api_view(['POST',])
def registration_view(request):
    if request.method == 'POST':
        serializer = RegistrationSerializer(data=request.data)
        data={} 
        if serializer.is_valid():
            data['response']='Registration Successful'
            account=serializer.save()
            data['username']=account.username
            data['email']=account.email
            data['success'] = True
            
            # Generate JWT tokens for auto-login
            refresh=RefreshToken.for_user(account)
            data['user'] = {
                'id': account.id,
                'username': account.username,
                'email': account.email,
                'is_staff': account.is_staff,
                'is_superuser': account.is_superuser,
            }
        else:
            data=serializer.errors
            data['success'] = False
        
        response = Response(data)
        
        # Set JWT tokens as HTTP-only cookies if registration successful
        if serializer.is_valid():
            response.set_cookie(
                settings.SIMPLE_JWT['AUTH_COOKIE'],
                str(refresh.access_token),
                max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds(),
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
            )
            response.set_cookie(
                settings.SIMPLE_JWT['REFRESH_COOKIE'],
                str(refresh),
                max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds(),
                httponly=settings.SIMPLE_JWT['REFRESH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['REFRESH_COOKIE_SAMESITE']
            )
        
        return response