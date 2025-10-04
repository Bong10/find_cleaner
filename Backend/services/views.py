# services/views.py
from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAdminUser    # CHANGED
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from .models import Service
from .serializers import ServiceSerializer
from rest_framework.permissions import SAFE_METHODS             # NEW

class ServiceViewSet(viewsets.ModelViewSet):                    # CHANGED (was ReadOnlyModelViewSet)
    """
    Public: GET list/retrieve
    Admin:  POST/PATCH/DELETE
    """
    queryset = Service.objects.all().order_by("name")           # CHANGED (allow admin to see all)
    serializer_class = ServiceSerializer

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["active"]
    search_fields = ["name", "description"]
    ordering_fields = ["name", "min_hourly_rate", "min_hours_required", "updated_at"]
    ordering = ["name"]

    def get_permissions(self):                                  # NEW
        if self.request.method in SAFE_METHODS:
            return [AllowAny()]
        return [IsAdminUser()]
