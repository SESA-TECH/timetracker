from typing import List, Optional
from django.shortcuts import get_object_or_404
from ..domain.interfaces import TimeLogRepositoryInterface
from ..domain.models import TimeLog

class DjangoTimeLogRepository(TimeLogRepositoryInterface):
    """Django ORM implementation of the TimeLog repository."""

    def create(self, user_id: str, description: str) -> TimeLog:
        return TimeLog.objects.create(
            user_id=user_id,
            description=description
        )

    def get_by_id(self, time_log_id: str) -> Optional[TimeLog]:
        try:
            return TimeLog.objects.get(id=time_log_id)
        except TimeLog.DoesNotExist:
            return None

    def get_user_logs(self, user_id: str, **filters) -> List[TimeLog]:
        queryset = TimeLog.objects.filter(user_id=user_id)
        
        # Apply filters
        status = filters.get('status')
        if status:
            queryset = queryset.filter(status=status)
            
        start_date = filters.get('start_date')
        if start_date:
            queryset = queryset.filter(created_at__gte=start_date)
            
        end_date = filters.get('end_date')
        if end_date:
            queryset = queryset.filter(created_at__lte=end_date)
            
        return list(queryset)

    def update(self, time_log: TimeLog) -> TimeLog:
        time_log.save()
        return time_log

    def delete(self, time_log_id: str) -> bool:
        try:
            time_log = TimeLog.objects.get(id=time_log_id)
            time_log.delete()
            return True
        except TimeLog.DoesNotExist:
            return False
