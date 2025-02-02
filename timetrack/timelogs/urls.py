from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .interfaces.views import TimeLogViewSet

router = DefaultRouter()
router.register(r'timelogs', TimeLogViewSet, basename='timelog')

urlpatterns = [
    path('', include(router.urls)),
]
