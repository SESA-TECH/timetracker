import os
import django
from datetime import timedelta, datetime

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from timelogs.domain.models import TimeLog

User = get_user_model()

def create_test_data():
    # Create a test user if it doesn't exist
    test_user, created = User.objects.get_or_create(
        email='test@example.com',
        defaults={
            'username': 'testuser',
            'is_active': True
        }
    )
    
    if created:
        test_user.set_password('Test123!')
        test_user.save()
        print('Created test user: test@example.com / Test123!')

    # Create sample time logs
    sample_logs = [
        {
            'description': 'Working on project documentation',
            'duration': timedelta(hours=2, minutes=30),
            'status': TimeLog.Status.COMPLETED,
            'start_time': datetime.now() - timedelta(days=1),
            'end_time': datetime.now() - timedelta(days=1) + timedelta(hours=2, minutes=30)
        },
        {
            'description': 'Team meeting',
            'duration': timedelta(hours=1),
            'status': TimeLog.Status.COMPLETED,
            'start_time': datetime.now() - timedelta(hours=5),
            'end_time': datetime.now() - timedelta(hours=4)
        },
        {
            'description': 'Code review',
            'duration': timedelta(minutes=45),
            'status': TimeLog.Status.COMPLETED,
            'start_time': datetime.now() - timedelta(hours=2),
            'end_time': datetime.now() - timedelta(hours=1, minutes=15)
        }
    ]

    for log_data in sample_logs:
        TimeLog.objects.create(user=test_user, **log_data)
        print(f'Created time log: {log_data["description"]}')

if __name__ == '__main__':
    create_test_data()
    print('Test data created successfully!')
