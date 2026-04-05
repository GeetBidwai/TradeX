from django.contrib.auth import get_user_model
from rest_framework import serializers
from users.models import User
from .models import Product


AuthUser = get_user_model()


class SupplierNestedSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()

    class Meta:
        model = AuthUser
        fields = ["id", "name", "email", "role"]

    def get_name(self, obj):
        profile = User.objects.filter(email__iexact=obj.email).only("name").first()
        return getattr(profile, "name", "") or obj.get_username()

    def get_role(self, obj):
        profile = User.objects.filter(email__iexact=obj.email).only("role").first()
        return getattr(profile, "role", "")


class ProductSerializer(serializers.ModelSerializer):
    supplier = SupplierNestedSerializer(read_only=True)

    class Meta:
        model = Product
        fields = ["id", "name", "price", "quantity", "supplier"]
