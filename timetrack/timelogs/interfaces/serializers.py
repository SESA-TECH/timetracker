from rest_framework import serializers
from ..domain.models import TimeLog
from ..application.services import TimeTrackingService
from ..infrastructure.repositories import DjangoTimeLogRepository

class TimeLogSerializer(serializers.ModelSerializer):
    """Serializer for TimeLog model."""
    duration_minutes = serializers.SerializerMethodField()
    formatted_duration = serializers.SerializerMethodField()
    status_display = serializers.SerializerMethodField()
    paused_duration = serializers.DurationField(read_only=True)
    total_duration = serializers.SerializerMethodField()
    new_duration = serializers.DurationField(required=False)
    new_status = serializers.CharField(required=False)
    
    class Meta:
        model = TimeLog
        fields = [
            'id', 
            'description', 
            'status', 
            'start_time', 
            'end_time', 
            'duration', 
            'paused_duration',  
            'duration_minutes', 
            'formatted_duration',
            'total_duration',
            'status_display',
            'created_at',
            'new_duration',
            'new_status'
        ]
        read_only_fields = [
            'id', 
            'status', 
            'start_time', 
            'end_time', 
            'duration', 
            'paused_duration',
            'created_at'
        ]

    def get_duration_minutes(self, obj):
        """Convert duration to minutes for easier consumption."""
        return obj.duration.total_seconds() / 60 if obj.duration else 0

    def get_formatted_duration(self, obj):
        """
        Calculate and format the total duration, excluding paused time.
        
        Returns:
            str: Formatted duration string
        """
        # Total active duration (excluding paused time)
        active_duration = obj.duration
        
        # Format duration
        total_seconds = int(active_duration.total_seconds())
        hours, remainder = divmod(total_seconds, 3600)
        minutes, seconds = divmod(remainder, 60)
        
        return f"{hours:02d}:{minutes:02d}:{seconds:02d}"

    def get_total_duration(self, obj):
        """
        Calculate total time including paused duration.
        
        Returns:
            str: Total time duration
        """
        total_time = obj.duration + obj.paused_duration
        total_seconds = int(total_time.total_seconds())
        hours, remainder = divmod(total_seconds, 3600)
        minutes, seconds = divmod(remainder, 60)
        
        return f"{hours:02d}:{minutes:02d}:{seconds:02d}"

    def get_status_display(self, obj):
        """Get human-readable status display."""
        return obj.get_status_display()

class TimeLogCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating time log entries, 
    supporting both timer-based and manual time logging.
    """
    start_time = serializers.DateTimeField(required=True)
    duration = serializers.DurationField(required=True)
    end_time = serializers.DateTimeField(required=False, allow_null=True)

    class Meta:
        model = TimeLog
        fields = [
            'description', 
            'start_time', 
            'duration', 
            'end_time'
        ]

    def create(self, validated_data):
        """
        Create a time log entry, either via timer or manual logging.
        
        Supports:
        - Manual time logging with explicit start_time and duration
        - Optional end_time specification
        """
        # Get the user from the context
        user = self.context['request'].user
        
        # Extract data
        description = validated_data.get('description')
        start_time = validated_data.get('start_time')
        duration = validated_data.get('duration')
        end_time = validated_data.get('end_time')
        
        # Use service to add manual time
        service = TimeTrackingService(DjangoTimeLogRepository())
        time_log = service.add_manual_time(
            user_id=user.id, 
            description=description,
            start_time=start_time,
            duration=duration,
            end_time=end_time
        )
        
        return time_log
