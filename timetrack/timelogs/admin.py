from django.contrib import admin
from .domain.models import TimeLog

# Register your models here.

@admin.register(TimeLog)
class TimeLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'description', 'duration', 'status', 'created_at')
    list_filter = ('status', 'created_at', 'user')
    search_fields = ('description', 'user__email', 'user__username')
    readonly_fields = ('id', 'created_at', 'updated_at')
    ordering = ('-created_at',)
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(user=request.user)
