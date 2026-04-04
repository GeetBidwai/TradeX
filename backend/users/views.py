from django.contrib.auth import get_user_model
from rest_framework import viewsets
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import User
from .serializers import UserSerializer


AuthUser = get_user_model()


class TradeXTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        identifier = attrs.get(self.username_field, "").strip()

        auth_user = (
            AuthUser.objects.filter(email__iexact=identifier).first()
            or AuthUser.objects.filter(username__iexact=identifier).first()
        )

        if auth_user is None:
            profile = User.objects.filter(name__iexact=identifier).first()
            if profile is not None:
                auth_user = AuthUser.objects.filter(email__iexact=profile.email).first()

        if auth_user is None:
            raise AuthenticationFailed("No active account found with the given credentials")

        attrs[self.username_field] = auth_user.get_username()
        return super().validate(attrs)


class TradeXTokenObtainPairView(TokenObtainPairView):
    serializer_class = TradeXTokenObtainPairSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
