from datetime import datetime, timedelta
from typing import List, Optional
from django.utils import timezone  # Import Django's timezone utilities

from ..domain.interfaces import TimeLogRepositoryInterface, TimeTrackingServiceInterface
from ..domain.models import TimeLog

class TimeTrackingService(TimeTrackingServiceInterface):
    """Implementation of the time tracking service."""

    def __init__(self, repository: TimeLogRepositoryInterface):
        self.repository = repository

    def start_timer(self, time_log_id: str) -> TimeLog:
        """
        Start an existing time log timer.
        
        Args:
            time_log_id (str): ID of the time log to start
        
        Returns:
            TimeLog: Started time log
        
        Raises:
            ValueError: If time log cannot be started
        """
        time_log = self.repository.get_by_id(time_log_id)
        
        # Only allow starting CREATED or PAUSED time logs
        if time_log.status not in [TimeLog.Status.CREATED, TimeLog.Status.PAUSED]:
            raise ValueError(f"Cannot start timer with status {time_log.status}")
        
        # Use timezone-aware current time
        time_log.start_time = timezone.now()
        time_log.status = TimeLog.Status.RUNNING
        return self.repository.update(time_log)

    def pause_timer(self, time_log_id: str) -> TimeLog:
        """
        Pause an active timer.
        
        Args:
            time_log_id (str): ID of the time log to pause
        
        Returns:
            TimeLog: Paused time log
        
        Raises:
            ValueError: If time log cannot be paused
        """
        time_log = self.repository.get_by_id(time_log_id)
        
        # Only allow pausing RUNNING time logs
        if time_log.status != TimeLog.Status.RUNNING:
            raise ValueError(f"Cannot pause timer with status {time_log.status}")
        
        # Use timezone-aware current time
        current_time = timezone.now()
        
        # Ensure start_time is timezone-aware
        if time_log.start_time and not timezone.is_aware(time_log.start_time):
            time_log.start_time = timezone.make_aware(time_log.start_time)
        
        # Calculate and add elapsed running time
        elapsed_time = current_time - time_log.start_time
        time_log.duration += elapsed_time
        
        # Set pause start time for tracking paused duration
        time_log.pause_start_time = current_time
        time_log.status = TimeLog.Status.PAUSED
        
        return self.repository.update(time_log)

    def resume_timer(self, time_log_id: str) -> TimeLog:
        """
        Resume a paused time log timer.
        
        Args:
            time_log_id (str): ID of the time log to resume
        
        Returns:
            TimeLog: Resumed time log
        
        Raises:
            ValueError: If time log cannot be resumed
        """
        time_log = self.repository.get_by_id(time_log_id)
        
        # Only allow resuming PAUSED time logs
        if time_log.status != TimeLog.Status.PAUSED:
            raise ValueError(f"Cannot resume timer with status {time_log.status}")
        
        # Use timezone-aware current time
        current_time = timezone.now()
        
        # Calculate paused duration
        if time_log.pause_start_time:
            # Ensure pause_start_time is timezone-aware
            if not timezone.is_aware(time_log.pause_start_time):
                time_log.pause_start_time = timezone.make_aware(time_log.pause_start_time)
            
            paused_duration = current_time - time_log.pause_start_time
            time_log.paused_duration += paused_duration
        
        # Reset start time and clear pause start time
        time_log.start_time = current_time
        time_log.pause_start_time = None
        time_log.status = TimeLog.Status.RUNNING
        
        return self.repository.update(time_log)

    def stop_timer(self, time_log_id: str) -> TimeLog:
        """
        Stop and complete a time log.
        
        Args:
            time_log_id (str): ID of the time log to stop
        
        Returns:
            TimeLog: Completed time log
        
        Raises:
            ValueError: If time log cannot be stopped
        """
        time_log = self.repository.get_by_id(time_log_id)
        
        # Only allow stopping RUNNING or PAUSED time logs
        if time_log.status not in [TimeLog.Status.RUNNING, TimeLog.Status.PAUSED]:
            raise ValueError(f"Cannot stop timer with status {time_log.status}")
        
        # Use timezone-aware current time
        current_time = timezone.now()
        
        # Ensure start_time is timezone-aware
        if time_log.start_time and not timezone.is_aware(time_log.start_time):
            time_log.start_time = timezone.make_aware(time_log.start_time)
        
        # Calculate final duration if timer was running
        if time_log.status == TimeLog.Status.RUNNING:
            elapsed_time = current_time - time_log.start_time
            time_log.duration += elapsed_time
        
        # Handle paused state if stopped from pause
        if time_log.pause_start_time:
            # Ensure pause_start_time is timezone-aware
            if not timezone.is_aware(time_log.pause_start_time):
                time_log.pause_start_time = timezone.make_aware(time_log.pause_start_time)
            
            paused_duration = current_time - time_log.pause_start_time
            time_log.paused_duration += paused_duration
            time_log.pause_start_time = None
        
        time_log.end_time = current_time
        time_log.status = TimeLog.Status.COMPLETED
        
        return self.repository.update(time_log)

    def add_manual_time(self, 
                      user_id: str, 
                      description: str, 
                      start_time: datetime, 
                      duration: timedelta,
                      end_time: Optional[datetime] = None) -> TimeLog:
        """
        Add a manually logged time entry.
        
        Args:
            user_id (str): ID of the user logging the time
            description (str): Description of the work
            start_time (datetime): When the work started
            duration (timedelta): Total duration of work
            end_time (datetime, optional): When the work ended. 
                                           Defaults to start_time + duration if not provided
        
        Returns:
            TimeLog: Created and completed time log
        """
        # Ensure start_time is timezone-aware
        if not timezone.is_aware(start_time):
            start_time = timezone.make_aware(start_time)
        
        # Create the time log
        time_log = self.repository.create(user_id, description)
        
        # Set start time
        time_log.start_time = start_time
        
        # Set duration
        time_log.duration = duration
        
        # Set end time (calculate if not provided)
        end_time = end_time or (start_time + duration)
        if not timezone.is_aware(end_time):
            end_time = timezone.make_aware(end_time)
        time_log.end_time = end_time
        
        # Mark as completed
        time_log.status = TimeLog.Status.COMPLETED
        
        return self.repository.update(time_log)

    def create_and_start_timer(self, user_id: str, description: str) -> TimeLog:
        """
        Create a new time log and immediately start it.
        
        Args:
            user_id (str): ID of the user creating the time log
            description (str): Description of the time log
        
        Returns:
            TimeLog: Started time log
        """
        # Create a new time log
        time_log = self.repository.create(user_id, description)
        
        # Immediately start the timer with timezone-aware time
        time_log.start_time = timezone.now()
        time_log.status = TimeLog.Status.RUNNING
        return self.repository.update(time_log)
