from rest_framework import viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny, IsAuthenticated
from users.models import User
from users.services import get_marketplace_profile
from .models import Logistics, LogisticsInquiry
from .serializers import LogisticsInquirySerializer, LogisticsSerializer


class LogisticsViewSet(viewsets.ModelViewSet):
    serializer_class = LogisticsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        profile = get_marketplace_profile(self.request.user)

        if profile and profile.role == "buyer":
            return Logistics.objects.filter(order__user=profile).select_related("order")

        if profile and profile.role == "supplier":
            return Logistics.objects.filter(order__product__supplier=self.request.user).select_related("order")

        return Logistics.objects.all().select_related("order")

    def perform_create(self, serializer):
        raise PermissionDenied("Logistics records are created automatically from orders")

    def perform_update(self, serializer):
        profile = get_marketplace_profile(self.request.user)
        order = serializer.instance.order

        if not profile or profile.role != "supplier":
            raise PermissionDenied("Only suppliers can update shipment tracking")

        if order.product.supplier_id != self.request.user.id:
            raise PermissionDenied("You can only update logistics for your own orders")

        serializer.save()

    def perform_destroy(self, instance):
        raise PermissionDenied("Logistics records cannot be deleted from the API")


class LogisticsInquiryViewSet(viewsets.ModelViewSet):
    serializer_class = LogisticsInquirySerializer
    authentication_classes = []
    permission_classes = [AllowAny]
    http_method_names = ["get", "post", "head", "options"]

    def get_queryset(self):
        profile = get_marketplace_profile(self.request.user)

        if profile and profile.role == "buyer":
            return LogisticsInquiry.objects.filter(email__iexact=profile.email).order_by(
                "-created_at"
            )

        if profile and profile.role == "supplier":
            return LogisticsInquiry.objects.all().order_by("-created_at")

        return LogisticsInquiry.objects.all().order_by("-created_at")

    def perform_create(self, serializer):
        profile = get_marketplace_profile(self.request.user)

        if profile is None and not getattr(self.request.user, "is_authenticated", False):
            profile = User.objects.filter(role="buyer").first()

        serializer.save(buyer=profile if profile and profile.role == "buyer" else None)
