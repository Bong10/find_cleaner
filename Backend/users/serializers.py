# users/serializers.py  (FULL FILE SHOWN; existing code unchanged)
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Cleaner, Role, User, Admin, Employer

User = get_user_model()

# 6) Djoser user.create is disabled in settings.
#    Keeping this class as-is to avoid breaking references.
class UserCreateSerializer(serializers.Serializer):
    def validate(self, attrs):
        raise serializers.ValidationError("Registration is disabled by the administrator.")

class CustomUserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField(read_only=True)  # Return role name
    role_id = serializers.PrimaryKeyRelatedField(
        source='role',
        queryset=Role.objects.all(),
        write_only=True,
        required=False,
    )

    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'phone_number',
            'name',
            'gender',
            'profile_picture',
            'address',
            'password',
            'role',       # exposed as role name
            'role_id',    # used for input
            'profile_completed',
        ]
        # CHANGED: only email + password are required; everything else NOT required
        extra_kwargs = {
            'email': {'required': True},
            'password': {'write_only': True, 'required': True},

            'phone_number':    {'required': False, 'allow_null': True},
            'name':            {'required': False, 'allow_blank': True},
            'gender':          {'required': False, 'allow_blank': True},
            'address':         {'required': False, 'allow_blank': True},
            'profile_picture': {'required': False},
        }

    def get_role(self, obj):
        return obj.role.name if obj.role else None

    def create(self, validated_data):
        # create_user handles set_password
        user = User.objects.create_user(**validated_data)
        return user

class CleanerRegistrationSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()

    class Meta:
        model = Cleaner
        fields = [
            'user', 'portfolio', 'years_of_experience', 'dbs_check',
            'insurance_details', 'availibility_status', 'clean_level', 'id'
        ]
        # CHANGED: all cleaner fields optional during registration
        extra_kwargs = {
            'portfolio': {'required': False, 'allow_blank': True, 'allow_null': True},
            'years_of_experience': {'required': False, 'allow_null': True},
            'dbs_check': {'required': False},
            'insurance_details': {'required': False, 'allow_blank': True, 'allow_null': True},
            'availibility_status': {'required': False},
            'clean_level': {'required': False, 'allow_null': True},
        }

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        role = Role.objects.filter(name__iexact="cleaner").first()  # guarded
        if not role:
            raise serializers.ValidationError("Role 'cleaner' is not configured.")
        user = User.objects.create_user(**user_data)
        user.role = role
        user.is_active = False  # keep current activation policy
        user.save()
        cleaner = Cleaner.objects.create(user=user, **validated_data)
        return cleaner

class EmployerRegistrationSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()

    class Meta:
        model = Employer
        fields = ['user', 'business_name', 'location', 'id']
        # CHANGED: employer optional fields
        extra_kwargs = {
            'business_name': {'required': False, 'allow_blank': True, 'allow_null': True},
            'location': {'required': False, 'allow_blank': True, 'allow_null': True},
        }

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        role = Role.objects.filter(name__iexact="employer").first()  # guarded
        if not role:
            raise serializers.ValidationError("Role 'employer' is not configured.")
        user = User.objects.create_user(**user_data)
        user.role = role
        user.is_active = False  # keep current activation policy
        user.save()
        employer = Employer.objects.create(user=user, **validated_data)
        return employer

class AdminRegistrationSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()

    class Meta:
        model = Admin
        fields = ['user', 'id']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        role = Role.objects.filter(name__iexact="admin").first()  # guarded
        if not role:
            raise serializers.ValidationError("Role 'admin' is not configured.")
        user = User.objects.create_user(**user_data)
        user.role = role
        # keep consistent policy: inactive until activation
        user.is_active = False
        user.save()
        admin = Admin.objects.create(user=user)
        return admin

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'name']
        extra_kwargs = {'name': {'required': True, 'allow_blank': False}}

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'phone_number', 'email', 'name', 'address', 'gender', 'profile_picture', 'is_active']


# -------------------------------------------------------------------
# >>> ADDED: Employer serializers for admin CRUD & self-service
# -------------------------------------------------------------------

class EmployerDetailSerializer(serializers.ModelSerializer):
    """
    Read serializer: exposes employer with nested user fields via your existing UserSerializer.
    """
    from .serializers import UserSerializer as _UserSerializer  # avoid circular import on type checking
    user = _UserSerializer(read_only=True)

    class Meta:
        model = Employer
        fields = ["id", "business_name", "location", "user"]


class EmployerUpdateSerializer(serializers.ModelSerializer):
    """
    Write serializer: restricts writable fields to employer-specific data only.
    User fields (email, name, etc.) remain managed by Djoser /auth/users/me/.
    """
    class Meta:
        model = Employer
        fields = ["business_name", "location"]  # write-only subset for updates/creates


# -------------------------------------------------------------------
# >>> ADDED: Cleaner serializers for admin CRUD & self-service
# -------------------------------------------------------------------

class CleanerDetailSerializer(serializers.ModelSerializer):
    """
    Read serializer: exposes cleaner with nested user fields via your existing UserSerializer.
    """
    user = UserSerializer(read_only=True)

    class Meta:
        model = Cleaner
        fields = [
            "id",
            "portfolio",
            "years_of_experience",
            "dbs_check",
            "insurance_details",
            "availibility_status",
            "clean_level",
            "user",
        ]


class CleanerUpdateSerializer(serializers.ModelSerializer):
    """
    Write serializer: restricts writable fields to cleaner-specific data only.
    User fields (email, name, etc.) remain managed by Djoser /auth/users/me/.
    """
    class Meta:
        model = Cleaner
        fields = [
            "portfolio",
            "years_of_experience",
            "dbs_check",
            "insurance_details",
            "availibility_status",
            "clean_level",
        ]
