from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils.translation import gettext_lazy as _
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from ..application.services import TimeTrackingService
from ..infrastructure.repositories import DjangoTimeLogRepository
from ..domain.models import TimeLog
from .serializers import TimeLogSerializer, TimeLogCreateSerializer
from .permissions import TimeLogPermission

@extend_schema(tags=['timelogs'])
class TimeLogViewSet(viewsets.ModelViewSet):
    """
    ViewSet for TimeLog operations.
    Implements CRUD operations and timer controls.
    """
    permission_classes = [TimeLogPermission]
    serializer_class = TimeLogSerializer
    
    # Add filter backends
    filter_backends = [
        DjangoFilterBackend, 
        filters.SearchFilter, 
        filters.OrderingFilter
    ]
    
    # Filterable fields
    filterset_fields = [
        'status', 
        'start_time', 
        'end_time', 
        'created_at'
    ]
    
    # Search fields
    search_fields = [
        'description'
    ]
    
    # Ordering fields
    ordering_fields = [
        'start_time', 
        'end_time', 
        'duration', 
        'created_at'
    ]
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.repository = DjangoTimeLogRepository()
        self.service = TimeTrackingService(self.repository)

    def get_queryset(self):
        """Filter queryset based on user permissions."""
        queryset = TimeLog.objects.all() if self.request.user.is_staff else TimeLog.objects.filter(user=self.request.user)
        
        # Additional custom filtering
        status = self.request.query_params.get('status')
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        
        if status:
            queryset = queryset.filter(status=status)
        
        if start_date:
            queryset = queryset.filter(start_time__date__gte=start_date)
        
        if end_date:
            queryset = queryset.filter(end_time__date__lte=end_date)
        
        return queryset

    @extend_schema(
        summary="Search and filter time logs",
        description="Retrieve time logs with advanced filtering and search capabilities.",
        parameters=[
            OpenApiParameter(
                name='status', 
                description='Filter by time log status (CREATED, RUNNING, PAUSED, COMPLETED)', 
                required=False, 
                type=str
            ),
            OpenApiParameter(
                name='start_date', 
                description='Filter logs with start date on or after this date', 
                required=False, 
                type=str
            ),
            OpenApiParameter(
                name='end_date', 
                description='Filter logs with end date on or before this date', 
                required=False, 
                type=str
            ),
            OpenApiParameter(
                name='search', 
                description='Search logs by description', 
                required=False, 
                type=str
            ),
            OpenApiParameter(
                name='ordering', 
                description='Order results (prefix with - for descending)', 
                required=False, 
                type=str
            )
        ]
    )
    def list(self, request, *args, **kwargs):
        """
        List time logs with advanced filtering and search.
        
        Query Parameters:
        - status: Filter by log status
        - start_date: Logs started on or after this date
        - end_date: Logs ended on or before this date
        - search: Search in description
        - ordering: Order results
        """
        return super().list(request, *args, **kwargs)

    def get_serializer_class(self):
        """Return appropriate serializer class."""
        if self.action == 'create':
            return TimeLogCreateSerializer
        return TimeLogSerializer

    @extend_schema(
        summary="Log work time manually",
        description="Create a time log entry by specifying start time, duration, and optional end time.",
        request=TimeLogCreateSerializer,
        responses={201: TimeLogSerializer},
        examples=[
            OpenApiExample(
                'Manual Time Log',
                value={
                    'description': 'Project documentation',
                    'start_time': '2025-02-01T09:00:00Z',
                    'duration': '01:30:00',  # 1 hour 30 minutes
                    'end_time': '2025-02-01T10:30:00Z'  # Optional
                },
                request_only=True,
            ),
        ]
    )
    def create(self, request):
        """
        Create a new time log entry.
        Supports both manual time logging and timer-based logging.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        time_log = serializer.save(user=self.request.user)
        
        response_serializer = TimeLogSerializer(time_log)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    @extend_schema(
        summary="Create and start a new timer",
        description="Creates a new time log and immediately starts tracking time.",
        request=TimeLogCreateSerializer,
        responses={201: TimeLogSerializer},
        examples=[
            OpenApiExample(
                'Valid Request',
                value={'description': 'Working on project documentation'},
                request_only=True,
            ),
        ]
    )
    @action(detail=False, methods=['post'])
    def start_new(self, request):
        """Create and start a new timer."""
        description = request.data.get('description')
        if not description:
            return Response(
                {'error': _('Description is required')},
                status=status.HTTP_400_BAD_REQUEST
            )

        time_log = self.service.create_and_start_timer(
            user_id=request.user.id,
            description=description
        )
        serializer = self.get_serializer(time_log)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @extend_schema(
        summary="Start a timer for an existing time log",
        description="Starts a previously created time log timer.",
        responses={200: TimeLogSerializer}
    )
    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        """Start an existing timer."""
        try:
            time_log = self.service.start_timer(pk)
            serializer = self.get_serializer(time_log)
            return Response(serializer.data)
        except ValueError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @extend_schema(
        summary="Pause an active timer",
        description="Pauses an active timer and records the elapsed time.",
        responses={200: TimeLogSerializer}
    )
    @action(detail=True, methods=['post'])
    def pause(self, request, pk=None):
        """Pause an active timer."""
        try:
            time_log = self.service.pause_timer(pk)
            serializer = self.get_serializer(time_log)
            return Response(serializer.data)
        except ValueError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @extend_schema(
        summary="Resume a paused timer",
        description="Resumes a previously paused timer.",
        responses={200: TimeLogSerializer}
    )
    @action(detail=True, methods=['post'])
    def resume(self, request, pk=None):
        """Resume a paused timer."""
        try:
            time_log = self.service.resume_timer(pk)
            serializer = self.get_serializer(time_log)
            return Response(serializer.data)
        except ValueError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @extend_schema(
        summary="Stop and complete a timer",
        description="Stops an active or paused timer and finalizes the time log.",
        responses={200: TimeLogSerializer}
    )
    @action(detail=True, methods=['post'])
    def stop(self, request, pk=None):
        """Stop an active timer."""
        try:
            time_log = self.service.stop_timer(pk)
            serializer = self.get_serializer(time_log)
            return Response(serializer.data)
        except ValueError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
