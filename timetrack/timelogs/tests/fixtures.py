import pytest
from datetime import datetime, timedelta
from django.contrib.auth import get_user_model
from ..domain.models import TimeLog

User = get_user_model()

@pytest.fixture
def sample_user():
    """Create a sample user for testing."""
    return User.objects.create_user(
        username='testuser', 
        email='test@example.com', 
        password='testpass123'
    )

@pytest.fixture
def sample_timelog(sample_user):
    """Create a sample time log for testing."""
    return TimeLog.objects.create(
        user=sample_user,
        description='Test Time Log',
        status=TimeLog.Status.CREATED,
        start_time=datetime.now(),
        duration=timedelta(hours=1)
    )

@pytest.fixture
def multiple_timelogs(sample_user):
    """Create multiple time logs for testing."""
    timelogs = [
        TimeLog.objects.create(
            user=sample_user,
            description=f'Test Log {i}',
            status=TimeLog.Status.COMPLETED if i % 2 == 0 else TimeLog.Status.RUNNING,
            start_time=datetime.now() - timedelta(days=i),
            duration=timedelta(hours=i+1)
        ) for i in range(5)
    ]
    return timelogs

@pytest.fixture
def running_timelog(sample_user):
    """Create a running time log."""
    return TimeLog.objects.create(
        user=sample_user,
        description='Active Project Work',
        status=TimeLog.Status.RUNNING,
        start_time=datetime.now() - timedelta(minutes=30),
        duration=timedelta(minutes=30)
    )

@pytest.fixture
def paused_timelog(sample_user):
    """Create a paused time log."""
    return TimeLog.objects.create(
        user=sample_user,
        description='Interrupted Work',
        status=TimeLog.Status.PAUSED,
        start_time=datetime.now() - timedelta(hours=1),
        pause_start_time=datetime.now() - timedelta(minutes=15),
        duration=timedelta(minutes=45),
        paused_duration=timedelta(minutes=15)
    )

def create_timelog_with_custom_params(
    user=None, 
    description='Custom Time Log', 
    status=TimeLog.Status.CREATED, 
    start_time=None, 
    duration=None
):
    """
    Flexible fixture for creating time logs with custom parameters.
    
    Args:
        user: User associated with the time log
        description: Description of the time log
        status: Status of the time log
        start_time: Start time of the time log
        duration: Duration of the time log
    
    Returns:
        TimeLog: Created time log instance
    """
    if user is None:
        user = User.objects.create_user(
            username=f'user_{datetime.now().timestamp()}', 
            email=f'user_{datetime.now().timestamp()}@example.com', 
            password='testpass123'
        )
    
    if start_time is None:
        start_time = datetime.now()
    
    if duration is None:
        duration = timedelta(hours=1)
    
    return TimeLog.objects.create(
        user=user,
        description=description,
        status=status,
        start_time=start_time,
        duration=duration
    )
