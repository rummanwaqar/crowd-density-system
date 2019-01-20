import shlex
import subprocess
import sys

import _thread as thread, queue, time

class TSharkInterface:
    CMD = 'tshark -l -I -i en0 -Y "wlan.fc.type_subtype==0x04" -Tfields -e frame.time_epoch -e wlan.sa -e wlan_radio.channel -e wlan_radio.signal_dbm'
    def __init__(self, data_cb):
        thread.start_new_thread(TSharkInterface.run_cmd, (self.CMD, self.__tshark_callback, True))
        self.dataQueue = queue.Queue()
        self.data_cb = data_cb

    def run(self, wait_time=10):
        time.sleep(wait_time)
        dataList = []
        get_size = self.dataQueue.qsize()
        try:
            for i in range(get_size):
                data = self.dataQueue.get_nowait()
                if data:
                    seen = False
                    for item in dataList:
                        # if seen data before
                        if item['address'] == data['address'] and item['channel'] == data['channel']:
                            item['power'] = (item['power'] + data['power'])/2.0
                            seen = True
                            break
                    if not seen:
                        dataList.append(data)
            self.data_cb(dataList)
        except queue.Empty:
            with safeprint:
                print('Tried to read an empty queue')

    def __tshark_callback(self, raw_data):
        data = TSharkInterface.parse_tshark(raw_data)
        if data:
            self.dataQueue.put(data)

    @staticmethod
    def parse_tshark(raw_data):
        data = raw_data.decode('utf-8').strip().split('\t')
        if len(data) == 4:
            return {
                'timestamp': float(data[0]),
                'address': data[1],
                'channel': int(data[2]),
                'power': float(data[3])
            }
        else:
            return {}

    '''
    source: https://gist.github.com/dhrrgn/6073120
    '''
    @staticmethod
    def run_cmd(cmd, callback=None, watch=False):
        """Runs the given command and gathers the output.
        If a callback is provided, then the output is sent to it, otherwise it
        is just returned.
        Optionally, the output of the command can be "watched" and whenever new
        output is detected, it will be sent to the given `callback`.
        Args:
            cmd (str): The command to run.
        Kwargs:
            callback (func):  The callback to send the output to.
            watch (bool):     Whether to watch the output of the command.  If True,
                              then `callback` is required.
        Returns:
            A string containing the output of the command, or None if a `callback`
            was given.
        Raises:
            RuntimeError: When `watch` is True, but no callback is given.
        """
        if watch and not callback:
            raise RuntimeError('You must provide a callback when watching a process.')

        output = None
        try:
            proc = subprocess.Popen(shlex.split(cmd), stdout=subprocess.PIPE)

            if watch:
                while proc.poll() is None:
                    line = proc.stdout.readline()
                    if line != "":
                        callback(line)

                # Sometimes the process exits before we have all of the output, so
                # we need to gather the remainder of the output.
                remainder = proc.communicate()[0]
                if remainder:
                    callback(remainder)
            else:
                output = proc.communicate()[0]
        except:
            err = str(sys.exc_info()[1]) + "\n"
            output = err

        if callback and output is not None:
            callback(output)
            return None

        return output
