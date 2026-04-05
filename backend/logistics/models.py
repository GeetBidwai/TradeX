from django.db import models
from orders.models import Order


class Logistics(models.Model):
    STATUS_PENDING = "pending"
    STATUS_IN_TRANSIT = "in_transit"
    STATUS_SHIPPED = "shipped"
    STATUS_DELIVERED = "delivered"

    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_IN_TRANSIT, "In Transit"),
        (STATUS_SHIPPED, "Shipped"),
        (STATUS_DELIVERED, "Delivered"),
    ]

    STAGE_SUPPLIER = "supplier"
    STAGE_WAREHOUSE = "warehouse"
    STAGE_TRANSPORT = "transport"
    STAGE_DELIVERY = "delivery"
    STAGE_FINAL_DESTINATION = "final_destination"
    STAGE_CHOICES = [
        (STAGE_SUPPLIER, "Supplier"),
        (STAGE_WAREHOUSE, "Warehouse"),
        (STAGE_TRANSPORT, "Transport"),
        (STAGE_DELIVERY, "Delivery"),
        (STAGE_FINAL_DESTINATION, "Final Destination"),
    ]

    SHIPPING_AIR = "air"
    SHIPPING_SEA = "sea"
    SHIPPING_CHOICES = [
        (SHIPPING_AIR, "Air"),
        (SHIPPING_SEA, "Sea"),
    ]

    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=50,
        choices=STATUS_CHOICES,
        default=STATUS_PENDING,
    )
    tracking_stage = models.CharField(
        max_length=30,
        choices=STAGE_CHOICES,
        default=STAGE_SUPPLIER,
    )
    shipping_mode = models.CharField(
        max_length=10,
        choices=SHIPPING_CHOICES,
        blank=True,
        default="",
    )
    location = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.order.id} - {self.status}"
