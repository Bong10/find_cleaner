from rest_framework import serializers
from .models import Service

class ServiceSerializer(serializers.ModelSerializer):  # NEW
    class Meta:
        model = Service
        fields = [
            "id", "name", "description",
            "min_hourly_rate", "min_hours_required",
            "active", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]  # NEW
