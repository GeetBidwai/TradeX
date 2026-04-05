# Create your models here.
from django.db import models
from products.models import Product
from users.models import User


class Order(models.Model):
    TYPE_ENQUIRY = "enquiry"
    TYPE_ORDER = "order"
    TYPE_CHOICES = [
        (TYPE_ENQUIRY, "Enquiry"),
        (TYPE_ORDER, "Order"),
    ]

    STATUS_PENDING = "pending"
    STATUS_CONFIRMED = "confirmed"
    STATUS_RESPONDED = "responded"
    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_CONFIRMED, "Confirmed"),
        (STATUS_RESPONDED, "Responded"),
    ]

    SHIPPING_AIR = "air"
    SHIPPING_SEA = "sea"
    SHIPPING_CHOICES = [
        (SHIPPING_AIR, "Air"),
        (SHIPPING_SEA, "Sea"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    order_type = models.CharField(
        max_length=20,
        choices=TYPE_CHOICES,
        default=TYPE_ORDER,
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_PENDING,
    )
    shipping_mode = models.CharField(
        max_length=10,
        choices=SHIPPING_CHOICES,
        blank=True,
        default="",
    )
    supplier_response = models.TextField(blank=True)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    order_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.name} - {self.product.name} ({self.order_type})"
