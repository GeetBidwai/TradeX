from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from products.models import Product
from users.models import User
from orders.models import Order
from .models import Logistics


AuthUser = get_user_model()


class LogisticsFlowTests(APITestCase):
    def setUp(self):
        self.supplier_auth = AuthUser.objects.create_user(
            username="supplier2@example.com",
            email="supplier2@example.com",
            password="testpass123",
        )
        self.buyer_auth = AuthUser.objects.create_user(
            username="buyer2@example.com",
            email="buyer2@example.com",
            password="testpass123",
        )
        self.supplier_profile = User.objects.create(
            name="Supplier Two",
            email="supplier2@example.com",
            role="supplier",
        )
        self.buyer_profile = User.objects.create(
            name="Buyer Two",
            email="buyer2@example.com",
            role="buyer",
        )
        self.product = Product.objects.create(
            name="Steel Sheet",
            price=90.00,
            quantity=50,
            supplier=self.supplier_auth,
        )
        self.order = Order.objects.create(
            user=self.buyer_profile,
            product=self.product,
            quantity=5,
            order_type=Order.TYPE_ORDER,
            shipping_mode=Order.SHIPPING_SEA,
            unit_price=90.00,
            total_amount=450.00,
        )
        self.logistics = Logistics.objects.create(
            order=self.order,
            status=Logistics.STATUS_PENDING,
            tracking_stage=Logistics.STAGE_SUPPLIER,
            shipping_mode=Logistics.SHIPPING_SEA,
            location="Supplier",
        )

    def test_supplier_can_update_tracking(self):
        self.client.force_authenticate(user=self.supplier_auth)

        response = self.client.patch(
            reverse("logistics-detail", args=[self.logistics.id]),
            {
                "tracking_stage": Logistics.STAGE_TRANSPORT,
                "status": Logistics.STATUS_IN_TRANSIT,
                "location": "Outbound Hub",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.logistics.refresh_from_db()
        self.assertEqual(self.logistics.tracking_stage, Logistics.STAGE_TRANSPORT)
        self.assertEqual(self.logistics.status, Logistics.STATUS_IN_TRANSIT)
        self.assertEqual(self.logistics.location, "Outbound Hub")
