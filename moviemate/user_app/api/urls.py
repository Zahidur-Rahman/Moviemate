from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token
from user_app.api.views import registration_view, logout_view
from rest_framework_simplejwt.views import  TokenObtainPairView,TokenRefreshView
from user_app.api.cookie_auth_views import CookieTokenObtainPairView, CookieTokenRefreshView, CookieLogoutView, UserInfoView

urlpatterns = [
    path('login/', obtain_auth_token, name='login'),
    path('register/', registration_view, name='register'),
    path('logout/', logout_view, name='logout'),
     
    # JWT Cookie-based authentication
    path('cookie-login/', CookieTokenObtainPairView.as_view(), name='cookie_login'),
    path('cookie-refresh/', CookieTokenRefreshView.as_view(), name='cookie_refresh'),
    path('cookie-logout/', CookieLogoutView.as_view(), name='cookie_logout'),
    path('user-info/', UserInfoView.as_view(), name='user_info'),
    
    # Original JWT endpoints
    path('api/token/', CookieTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('api/logout/', CookieLogoutView.as_view(), name='api_logout'),
    
    # Original JWT endpoints (for reference)
    path('api/token/original/', TokenObtainPairView.as_view(), name='token_obtain_pair_original'),
    path('api/token/refresh/original/', TokenRefreshView.as_view(), name='token_refresh_original'),
]