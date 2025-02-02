#!/bin/sh

# Wait for postgres
echo "Waiting for PostgreSQL..."
while ! nc -z db 5432; do
    sleep 0.1
done
echo "PostgreSQL started"

# Apply database migrations
echo "Applying database migrations..."
python manage.py migrate

# Create superuser and test data
echo "Creating superuser and test data..."
python create_superuser.py
python create_test_data.py

# Start server
echo "Starting server..."
python manage.py runserver 0.0.0.0:8000
