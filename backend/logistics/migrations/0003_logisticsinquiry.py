# Generated manually for logistics inquiry flow

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0002_alter_user_role"),
        ("logistics", "0002_logistics_shipping_mode_logistics_tracking_stage_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="LogisticsInquiry",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=100)),
                ("email", models.EmailField(max_length=254)),
                (
                    "service_type",
                    models.CharField(
                        choices=[
                            ("sea", "Sea Freight"),
                            ("air", "Air Freight"),
                            ("warehouse", "Warehousing"),
                        ],
                        max_length=20,
                    ),
                ),
                ("cargo_type", models.CharField(max_length=100)),
                ("origin", models.CharField(max_length=100)),
                ("destination", models.CharField(max_length=100)),
                ("quantity", models.CharField(max_length=100)),
                ("notes", models.TextField(blank=True)),
                ("telegram_username", models.CharField(blank=True, max_length=100)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "buyer",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="logistics_inquiries",
                        to="users.user",
                    ),
                ),
            ],
        ),
    ]
