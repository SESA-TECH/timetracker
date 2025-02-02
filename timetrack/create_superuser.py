import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Create superuser
if not User.objects.filter(email='admin@timetrack.com').exists():
    User.objects.create_superuser(
        email='admin@timetrack.com',
        username='admin',
        password='Admin123!'
    )
    print('Superuser created successfully!')
else:
    print('Superuser already exists.')
