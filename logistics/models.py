from django.db import models
from orders.models import Order


class Logistics(models.Model):
    STATUS_PENDING = "pending"
    STATUS_SHIPPED = "shipped"
    STATUS_DELIVERED = "delivered"

    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_SHIPPED, "Shipped"),
        (STATUS_DELIVERED, "Delivered"),
    ]

    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=50,
        choices=STATUS_CHOICES,
        default=STATUS_PENDING
    )
    location = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.order.id} - {self.status}"
