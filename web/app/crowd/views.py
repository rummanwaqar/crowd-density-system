from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets

from crowd.models import WirelessClient, BaseStation, ClientConnection
from crowd.serializers import WirelessClientSerializer, BaseStationSerializer, ClientConnectionSerializer


class WirelessClientViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows wireless clients to be viewed or edited.
    """
    queryset = WirelessClient.objects.all()
    serializer_class = WirelessClientSerializer


class BaseStationViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows base stations to be viewed or edited.
    """
    queryset = BaseStation.objects.all()
    serializer_class = BaseStationSerializer


class ClientConnectionViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows client connections to be viewed or edited.
    """
    queryset = ClientConnection.objects.all()
    serializer_class = ClientConnectionSerializer
