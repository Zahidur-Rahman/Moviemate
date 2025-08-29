from django.shortcuts import render
from django.views.generic import TemplateView
from django.http import HttpResponse, HttpResponseNotFound
from django.conf import settings
from pathlib import Path


class HomeView(TemplateView):
    """Main dashboard view showing movie list"""
    template_name = 'index.html'


class LoginView(TemplateView):
    """Login page view"""
    template_name = 'login.html'


def react_app_view(request):
    """Serve the built React app's index.html from static/react-build."""
    index_path = Path(settings.BASE_DIR) / 'static' / 'react-build' / 'index.html'
    try:
        with open(index_path, 'r', encoding='utf-8') as f:
            return HttpResponse(f.read(), content_type='text/html')
    except FileNotFoundError:
        return HttpResponseNotFound(
            "React build not found. Run your frontend build and place it under static/react-build/."
        )


class MovieDetailView(TemplateView):
    """Movie detail page view"""
    template_name = 'movie_detail.html'