import json
import time

from django.db.models import Min, Max, F
from django.http import JsonResponse, HttpResponse
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


def ingest(request):
    if request.method != "POST":
        print("Use a post request pls")
        return HttpResponse("Use a post request pls", status=400)

    try:
        req = json.loads(request.body.decode('utf-8'))
    except Exception:
        print("Could not parse json dict :'(((")
        print("Body was: " + str(request.body))
        return HttpResponse("Could not parse json dict :'(((", status=400)

    if "station" not in req:
        print("Send a 'station' param within the json dict")
        return HttpResponse("Send a 'station' param within the json dict", status=400)

    if "data" not in req:
        print("Send a 'data' param within the json dict")
        return HttpResponse("Send a 'data' param within the json dict", status=400)

    station = BaseStation.objects.filter(token=str(req['station']))

    if station.count() == 0:
        print("A station with this token does not yet exist. "
              "Maybe register one first in the admin panel?")
        return HttpResponse("A station with this token does not yet exist. "
                            "Maybe register one first in the admin panel?", status=400)

    station = station.first()

    for connection_dict in req['data']:
        connection = ClientConnection.objects.get_or_create(
            station=station,
            client=WirelessClient.objects.get_or_create(mac_address=connection_dict['address'])[0],
            channel=connection_dict['channel'],
            time=connection_dict['timestamp']
        )[0]

        connection.gain = connection_dict['power']
        connection.save()

    return JsonResponse({'success': True})


def get_active_clients(request):
    start_time = int(ClientConnection.objects.order_by("time").first().time)-1
    # TODO: figure out if rumman is sending current UTC epoch or not
    end_time = int(time.time())

    if request.GET.get('start_time'):
        start_time = int(request.GET.get('start_time'))

    if request.GET.get('end_time'):
        end_time = int(request.GET.get('end_time'))

    valid_clients = WirelessClient.objects.all()\
                                  .annotate(first_connection=Min("connections__time"),
                                            last_connection=Max("connections__time"))\
                                  .annotate(duration=F("last_connection") - F("first_connection"))\
                                  .order_by('-duration')\
                                  .filter(duration__gt=0)

    COUNT_INTERVAL = 60

    if request.GET.get('interval'):
        COUNT_INTERVAL = int(request.GET.get('interval'))

    count_over_time = list()
    current_processing_time = start_time

    while current_processing_time < end_time:
        current_time_dict = dict()
        current_time_dict['start_time'] = current_processing_time

        connections_in_interval = ClientConnection.objects.filter(time__gte=current_processing_time,
                                                                  time__lte=current_processing_time+COUNT_INTERVAL)

        # optional gain filter:
        if request.GET.get('gain'):
            connections_in_interval = connections_in_interval.filter(gain__gte=request.GET.get('gain'))

        # Optional station filter:
        if request.GET.get('station'):
            connections_in_interval = connections_in_interval.filter(station__token=request.GET.get('station'))

        clients_in_interval = valid_clients.filter(connections__in=connections_in_interval)
        current_time_dict['count'] = int(clients_in_interval.count())
        # current_time_dict['clients'] = list(clients_in_interval.values_list('id', flat=True))
        count_over_time.append(current_time_dict)

        # TODO Get new clients since last interval & clients that disappeared since last interval

        current_processing_time = current_processing_time + COUNT_INTERVAL

    return JsonResponse(count_over_time, safe=False, json_dumps_params={'indent': 2})
