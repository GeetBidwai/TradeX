from .models import User


def get_marketplace_profile(auth_user):
    if not getattr(auth_user, "is_authenticated", False):
        return None

    email = getattr(auth_user, "email", "")
    if not email:
        return None

    return User.objects.filter(email__iexact=email).first()
