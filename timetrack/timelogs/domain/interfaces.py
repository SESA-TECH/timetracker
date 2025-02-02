from abc import ABC, abstractmethod
from datetime import timedelta
from typing import List, Optional
from .models import TimeLog

class TimeLogRepositoryInterface(ABC):
    """Repository interface for TimeLog entities."""
    
    @abstractmethod
    def create(self, user_id: str, description: str) -> TimeLog:
        """Create a new time log entry."""
        pass

    @abstractmethod
    def get_by_id(self, time_log_id: str) -> Optional[TimeLog]:
        """Get a time log by its ID."""
        pass

    @abstractmethod
    def get_user_logs(self, user_id: str, **filters) -> List[TimeLog]:
        """Get all time logs for a user with optional filters."""
        pass

    @abstractmethod
    def update(self, time_log: TimeLog) -> TimeLog:
        """Update a time log entry."""
        pass

    @abstractmethod
    def delete(self, time_log_id: str) -> bool:
        """Delete a time log entry."""
        pass

class TimeTrackingServiceInterface(ABC):
    """Service interface for time tracking operations."""
    
    @abstractmethod
    def start_timer(self, user_id: str, description: str) -> TimeLog:
        """Start a new timer."""
        pass

    @abstractmethod
    def pause_timer(self, time_log_id: str) -> TimeLog:
        """Pause an active timer."""
        pass

    @abstractmethod
    def resume_timer(self, time_log_id: str) -> TimeLog:
        """Resume a paused timer."""
        pass

    @abstractmethod
    def stop_timer(self, time_log_id: str) -> TimeLog:
        """Stop an active timer."""
        pass

    @abstractmethod
    def add_manual_time(self, user_id: str, description: str, duration: timedelta) -> TimeLog:
        """Add a manual time entry."""
        pass
