from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
import random

from ...domain.models import TimeLog

User = get_user_model()

class Command(BaseCommand):
    help = 'Populate database with sample time log data'

    def add_arguments(self, parser):
        parser.add_argument(
            '--users', 
            type=int, 
            default=5, 
            help='Number of users to create'
        )
        parser.add_argument(
            '--logs-per-user', 
            type=int, 
            default=10, 
            help='Number of time logs per user'
        )

    def create_user(self, index):
        """Create a sample user."""
        username = f'user_{index}'
        email = f'user_{index}@example.com'
        try:
            return User.objects.get(username=username)
        except User.DoesNotExist:
            return User.objects.create_user(
                username=username, 
                email=email, 
                password=f'password_{index}'
            )

    def generate_time_log(self, user):
        """Generate a random time log for a user."""
        # Possible descriptions
        descriptions = [
            'Project Development', 
            'Client Meeting', 
            'Code Review', 
            'Documentation', 
            'Bug Fixing', 
            'Feature Implementation',
            'Design Session', 
            'Research', 
            'Training', 
            'Performance Optimization'
        ]

        # Possible statuses
        statuses = [
            TimeLog.Status.CREATED, 
            TimeLog.Status.RUNNING, 
            TimeLog.Status.PAUSED, 
            TimeLog.Status.COMPLETED
        ]

        # Random start time within last 30 days
        start_time = timezone.now() - timedelta(days=random.randint(0, 30))
        
        # Random duration between 15 minutes and 4 hours
        duration = timedelta(minutes=random.randint(15, 240))

        # Create time log with randomized attributes
        time_log = TimeLog.objects.create(
            user=user,
            description=random.choice(descriptions),
            status=random.choice(statuses),
            start_time=start_time,
            duration=duration
        )

        # Additional logic for specific statuses
        if time_log.status == TimeLog.Status.PAUSED:
            time_log.pause_start_time = start_time + timedelta(minutes=random.randint(15, 120))
            time_log.paused_duration = timedelta(minutes=random.randint(10, 60))
            time_log.save()

        return time_log

    def handle(self, *args, **options):
        # Clear existing time logs
        TimeLog.objects.all().delete()
        
        # Number of users and logs
        num_users = options['users']
        logs_per_user = options['logs_per_user']

        # Track created entities
        created_users = []
        created_logs = []

        # Create users
        for i in range(num_users):
            user = self.create_user(i)
            created_users.append(user)
            
            # Create time logs for each user
            for _ in range(logs_per_user):
                log = self.generate_time_log(user)
                created_logs.append(log)

        # Output summary
        self.stdout.write(self.style.SUCCESS(
            f'Successfully created {len(created_users)} users '
            f'and {len(created_logs)} time logs'
        ))

        # Optional: Print some sample data
        self.stdout.write("\nSample Created Logs:")
        for log in created_logs[:5]:
            self.stdout.write(
                f"User: {log.user.username}, "
                f"Description: {log.description}, "
                f"Status: {log.status}, "
                f"Duration: {log.duration}"
            )
