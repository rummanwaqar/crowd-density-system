from django.db.models import ExpressionWrapper, F, Min, Max
from rest_framework import serializers, filters

from crowd.models import WirelessClient, BaseStation, ClientConnection


class LongClientFilterBackend(filters.BaseFilterBackend):
    """
    Filter clients that have been seen more than once
    """
    def filter_queryset(self, request, queryset, view):
        return queryset.annotate(first_connection=Min("connections__time"),
                                 last_connection=Max("connections__time"))\
                       .annotate(duration=F("last_connection")-F("first_connection"))\
                       .order_by('-duration')\
                       .filter(duration__gt=0)


class WirelessClientSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = WirelessClient
        fields = ('url', 'mac_address', 'human_name', 'connections')
        filter_backends = (LongClientFilterBackend,)


class BaseStationSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = BaseStation
        fields = ('url', 'human_name', 'clients')


class ClientConnectionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ClientConnection
        fields = ('url', 'client', 'station', 'time', 'gain', 'channel')
