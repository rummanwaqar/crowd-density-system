import json
import os
import time

from django.core import cache
from django.core.cache import caches
from django.db.models import Min, Max, F
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets

from DjangoBase import settings
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

    # Get latest cache:
    cache = caches['default']
    client_history = cache.get('client_history')

    if not client_history:
        cache.set('client_history', dict(), timeout=0)
        client_history = dict()

    while current_processing_time < end_time-COUNT_INTERVAL+1:
        # Check cache:
        if current_processing_time in client_history:
            history_point = client_history[current_processing_time]
            # Check zero:
            zeroflag = True
            for station in history_point['count']:
                if history_point['count'][station] > 0:
                    zeroflag = False

            if not zeroflag:
                count_over_time.append(history_point)

        else:
            current_time_dict = dict()
            current_time_dict['start_time'] = current_processing_time

            connections_in_interval = ClientConnection.objects.filter(time__gte=current_processing_time,
                                                                      time__lte=current_processing_time+COUNT_INTERVAL)
            # optional gain filter:
            if request.GET.get('gain'):
                connections_in_interval = connections_in_interval.filter(gain__gte=request.GET.get('gain'))

            current_time_dict['count'] = dict()

            all_zero_flag = True

            for station in BaseStation.objects.all():
                connections_in_interval_station = connections_in_interval.filter(station=station)
                clients_in_interval = valid_clients.filter(connections__in=connections_in_interval_station)
                current_time_dict['count'][station.token] = int(clients_in_interval.count())

                if clients_in_interval.count() > 0:
                    all_zero_flag = False
            # current_time_dict['clients'] = list(clients_in_interval.values_list('id', flat=True))

            if not all_zero_flag:
                count_over_time.append(current_time_dict)

            # TODO Get new clients since last interval & clients that disappeared since last interval

            client_history[current_processing_time] = current_time_dict

        current_processing_time = current_processing_time + COUNT_INTERVAL

    cache.set('client_history', client_history)

    return JsonResponse(count_over_time, safe=False, json_dumps_params={'indent': 2})


def get_heatmap(request):
    heatmaps = list()
    with open(os.path.join(settings.BASE_DIR, 'triangulation.json'), 'r') as tri_file:
        tri_dict = json.load(tri_file)

        for tri_line in tri_dict:
            heatmap = dict()
            heatmap['time'] = tri_line[0]

            heatmap['points'] = list()
            for tri_point in tri_line[1]:
                heatmap['points'].append({'x': tri_point[0], 'y': tri_point[1]})

            heatmaps.append(heatmap)


    return JsonResponse(heatmaps, safe=False, json_dumps_params={'indent': 2})
