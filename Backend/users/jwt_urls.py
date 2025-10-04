# users/jwt_urls.py
from django.urls import path
from .views_jwt import CookieTokenObtainPairView, CookieTokenRefreshView, CookieLogoutView

urlpatterns = [
    path('create/',  CookieTokenObtainPairView.as_view(),  name='jwt-create'),
    path('refresh/', CookieTokenRefreshView.as_view(),     name='jwt-refresh'),
    path('logout/',  CookieLogoutView.as_view(),           name='jwt-logout'),
]
