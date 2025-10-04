from django.db import models

class Service(models.Model):  # NEW
    name = models.CharField(max_length=100, unique=True)              # NEW
    description = models.TextField(blank=True)                        # NEW
    min_hourly_rate = models.DecimalField(max_digits=8, decimal_places=2, default=0)  # NEW
    min_hours_required = models.PositiveSmallIntegerField(default=1)  # NEW
    active = models.BooleanField(default=True)                        # NEW
    created_at = models.DateTimeField(auto_now_add=True)              # NEW
    updated_at = models.DateTimeField(auto_now=True)                  # NEW

    class Meta:
        ordering = ["name"]                                          # NEW

    def __str__(self) -> str:
        return f"{self.name} (≥{self.min_hours_required}h @ ≥{self.min_hourly_rate}/h)"  # NEW
