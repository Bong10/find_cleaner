from django.contrib import admin
from .models import Service

@admin.register(Service)  # NEW
class ServiceAdmin(admin.ModelAdmin):
    list_display = ("name", "min_hourly_rate", "min_hours_required", "active", "updated_at")  # NEW
    list_filter = ("active",)  # NEW
    search_fields = ("name", "description")  # NEW
