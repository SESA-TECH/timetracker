from rest_framework import permissions

class TimeLogPermission(permissions.BasePermission):
    """
    Custom permission for TimeLog views.
    - Users can only see their own time logs
    - Admins can see all time logs
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        return request.user.is_staff or obj.user == request.user
