"""DjangoBase URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls import url
from rest_framework import routers

from crowd import views
from crowd.admin import admin_site
from django.urls import path, include

api_router = routers.DefaultRouter()
api_router.register(r'clients', views.WirelessClientViewSet)
api_router.register(r'stations', views.BaseStationViewSet)
api_router.register(r'connections', views.ClientConnectionViewSet)

urlpatterns = [
    path('', include(api_router.urls)),
    url(r'^api-auth/', include('rest_framework.urls')),
    path('admin/', admin_site.urls),
    url(r'ingest', views.ingest),
    url(r'data/active-clients', views.get_active_clients)
]
