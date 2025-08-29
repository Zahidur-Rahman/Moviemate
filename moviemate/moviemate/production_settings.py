import os
import dj_database_url
from .settings import *

# Production settings
DEBUG = False

# Security settings
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-&8j!^q=tqp%g0!yvh#atdx2ed^zs%bq_g-*11(zfsbg6otzggq')

# Allowed hosts for Render
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '.onrender.com,localhost,127.0.0.1').split(',')

# Database configuration for production
DATABASE_URL = os.environ.get('DATABASE_URL')

if DATABASE_URL:
    DATABASES = {
        'default': dj_database_url.config(
            default=DATABASE_URL,
            conn_max_age=600,
            conn_health_checks=True,
        )
    }
else:
    # Fallback to SQLite for local testing
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# Static files configuration
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [
    BASE_DIR / 'static',
    BASE_DIR / 'static/react-build',  # Vite build output
]

# Template directories for production
# Override base settings to ensure templates are found
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            BASE_DIR / 'templates',  # Django templates
            BASE_DIR / 'static/react-build',  # React's index.html location
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# Security settings for production
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# CORS settings for production
CORS_ALLOWED_ORIGINS = os.environ.get('CORS_ALLOWED_ORIGINS', '').split(',')
CORS_ALLOW_ALL_ORIGINS = False  # Security: Only allow specific origins

# Trust HTTPS from Render's proxy and ensure correct host/secure detection
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
USE_X_FORWARDED_HOST = True

# CSRF trusted origins (required on HTTPS when behind proxy)
_csrf_env = os.environ.get('CSRF_TRUSTED_ORIGINS', '')
if _csrf_env.strip():
    CSRF_TRUSTED_ORIGINS = [o.strip() for o in _csrf_env.split(',') if o.strip()]
else:
    # Safe default for Render subdomains
    CSRF_TRUSTED_ORIGINS = ['https://*.onrender.com']

# Session security for HTTPS production
SESSION_COOKIE_SECURE = os.environ.get('SESSION_COOKIE_SECURE', 'True') == 'True'
SESSION_COOKIE_HTTPONLY = os.environ.get('SESSION_COOKIE_HTTPONLY', 'True') == 'True'
SESSION_COOKIE_SAMESITE = os.environ.get('SESSION_COOKIE_SAMESITE', 'Lax')

# JWT Cookie settings for production
SIMPLE_JWT.update({
    'AUTH_COOKIE_SECURE': os.environ.get('AUTH_COOKIE_SECURE', 'True') == 'True',
    'REFRESH_COOKIE_SECURE': os.environ.get('REFRESH_COOKIE_SECURE', 'True') == 'True',
    'AUTH_COOKIE_HTTPONLY': os.environ.get('AUTH_COOKIE_HTTPONLY', 'True') == 'True',
    'REFRESH_COOKIE_HTTPONLY': os.environ.get('REFRESH_COOKIE_HTTPONLY', 'True') == 'True',
    'AUTH_COOKIE_SAMESITE': os.environ.get('AUTH_COOKIE_SAMESITE', 'Lax'),
    'REFRESH_COOKIE_SAMESITE': os.environ.get('REFRESH_COOKIE_SAMESITE', 'Lax'),
})

# Logging configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': os.getenv('DJANGO_LOG_LEVEL', 'INFO'),
            'propagate': False,
        },
    },
}
