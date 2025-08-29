
from django.contrib import admin
from django.urls import path,include
from moviemate_app.views import HomeView, LoginView, MovieDetailView, react_app_view
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API endpoints (must come first)
    path('api/watch/',include('moviemate_app.api.urls')),
    path('api/account/',include('user_app.api.urls')),
    
    # Legacy views
    path('vanilla/', HomeView.as_view(), name='vanilla_home'),
    path('login/', LoginView.as_view(), name='login_page'),
    path('movie/<int:pk>/', MovieDetailView.as_view(), name='movie_detail_page'),
    
    # React app - catch all (must be last)
    path('', react_app_view, name='react_home'),
]

# Serve static files in development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
