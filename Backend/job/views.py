from datetime import datetime
from django.db.models import Q, Exists, OuterRef, Count, Subquery, Avg, Value
from django.db.models.functions import Coalesce
from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.db import IntegrityError, transaction
from rest_framework.exceptions import ValidationError

from .models import (
    Job, JobApplication, Shortlist, JobBooking, JobService, CleanerService,
    CleanerReview, JobActionLog,  # NEW
)
from .serializers import (
    JobCreateUpdateSerializer, JobListSerializer, JobDetailSerializer,
    JobApplicationCreateSerializer, JobApplicationListSerializer,
    ShortlistCreateSerializer, ShortlistListSerializer, JobBookingSerializer,
    JobServiceSerializer, CleanerServiceSerializer, JobMetricsSerializer,
    CleanerDiscoverySerializer, JobActionLogSerializer,  # NEW
)
from .permissions import IsJobOwnerOrReadOnly
from users.models import Employer, Cleaner
from services.models import Service


# ---------------------------
# Helpers (availability)
# ---------------------------

def _parse_minutes(time_str: str) -> int:
    try:
        t = datetime.strptime(time_str, "%H:%M")
        return t.hour * 60 + t.minute
    except Exception:
        return -1


def _overlaps(start_a: int, dur_a: int, start_b: int, dur_b: int) -> bool:
    end_a = start_a + dur_a
    end_b = start_b + dur_b
    return not (end_a <= start_b or end_b <= start_a)


def _has_conflict(cleaner: Cleaner, date_obj, start_time_str: str, hours_required: int) -> bool:
    start_m = _parse_minutes(start_time_str)
    if start_m < 0:
        return False
    dur_m = int(hours_required) * 60
    bookings = JobBooking.objects.select_related("job").filter(
        cleaner=cleaner,
        job__date=date_obj,
        status__in=["cf", "cp"],
    )
    for b in bookings:
        bm = _parse_minutes(b.job.time)
        if bm >= 0 and _overlaps(start_m, dur_m, bm, int(b.job.hours_required) * 60):
            return True
    return False


def get_employer_for_user(user):
    if hasattr(user, "employer"):
        return user.employer
    raise PermissionError("Only employers can perform this action.")


def _log(job: Job, action: str, *, employer: Employer | None = None, cleaner: Cleaner | None = None, message: str = ""):  # NEW
    JobActionLog.objects.create(  # NEW
        job=job, action=action, actor_employer=employer, actor_cleaner=cleaner, message=message
    )


# ---------------------------
# Jobs
# ---------------------------

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all().select_related("employer").prefetch_related("services")
    permission_classes = [IsAuthenticated, IsJobOwnerOrReadOnly]
    lookup_field = "job_id"

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = {
        "status": ["exact", "in"],
        "date": ["exact", "gte", "lte"],
        "services": ["exact"],
        "is_archived": ["exact"],
    }
    search_fields = ["title", "description", "location"]
    ordering_fields = ["created_at", "date", "hourly_rate"]
    ordering = ["-created_at"]

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return JobCreateUpdateSerializer
        if self.action == "list":
            return JobListSerializer
        return JobDetailSerializer

    def get_queryset(self):
        qs = super().get_queryset().filter(is_archived=False)
        user = self.request.user

        mine = self.request.query_params.get("mine")
        if mine == "true" and hasattr(user, "employer"):
            return qs.filter(employer_id=user.employer.id)
        if self.action == "list":
            return qs.filter(status="o")
        return qs

    def perform_create(self, serializer):
        employer = get_employer_for_user(self.request.user)
        job = serializer.save(employer=employer, status="o")
        _log(job, "job_create", employer=employer, message="Job created")  # NEW

    def perform_update(self, serializer):
        instance = self.get_object()
        if instance.status in ("t", "ip", "c"):
            raise PermissionError("You can only edit jobs that are open/pending.")
        job = serializer.save()
        _log(job, "job_update", employer=getattr(self.request.user, "employer", None), message="Job updated")  # NEW

    def destroy(self, request, *args, **kwargs):
        job = self.get_object()
        if job.is_archived:
            return Response({"detail": "Already archived."}, status=200)
        from django.utils.timezone import now
        job.is_archived = True
        job.archived_at = now()
        job.save(update_fields=["is_archived", "archived_at"])
        _log(job, "job_update", employer=getattr(request.user, "employer", None), message="Job archived")  # NEW
        return Response(status=204)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated, IsJobOwnerOrReadOnly])
    def close(self, request, job_id=None):
        job = self.get_object()
        job.status = "c"
        job.save(update_fields=["status"])
        _log(job, "job_close", employer=request.user.employer, message="Job closed")  # NEW
        return Response({"detail": "Job closed.", "status": job.status})

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated, IsJobOwnerOrReadOnly])
    def reopen(self, request, job_id=None):
        job = self.get_object()
        if JobApplication.objects.filter(job_id=job.job_id, status="a").exists():
            return Response({"detail": "Cannot reopen a job with an accepted application."}, status=400)
        job.status = "o"
        job.save(update_fields=["status"])
        _log(job, "job_reopen", employer=request.user.employer, message="Job reopened")  # NEW
        return Response({"detail": "Job reopened.", "status": job.status})

    # ---------- Employer job metrics ----------
    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated], url_path="metrics")
    def metrics(self, request):
        if not hasattr(request.user, "employer"):
            return Response({"detail": "Only employers can view metrics."}, status=403)

        employer_id = request.user.employer.id

        latest_booking_status = Subquery(
            JobBooking.objects.filter(job=OuterRef("pk"))
            .order_by("-booking_id")
            .values("status")[:1]
        )

        qs = (
            Job.objects.filter(employer_id=employer_id, is_archived=False)
            .annotate(
                applicants_total=Count("jobapplication", distinct=True),
                applicants_pending=Count(
                    "jobapplication", filter=Q(jobapplication__status="p"), distinct=True
                ),
                applicants_accepted=Count(
                    "jobapplication", filter=Q(jobapplication__status="a"), distinct=True
                ),
                has_booking=Exists(JobBooking.objects.filter(job_id=OuterRef("pk"))),
                latest_booking_status=latest_booking_status,
            )
            .order_by("-created_at")
        )

        page = self.paginate_queryset(qs)
        serializer = JobMetricsSerializer(page or qs, many=True)
        return self.get_paginated_response(serializer.data) if page is not None else Response(serializer.data)

    # ---------- Job audit feed ----------
    @action(detail=True, methods=["get"], permission_classes=[IsAuthenticated], url_path="audit")  # NEW
    def audit(self, request, job_id=None):  # NEW
        job = self.get_object()
        logs = job.audit_logs.all()
        page = self.paginate_queryset(logs)
        ser = JobActionLogSerializer(page or logs, many=True)
        return self.get_paginated_response(ser.data) if page is not None else Response(ser.data)


# ---------------------------
# Applications (with conflict check + audit)
# ---------------------------

class JobApplicationViewSet(
    viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.ListModelMixin, mixins.RetrieveModelMixin
):
    queryset = JobApplication.objects.all().select_related("job", "cleaner")
    permission_classes = [IsAuthenticated]
    lookup_field = "application_id"

    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = {"job": ["exact"], "status": ["exact", "in"], "date_applied": ["gte", "lte"]}
    ordering_fields = ["date_applied"]
    ordering = ["-date_applied"]

    def get_serializer_class(self):
        return JobApplicationCreateSerializer if self.action == "create" else JobApplicationListSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if hasattr(user, "employer"):
            return qs.filter(job__employer_id=user.employer.id)
        elif hasattr(user, "cleaner"):
            return qs.filter(cleaner_id=user.cleaner.id)
        return qs.none()

    def perform_create(self, serializer):
        try:
            with transaction.atomic():
                serializer.save()
        except IntegrityError:
            raise ValidationError({"non_field_errors": ["You have already applied to this job."]})

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def accept(self, request, application_id=None):
        app = self.get_object()
        user = request.user
        if not hasattr(user, "employer") or app.job.employer_id != user.employer.id:
            return Response({"detail": "Only the job owner can accept applications."}, status=403)
        if app.status != "p":
            return Response({"detail": "Only pending applications can be accepted."}, status=400)

        if _has_conflict(app.cleaner, app.job.date, app.job.time, app.job.hours_required):
            return Response({"detail": "Cleaner has a conflicting booking at that time."}, status=409)

        from django.utils.timezone import now  # NEW
        app.status = "a"
        app.accepted_by = user.employer          # NEW
        app.accepted_at = now()                  # NEW
        app.rejected_by = None                   # NEW
        app.rejected_at = None                   # NEW
        app.rejection_reason = ""                # NEW
        app.save(update_fields=["status", "accepted_by", "accepted_at", "rejected_by", "rejected_at", "rejection_reason"])

        job = app.job
        if job.status == "o":
            job.status = "t"
            job.save(update_fields=["status"])
        booking, _ = JobBooking.objects.get_or_create(job=job, cleaner=app.cleaner, defaults={"status": "cf"})
        _log(job, "app_accept", employer=user.employer, message=f"Accepted application {app.application_id}")  # NEW
        _log(job, "booking_create", employer=user.employer, message=f"Booking {booking.booking_id} created/ensured")  # NEW
        return Response({"detail": "Application accepted."})

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def reject(self, request, application_id=None):
        app = self.get_object()
        user = request.user
        if not hasattr(user, "employer") or app.job.employer_id != user.employer.id:
            return Response({"detail": "Only the job owner can reject applications."}, status=403)
        if app.status != "p":
            return Response({"detail": "Only pending applications can be rejected."}, status=400)

        reason = request.data.get("reason", "")  # NEW
        from django.utils.timezone import now    # NEW
        app.status = "r"
        app.rejected_by = user.employer          # NEW
        app.rejected_at = now()                  # NEW
        app.rejection_reason = reason[:255] if reason else ""  # NEW
        app.accepted_by = None                   # NEW
        app.accepted_at = None                   # NEW
        app.save(update_fields=["status", "rejected_by", "rejected_at", "rejection_reason", "accepted_by", "accepted_at"])
        _log(app.job, "app_reject", employer=user.employer, message=f"Rejected application {app.application_id}. Reason: {app.rejection_reason}")  # NEW
        return Response({"detail": "Application rejected."})


# ---------------------------
# Shortlist (uses default id) + audit
# ---------------------------

class ShortlistViewset(
    viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.DestroyModelMixin, mixins.ListModelMixin
):
    queryset = Shortlist.objects.all().select_related("job", "cleaner")
    permission_classes = [IsAuthenticated]
    lookup_field = "id"

    def get_serializer_class(self):
        return ShortlistCreateSerializer if self.action == "create" else ShortlistListSerializer

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, "employer"):
            return self.queryset.filter(job__employer_id=user.employer.id)
        if hasattr(user, "cleaner"):  # <-- add this branch
            return self.queryset.filter(cleaner_id=user.cleaner.id)
        return self.queryset.none()


    def perform_create(self, serializer):  # NEW
        sl = serializer.save()
        _log(sl.job, "shortlist_add", employer=getattr(self.request.user, "employer", None),
             message=f"Shortlisted cleaner {sl.cleaner_id}")  # NEW

    def destroy(self, request, *args, **kwargs):  # NEW
        instance = self.get_object()
        self.check_object_permissions(request, instance)
        job = instance.job
        resp = super().destroy(request, *args, **kwargs)
        _log(job, "shortlist_remove", employer=getattr(request.user, "employer", None),
             message=f"Removed cleaner {instance.cleaner_id} from shortlist")  # NEW
        return resp


# ---------------------------
# Bookings
# ---------------------------

class JobBookingViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = JobBooking.objects.all().select_related("job", "cleaner")
    serializer_class = JobBookingSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "booking_id"

    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = {"job": ["exact"], "status": ["exact", "in"]}
    ordering_fields = ["booking_id"]


# ---------------------------
# JobService attach/detach (with service minimums) + audit
# ---------------------------

class JobServiceViewSet(
    viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.DestroyModelMixin, mixins.ListModelMixin
):
    """
    Employer attaches services to a job.
    Body: { "job": <job_id>, "service": <service_id> }
    """
    queryset = JobService.objects.all().select_related("job", "service")
    serializer_class = JobServiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, "employer"):
            return self.queryset.filter(job__employer_id=user.employer.id)
        return self.queryset.none()

    def create(self, request, *args, **kwargs):
        job_id = request.data.get("job")
        service_id = request.data.get("service")
        if not job_id or not service_id:
            return Response({"detail": "job and service are required"}, status=400)

        try:
            job = Job.objects.get(pk=job_id)
        except Job.DoesNotExist:
            return Response({"detail": "job not found"}, status=404)
        if not hasattr(request.user, "employer") or job.employer_id != request.user.employer.id:
            return Response({"detail": "Only job owner can attach services."}, status=403)

        try:
            svc = Service.objects.get(pk=service_id, active=True)
        except Service.DoesNotExist:
            return Response({"detail": "service not found or inactive"}, status=404)

        if job.hourly_rate < svc.min_hourly_rate:
            return Response(
                {"detail": f"Job hourly_rate ({job.hourly_rate}) is below service minimum ({svc.min_hourly_rate}). "
                           f"Increase the job's hourly_rate first."},
                status=400,
            )
        if job.hours_required < svc.min_hours_required:
            return Response(
                {"detail": f"Job hours_required ({job.hours_required}) is below service minimum ({svc.min_hours_required}). "
                           f"Increase the job's hours_required first."},
                status=400,
            )

        resp = super().create(request, *args, **kwargs)
        _log(job, "service_attach", employer=request.user.employer, message=f"Attached service {service_id}")  # NEW
        return resp

    def destroy(self, request, *args, **kwargs):  # NEW
        instance: JobService = self.get_object()
        if not hasattr(request.user, "employer") or instance.job.employer_id != request.user.employer.id:
            return Response({"detail": "Only job owner can detach services."}, status=403)
        job = instance.job
        service_id = instance.service_id
        resp = super().destroy(request, *args, **kwargs)
        _log(job, "service_detach", employer=request.user.employer, message=f"Detached service {service_id}")  # NEW
        return resp


# ---------------------------
# Cleaner advertises services
# ---------------------------

class CleanerServiceViewSet(
    viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.DestroyModelMixin, mixins.ListModelMixin
):
    """
    Cleaner advertises which services they provide.
    Body: { "service": <service_id> } ; cleaner inferred from token
    """
    queryset = CleanerService.objects.all().select_related("cleaner", "service")
    serializer_class = CleanerServiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, "cleaner"):
            return self.queryset.filter(cleaner_id=user.cleaner.id)
        return self.queryset.none()

    def create(self, request, *args, **kwargs):
        if not hasattr(request.user, "cleaner"):
            return Response({"detail": "Only cleaners can add services."}, status=403)
        data = request.data.copy()
        data["cleaner"] = request.user.cleaner.id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=201)


# ---------------------------
# Cleaner discovery (employer-only)
# ---------------------------

class CleanerDiscoveryViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    """
    GET /api/cleaners-search/?service=ID&location=yaounde&min_rating=4&date=2025-09-02&time=09:00&hours=3&only_available=true
    """
    permission_classes = [IsAuthenticated]
    serializer_class = CleanerDiscoverySerializer

    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["user__name", "user__address"]
    ordering_fields = ["id", "rating_avg"]
    ordering = ["id"]

    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, "employer"):
            return Cleaner.objects.none()

        qs = Cleaner.objects.select_related("user").prefetch_related(
            "cleanerservice_set__service"
        )
        qs = qs.annotate(
            rating_avg=Coalesce(Avg("reviews__rating"), Value(0.0))
        )

        service_id = self.request.query_params.get("service")
        if service_id:
            qs = qs.filter(cleanerservice__service_id=service_id)

        location = self.request.query_params.get("location")
        if location:
            qs = qs.filter(user__address__icontains=location)

        min_rating = self.request.query_params.get("min_rating")
        if min_rating:
            try:
                mr = float(min_rating)
                qs = qs.filter(rating_avg__gte=mr)
            except ValueError:
                pass

        date_str = self.request.query_params.get("date")
        time_str = self.request.query_params.get("time")
        hours = self.request.query_params.get("hours")
        only_avail = self.request.query_params.get("only_available")

        self._availability_ctx = None
        if date_str and time_str and hours:
            try:
                from datetime import date as _d
                y, m, d = [int(p) for p in date_str.split("-")]
                date_obj = _d(y, m, d)
                hrs = int(hours)
                self._availability_ctx = (date_obj, time_str, hrs)
            except Exception:
                self._availability_ctx = None

        self._only_available = (only_avail == "true")
        return qs

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        ctx = getattr(self, "_availability_ctx", None)
        only_available = getattr(self, "_only_available", False)
        if ctx:
            date_obj, time_str, hrs = ctx
            result = []
            for c in queryset:
                available = not _has_conflict(c, date_obj, time_str, hrs)
                setattr(c, "_is_available", available)
                services = [cs.service for cs in getattr(c, "cleanerservice_set").all()]
                setattr(c, "_services_cache", services)
                if only_available and not available:
                    continue
                result.append(c)
            queryset = result
        else:
            for c in queryset:
                services = [cs.service for cs in getattr(c, "cleanerservice_set").all()]
                setattr(c, "_services_cache", services)

        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page or queryset, many=True, context={"request": request})
        return self.get_paginated_response(serializer.data) if page is not None else Response(serializer.data)
