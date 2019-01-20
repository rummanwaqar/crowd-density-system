#!/usr/bin/env python

import requests
import json
from tshark_interface import TSharkInterface

def send_data(data, station='rumman_macbook', url="http://192.168.1.200:8000/ingest"):
    headers = {'content-type': 'application/json; charset=utf-8'}
    jsondata = json.dumps({'station': station, 'data': data}).encode('utf-8')
    response = requests.post(url, data=jsondata, headers=headers)
    if response.status_code == 200:
        return True
    return False

def data_cb(dataList):
    if send_data(dataList):
        print('Sent: {} to server'.format(len(dataList)))
    else:
        print('Error sending data to server')

tshark = TSharkInterface(data_cb)

while 1:
    tshark.run(wait_time=10)
