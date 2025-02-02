# TimeTrack Application

A full-stack time tracking application built with Django (Backend) and Next.js (Frontend). This application allows users to track their time spent on various tasks, with features like real-time tracking, manual time entry, and detailed reporting.

## Features

- 🔐 User Authentication (Register/Login)
- ⏱️ Real-time Time Tracking
- 📝 Manual Time Entry
- 📊 Time Logs Management
- 🎯 Task Status Tracking
- 📱 Responsive Design

## Tech Stack

### Backend
- Django 5.0
- Django REST Framework
- PostgreSQL
- JWT Authentication
- Domain-Driven Design Architecture

### Frontend
- Next.js 14
- TypeScript
- Ant Design
- TailwindCSS
- Context API for State Management

## Quick Start with Docker

### Prerequisites
- Docker
- Docker Compose

### Installation Steps

1. Clone the repository:
```bash
git clone <repository-url>
cd dev-secu
```

2. Start the application:
```bash
docker-compose up --build
```

The application will:
- Start PostgreSQL database
- Run backend migrations
- Create a default superuser
- Load test data
- Start both frontend and backend servers

### Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api
- Backend Admin: http://localhost:8000/admin

Default superuser credentials:
- Username: admin
- Email: admin@example.com
- Password: admin123!

## Development

### Project Structure
```
dev-secu/
├── timetrack/          # Django backend
│   ├── authentication/ # User authentication
│   ├── timelogs/      # Time tracking core
│   └── core/          # Project settings
├── timetrack-ui/      # Next.js frontend
│   ├── src/app/       # Pages and components
│   └── src/lib/       # Shared utilities
└── docker-compose.yml # Docker configuration
```

## Personal Reflection

### Time Spent
- Backend Development: ~20 hours
  - Domain-driven design implementation
  - API development
  - Authentication system
- Frontend Development: ~10 hours
  - UI/UX design
  - Component development
  - State management
- Docker Configuration: ~3 hours
  - Container setup
  - Environment configuration

### Satisfaction Points
1. **Architecture**
   - Clean domain-driven design in backend
   - Well-structured frontend components
   - Clear separation of concerns
   - Highly scalable implementation:
     * Containerized microservices architecture
     * Stateless backend design
     * Database optimization for high load
     * Frontend component modularity
     * Independent scaling of frontend/backend services

2. **User Experience**
   - Intuitive time tracking interface
   - Responsive design
   - Real-time updates

3. **Technical Choices**
   - Modern tech stack
   - Type safety with TypeScript
   - Containerized development environment
   - Scalability-focused decisions:
     * PostgreSQL for data scalability
     * Docker for infrastructure scaling
     * Modular architecture for team scaling
     * REST API design for service independence

### Areas for Improvement

1. **Testing**
   - No tests currently implemented
   - Need to add unit tests for backend
   - Need to add frontend component tests
   - Need to implement E2E testing

2. **Features**
   - Reporting and analytics
   - Team management
   - Project categorization
   - Export functionality

3. **Technical Debt**
   - Better error handling
   - Enhanced logging
   - Performance optimization
   - API documentation

### Future Enhancements
With more time, I would:
1. Implement WebSocket for real-time updates
2. Add data visualization
3. Enhance security measures
4. Add offline support
5. Implement CI/CD pipeline
6. Add monitoring and alerting

## Troubleshooting

### Common Issues
1. Port conflicts
   ```bash
   # Check if ports are in use
   docker-compose down
   docker-compose up --build
   ```

2. Database connection issues
   ```bash
   # Reset database
   docker-compose down -v
   docker-compose up --build
   ```

### Logs
```bash
# View backend logs
docker-compose logs backend

# View frontend logs
docker-compose logs frontend
```

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License.
