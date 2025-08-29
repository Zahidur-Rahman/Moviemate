#!/bin/bash

# Build script for Render deployment
set -o errexit  # exit on error

# Install Python dependencies
pip install -r requirements.txt

# Node.js is pre-installed on Render, no need to install

# Build React frontend
cd moviemate-frontend
npm install
npm run build

# Verify build output exists
if [ ! -d "dist" ]; then
    echo "Error: Build output not found in moviemate-frontend/dist"
    echo "Current directory structure:"
    ls -la
    exit 1
fi

cd ..

# Create static directory if it doesn't exist
mkdir -p moviemate/static/react-build

# Clean previous build to avoid stale hashed assets
rm -rf moviemate/static/react-build/*

# Copy build output to Django static directory
cp -r moviemate-frontend/dist/* moviemate/static/react-build/

# Template is now manually maintained - no need to auto-generate

echo "React build copied to moviemate/static/react-build and template updated"

# Django setup
cd moviemate
python3 manage.py collectstatic --noinput --settings=moviemate.production_settings
python3 manage.py migrate --settings=moviemate.production_settings
