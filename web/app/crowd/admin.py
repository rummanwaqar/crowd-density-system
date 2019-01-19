from django.contrib import admin

# Register your models here.
from django.contrib.admin import AdminSite

from crowd.models import WirelessClient, BaseStation, ClientConnection


class CrowdAdminSite(AdminSite):
    site_header = 'Crowd Density Admin'

admin_site = CrowdAdminSite(name='myadmin')
admin_site.register(WirelessClient)
admin_site.register(BaseStation)
admin_site.register(ClientConnection)