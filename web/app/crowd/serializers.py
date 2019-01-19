from rest_framework import serializers

from crowd.models import WirelessClient, BaseStation, ClientConnection


class WirelessClientSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = WirelessClient
        fields = ('url', 'mac_address', 'human_name')


class BaseStationSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = BaseStation
        fields = ('url', 'human_name')


class ClientConnectionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ClientConnection
        fields = ('url', 'wireless_client', 'base_station', 'time')
