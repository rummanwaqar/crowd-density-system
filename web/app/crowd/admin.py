from django.contrib import admin

# Register your models here.
from django.contrib.admin import AdminSite

from crowd.models import WirelessClient, BaseStation, ClientConnection

admin.site.site_title = "Crowd Density Service"
admin.site.site_header = "Crowd Density Admin" 


admin.site.register(WirelessClient)
admin.site.register(BaseStation)
admin.site.register(ClientConnection)

