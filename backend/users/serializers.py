from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import serializers
from .models import User


AuthUser = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ["id", "name", "email", "role", "password"]
        read_only_fields = ["id"]

    def validate_email(self, value):
        request = self.context.get("request")
        queryset = User.objects.filter(email__iexact=value)

        if request and request.method in ("PUT", "PATCH"):
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError("A user with this email already exists.")

        return value

    def validate(self, attrs):
        request = self.context.get("request")

        if request and request.method == "POST" and not attrs.get("password"):
            raise serializers.ValidationError({"password": "Password is required."})

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        password = validated_data.pop("password")
        email = validated_data["email"]

        if AuthUser.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError(
                {"email": "A login account with this email already exists."}
            )

        auth_user = AuthUser.objects.create_user(
            username=email,
            email=email,
            password=password,
        )

        try:
            profile = User.objects.create(**validated_data)
        except Exception:
            auth_user.delete()
            raise

        return profile
