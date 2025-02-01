# TimeTrack Application

A full-stack time tracking application with Django backend and Next.js frontend.

## Prerequisites
- Docker
- Docker Compose

## Quick Start

1. Clone the repository
```bash
git clone <repository-url>
cd dev-secu
```

2. Start the application
```bash
docker-compose up --build
```

3. Initialize the database
```bash
# In a new terminal
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
```

## Accessing the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api
- Backend Admin: http://localhost:8000/admin

## Project Structure
```
dev-secu/
├── timetrack/          # Django backend
├── timetrack-ui/       # Next.js frontend
└── docker-compose.yml  # Docker configuration
```

## Development

### Running the Application
```bash
# Start all services
docker-compose up

# Rebuild and start
docker-compose up --build

# Stop all services
docker-compose down
```

### Database Management
```bash
# Create migrations
docker-compose exec backend python manage.py makemigrations

# Apply migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser
```

### Accessing Containers
```bash
# Backend shell
docker-compose exec backend bash

# Frontend shell
docker-compose exec frontend sh

# Database shell
docker-compose exec db psql -U user timetrack
```

## Stopping the Application
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (will delete database data)
docker-compose down -v
```
