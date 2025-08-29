# 🚀 MovieMate Deployment Guide - Render (Free Tier)

This guide will walk you through deploying MovieMate on Render's free tier step by step.

## 📋 Prerequisites

- GitHub account
- Render account (free)
- Your MovieMate project pushed to GitHub

## 🔧 Step 1: Prepare Your Repository

### 1.1 Push to GitHub
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - MovieMate ready for deployment"

# Add your GitHub repository
git remote add origin https://github.com/yourusername/moviemate.git
git branch -M main
git push -u origin main
```

### 1.2 Verify Required Files
Ensure these files exist in your repository:
- ✅ `requirements.txt`
- ✅ `runtime.txt` 
- ✅ `build.sh`
- ✅ `render.yaml`
- ✅ `moviemate/moviemate/production_settings.py`

## 🗄️ Step 2: Create PostgreSQL Database

### 2.1 Create Database Service
1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"PostgreSQL"**
3. Configure database:
   - **Name**: `moviemate-db`
   - **Database**: `moviemate`
   - **User**: `moviemate`
   - **Region**: Choose closest to you
   - **PostgreSQL Version**: 14 (recommended)
   - **Plan**: **Free** (0.1 CPU, 256MB RAM)

### 2.2 Get Database URL
1. After creation, go to database dashboard
2. Copy the **External Database URL**
3. Save it for Step 3 (looks like: `postgresql://user:password@host:port/database`)

## 🌐 Step 3: Create Web Service

### 3.1 Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select your MovieMate repository

### 3.2 Configure Service Settings
- **Name**: `moviemate-app` (or your preferred name)
- **Region**: Same as your database
- **Branch**: `main`
- **Root Directory**: Leave empty
- **Runtime**: `Python 3`
- **Build Command**: `./build.sh`
- **Start Command**: `cd moviemate && python manage.py runserver 0.0.0.0:$PORT`
- **Plan**: **Free** (0.1 CPU, 512MB RAM)

## 🔐 Step 4: Configure Environment Variables

### 4.1 Add Environment Variables
In the Render dashboard, go to your web service → **Environment** tab:

```env
DATABASE_URL=postgresql://user:password@host:port/database
SECRET_KEY=your-super-secret-key-here-make-it-long-and-random
DEBUG=False
DJANGO_SETTINGS_MODULE=moviemate.production_settings
PYTHON_VERSION=3.12.0
```

### 4.2 Generate Secret Key
Use this Python command to generate a secure secret key:
```python
import secrets
print(secrets.token_urlsafe(50))
```

## 🚀 Step 5: Deploy

### 5.1 Start Deployment
1. Click **"Create Web Service"**
2. Render will automatically start building your app
3. Monitor the build logs for any errors

### 5.2 Build Process
The build will:
1. Install Python dependencies
2. Build React frontend
3. Collect Django static files
4. Run database migrations
5. Start the Django server

### 5.3 Deployment Timeline
- **Build time**: 3-5 minutes
- **First deploy**: May take up to 10 minutes
- **Subsequent deploys**: 2-3 minutes

## 🎯 Step 6: Post-Deployment Setup

### 6.1 Create Superuser
Once deployed, you need to create an admin user:

1. Go to your Render service dashboard
2. Click **"Shell"** tab
3. Run these commands:
```bash
cd moviemate
python manage.py createsuperuser
```

### 6.2 Test Your Application
1. Visit your Render app URL (e.g., `https://moviemate-app.onrender.com`)
2. Test user registration and login
3. Login as admin and test movie/platform management

## 🔧 Step 7: Troubleshooting

### Common Issues & Solutions

**Build Fails - Python Version**
```bash
# Update runtime.txt
echo "python-3.12.0" > runtime.txt
```

**Database Connection Error**
- Verify DATABASE_URL is correct
- Check database is running
- Ensure database and web service are in same region

**Static Files Not Loading**
```bash
# In shell, run:
cd moviemate
python manage.py collectstatic --noinput
```

**CORS Issues**
- Check `production_settings.py` CORS configuration
- Verify frontend is making requests to correct domain

**JWT Cookie Issues**
- Check cookie settings in `production_settings.py`
- Verify HTTPS settings match your deployment

### Debug Commands
```bash
# Check logs
# In Render dashboard → Logs tab

# Run migrations manually
cd moviemate
python manage.py migrate

# Check database connection
python manage.py dbshell

# Collect static files
python manage.py collectstatic --noinput
```

## 🔄 Step 8: Updates & Maintenance

### 8.1 Deploying Updates
```bash
# Make changes locally
git add .
git commit -m "Your update message"
git push origin main
```
Render will automatically redeploy on push to main branch.

### 8.2 Database Backups
- Render Free tier includes automatic daily backups
- Backups retained for 7 days
- Access via database dashboard

### 8.3 Monitoring
- Monitor app performance in Render dashboard
- Check logs for errors
- Set up uptime monitoring (external service)

## 💡 Tips for Free Tier

### Resource Optimization
- **Sleep Mode**: Free services sleep after 15 minutes of inactivity
- **Cold Starts**: First request after sleep takes 10-30 seconds
- **Monthly Hours**: 750 hours/month (enough for continuous operation)

### Performance Tips
- Optimize database queries
- Use database connection pooling
- Minimize static file sizes
- Enable browser caching

## 🎉 Success Checklist

- ✅ Database created and connected
- ✅ Web service deployed successfully
- ✅ Environment variables configured
- ✅ Superuser created
- ✅ Frontend loads correctly
- ✅ Authentication works
- ✅ Admin panel accessible
- ✅ Movie/platform CRUD operations work
- ✅ Reviews system functional

## 🆘 Getting Help

If you encounter issues:

1. **Check Render Logs**: Most issues show up in deployment/runtime logs
2. **Render Community**: [community.render.com](https://community.render.com)
3. **Render Docs**: [render.com/docs](https://render.com/docs)
4. **GitHub Issues**: Create issue in your repository

## 🔗 Useful Links

- [Render Dashboard](https://dashboard.render.com)
- [Render Django Guide](https://render.com/docs/deploy-django)
- [PostgreSQL on Render](https://render.com/docs/databases)
- [Environment Variables](https://render.com/docs/environment-variables)

---

🎬 **Your MovieMate app is now live on Render!** Share the URL and start managing your movie collection in the cloud.
