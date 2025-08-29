# MovieMate 🎬

A full-stack movie management application built with Django REST Framework and React. Users can browse movies, add reviews, and admins can manage movies and streaming platforms.

## Features

### 🎯 Core Features
- **Movie Management**: Browse, search, and filter movies
- **Platform Management**: Organize movies by streaming platforms
- **Review System**: Rate and review movies (1-5 stars)
- **User Authentication**: JWT-based authentication with HTTP-only cookies
- **Admin Panel**: Full CRUD operations for movies and platforms
- **Responsive UI**: Modern React frontend with smooth animations

### 🔐 Authentication & Security
- JWT tokens stored in HTTP-only cookies for security
- Custom middleware for cookie-based authentication
- Role-based permissions (Admin/User)
- CORS configured for cross-origin requests

### 🎨 UI/UX Features
- Dark theme with red accent colors
- Smooth hover effects and animations
- Modal-based editing and creation
- Real-time search with debouncing
- Responsive design for all screen sizes

## Tech Stack

### Backend
- **Django 5.0+** - Web framework
- **Django REST Framework** - API framework
- **SimpleJWT** - JWT authentication
- **django-cors-headers** - CORS handling
- **django-filter** - Advanced filtering
- **PostgreSQL** - Production database
- **SQLite** - Development database

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Modern CSS** - Custom styling with gradients and animations
- **Fetch API** - HTTP client for API calls

## Project Structure

```
moviemate/
├── moviemate/                 # Django project settings
├── moviemate_app/            # Main Django app
│   ├── api/                  # API views, serializers, permissions
│   ├── models.py             # Database models
│   └── authentication.py    # Custom JWT authentication
├── user_app/                 # User authentication app
│   ├── api/                  # Auth API endpoints
│   └── middleware.py         # JWT cookie middleware
├── static/                   # Static files and React build
└── templates/                # Django templates

moviemate-frontend/
├── src/
│   ├── components/           # React components
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API service layer
│   └── index.css            # Global styles
└── package.json             # Frontend dependencies
```

## Installation & Setup

### Prerequisites
- Python 3.12+
- Node.js 18+
- Git

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd dj_project
```

### 2. Backend Setup
```bash
# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
cd moviemate
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start Django server
python manage.py runserver
```

### 3. Frontend Setup
```bash
# Install dependencies
cd moviemate-frontend
npm install

# Build for production
npm run build

# For development
npm run dev
```

## Environment Variables

Create a `.env` file in the `moviemate/` directory:

```env
# Database (for production)
DATABASE_URL=postgresql://username:password@host:port/database

# Security
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# CORS
CORS_ALLOWED_ORIGINS=https://yourdomain.com

# JWT Settings
SIMPLE_JWT_ACCESS_TOKEN_LIFETIME=60
SIMPLE_JWT_REFRESH_TOKEN_LIFETIME=1440
```

## API Endpoints

### Authentication
- `POST /api/account/cookie-login/` - Login with credentials
- `POST /api/account/cookie-refresh/` - Refresh access token
- `POST /api/account/cookie-logout/` - Logout user
- `GET /api/account/user-info/` - Get current user info

### Movies
- `GET /api/watch/list2/` - List movies (with filtering)
- `POST /api/watch/list/` - Create movie (admin only)
- `GET /api/watch/{id}/` - Get movie details
- `PUT /api/watch/{id}/` - Update movie (admin only)
- `DELETE /api/watch/{id}/` - Delete movie (admin only)

### Platforms
- `GET /api/watch/stream/` - List platforms
- `POST /api/watch/stream/` - Create platform (admin only)
- `PUT /api/watch/stream/{id}/` - Update platform (admin only)
- `DELETE /api/watch/stream/{id}/` - Delete platform (admin only)

### Reviews
- `GET /api/watch/{movie_id}/review/` - Get movie reviews
- `POST /api/watch/{movie_id}/review-create/` - Create review
- `PUT /api/watch/review/{id}/` - Update review
- `DELETE /api/watch/review/{id}/` - Delete review

## Deployment on Render

### Step 1: Prepare for Deployment
1. Ensure all changes are committed to Git
2. Push to GitHub repository
3. Update `ALLOWED_HOSTS` in production settings

### Step 2: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub account
3. Connect your repository

### Step 3: Deploy Database
1. Create new PostgreSQL database on Render
2. Copy the database URL for later use

### Step 4: Deploy Web Service
1. Create new Web Service on Render
2. Connect your GitHub repository
3. Configure build and start commands:
   - **Build Command**: `./build.sh`
   - **Start Command**: `cd moviemate && python manage.py runserver 0.0.0.0:$PORT`

### Step 5: Environment Variables
Add these environment variables in Render dashboard:
- `DATABASE_URL` - Your PostgreSQL URL from step 3
- `SECRET_KEY` - Generate a secure secret key
- `DEBUG` - Set to `False`
- `ALLOWED_HOSTS` - Your Render app URL

### Step 6: Deploy
1. Click "Create Web Service"
2. Wait for build to complete
3. Your app will be available at the provided URL

## Development

### Running Tests
```bash
cd moviemate
python manage.py test
```

### Code Style
- Backend: Follow PEP 8
- Frontend: Use ESLint and Prettier
- Use meaningful variable names
- Add comments for complex logic

### Contributing
1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

## Troubleshooting

### Common Issues

**CORS Errors**
- Check `CORS_ALLOWED_ORIGINS` in settings
- Ensure frontend URL matches exactly

**Authentication Issues**
- Verify JWT settings in `settings.py`
- Check cookie domain and path settings

**Build Failures**
- Ensure all dependencies are in `requirements.txt`
- Check Python/Node.js versions

**Database Issues**
- Run migrations: `python manage.py migrate`
- Check database connection string

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Search existing GitHub issues
3. Create a new issue with detailed description

---

Built with ❤️ using Django and React
# Force redeploy
