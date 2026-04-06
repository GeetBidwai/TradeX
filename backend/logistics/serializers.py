from rest_framework import serializers
from .models import Logistics, LogisticsInquiry

class LogisticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Logistics
        fields = '__all__'


class LogisticsInquirySerializer(serializers.ModelSerializer):
    service_type_display = serializers.CharField(
        source="get_service_type_display",
        read_only=True,
    )

    class Meta:
        model = LogisticsInquiry
        fields = [
            "id",
            "buyer",
            "name",
            "email",
            "service_type",
            "service_type_display",
            "cargo_type",
            "origin",
            "destination",
            "quantity",
            "weight",
            "notes",
            "telegram_username",
            "created_at",
        ]
        read_only_fields = ["id", "buyer", "created_at", "service_type_display"]
