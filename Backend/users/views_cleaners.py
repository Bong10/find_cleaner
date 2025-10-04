# users/views_cleaners.py
# >>> ADDED: New ViewSet to expose Cleaner admin CRUD and self-service "me" endpoints

from rest_framework import viewsets, permissions, decorators, response, status
from django.shortcuts import get_object_or_404

from .models import Cleaner
from .serializers import (
    CleanerDetailSerializer,
    CleanerUpdateSerializer,
)


class CleanerViewSet(viewsets.ModelViewSet):
    """
    Admin CRUD:
      - GET    /api/users/cleaners/           (list)     -> IsAdminUser
      - POST   /api/users/cleaners/           (create)   -> IsAdminUser
      - GET    /api/users/cleaners/{id}/      (retrieve) -> IsAdminUser
      - PUT    /api/users/cleaners/{id}/      (update)   -> IsAdminUser
      - PATCH  /api/users/cleaners/{id}/      (partial)  -> IsAdminUser
      - DELETE /api/users/cleaners/{id}/      (destroy)  -> IsAdminUser

    Self-service:
      - GET    /api/users/cleaners/me/        (read own cleaner profile)        -> IsAuthenticated
      - PATCH  /api/users/cleaners/me/        (update own cleaner fields only)  -> IsAuthenticated
    """
    queryset = Cleaner.objects.select_related("user").all()
    serializer_class = CleanerDetailSerializer

    # >>> ADDED: Search/Ordering support (reuses your global DRF backends)
    search_fields = ["portfolio", "insurance_details", "user__email", "user__name"]
    ordering_fields = ["id", "years_of_experience", "clean_level", "user__email"]
    ordering = ["id"]

    # >>> ADDED: Per-action permissions (admin for CRUD; auth for "me")
    def get_permissions(self):
        if self.action in ["me"]:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]

    # >>> ADDED: Use write serializer for write actions; read serializer otherwise
    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return CleanerUpdateSerializer
        if self.action == "me" and self.request.method == "PATCH":
            return CleanerUpdateSerializer
        return CleanerDetailSerializer

    # >>> ADDED: Self endpoint
    @decorators.action(detail=False, methods=["get", "patch"], url_path="me")
    def me(self, request):
        cleaner = get_object_or_404(self.get_queryset(), user=request.user)

        if request.method.lower() == "get":
            return response.Response(CleanerDetailSerializer(cleaner).data)

        # PATCH: update only cleaner-allowed fields (serializer enforces this)
        ser = CleanerUpdateSerializer(cleaner, data=request.data, partial=True, context={"request": request})
        ser.is_valid(raise_exception=True)
        ser.save()
        return response.Response(CleanerDetailSerializer(cleaner).data, status=status.HTTP_200_OK)
