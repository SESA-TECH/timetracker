import uuid
from datetime import datetime, timedelta
from django.db import models
from django.conf import settings

class TimeLog(models.Model):
    """TimeLog entity representing a time tracking entry."""
    
    class Status(models.TextChoices):
        CREATED = 'CREATED', 'Created'
        RUNNING = 'RUNNING', 'Running'
        PAUSED = 'PAUSED', 'Paused'
        COMPLETED = 'COMPLETED', 'Completed'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    description = models.TextField()
    duration = models.DurationField(default=timedelta)
    paused_duration = models.DurationField(default=timedelta)  # New field to track total paused time
    start_time = models.DateTimeField(null=True, blank=True)
    pause_start_time = models.DateTimeField(null=True, blank=True)  # Track when pause started
    end_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.CREATED
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.description[:30]}"

    def format_duration(self) -> str:
        """
        Format the duration in HH:MM:SS format.
        
        Returns:
            str: Formatted duration string
        """
        total_seconds = int(self.duration.total_seconds())
        hours, remainder = divmod(total_seconds, 3600)
        minutes, seconds = divmod(remainder, 60)
        return f"{hours:02d}:{minutes:02d}:{seconds:02d}"

    def get_status_display(self) -> str:
        """
        Get a human-readable display of the current status.
        
        Returns:
            str: Descriptive status
        """
        return dict(self.Status.choices).get(self.status, self.status)
