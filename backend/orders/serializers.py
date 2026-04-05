from rest_framework import serializers
from products.models import Product
from users.models import User
from .models import Order


class UserNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "name", "email", "role"]


class ProductNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["id", "name", "price", "quantity"]


class OrderSerializer(serializers.ModelSerializer):
    user = UserNestedSerializer(read_only=True)
    product = ProductNestedSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        source="product",
        write_only=True,
    )

    class Meta:
        model = Order
        fields = [
            "id",
            "user",
            "product",
            "product_id",
            "quantity",
            "order_type",
            "status",
            "shipping_mode",
            "supplier_response",
            "unit_price",
            "total_amount",
            "order_date",
        ]
        read_only_fields = [
            "status",
            "supplier_response",
            "unit_price",
            "total_amount",
        ]
