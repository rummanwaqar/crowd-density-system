from django.db import models

# Create your models here.
from django.db.models import CASCADE


class WirelessClient(models.Model):
    mac_address = models.CharField(max_length=50)
    human_name = models.CharField(null=True, max_length=50)


# TODO: add positional field:
class BaseStation(models.Model):
    token = models.CharField(max_length=50)
    human_name = models.CharField(max_length=50)


class ClientConnection(models.Model):
    station = models.ForeignKey(BaseStation, on_delete=CASCADE, related_name="clients")
    client = models.ForeignKey(WirelessClient, on_delete=CASCADE, related_name="connections")
    time = models.PositiveIntegerField()
    gain = models.FloatField(null=True)
    channel = models.PositiveSmallIntegerField(null=True)
