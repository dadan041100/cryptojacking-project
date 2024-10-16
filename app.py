from flask import Flask, render_template, jsonify
import psutil
import GPUtil
import time
import threading

app = Flask(__name__)

previous_network_stats = {'sent': 0, 'recv': 0, 'timestamp': time.time()}
previous_disk_io = psutil.disk_io_counters()
system_stats = {}

THRESHOLD_CPU = 80
THRESHOLD_GPU = 70
THRESHOLD_RAM = 80
THRESHOLD_NETWORK_SENT = 500000  # bytes
THRESHOLD_NETWORK_RECV = 500000  # bytes
THRESHOLD_DISK_IO_READ = 1048576  # 1 MB in bytes
THRESHOLD_DISK_IO_WRITE = 1048576  # 1 MB in bytes

def bytes_to_mbps(bytes_value):
    if bytes_value >= 1024 * 1024:
        return round((bytes_value * 8) / (1024 * 1024))
    else:
        return round((bytes_value * 8) / 1024)

def monitor_system_stats():
    global previous_network_stats, previous_disk_io, system_stats
    while True:
        overall_cpu_usage = psutil.cpu_percent(interval=1)
        gpus = GPUtil.getGPUs()
        gpu_usage = gpus[0].load * 100 if gpus else 0

        ram_usage = psutil.virtual_memory().percent
        running_apps = get_running_apps_cpu_and_network()

        current_network_stats = psutil.net_io_counters()
        network_sent = current_network_stats.bytes_sent
        network_recv = current_network_stats.bytes_recv

        current_disk_io = psutil.disk_io_counters()
        disk_io_read_diff = current_disk_io.read_bytes - previous_disk_io.read_bytes
        disk_io_write_diff = current_disk_io.write_bytes - previous_disk_io.write_bytes

        previous_disk_io = current_disk_io

        current_time = time.time()
        time_interval = current_time - previous_network_stats['timestamp']

        if time_interval > 0:
            sent_diff = network_sent - previous_network_stats['sent']
            recv_diff = network_recv - previous_network_stats['recv']

            previous_network_stats['sent'] = network_sent
            previous_network_stats['recv'] = network_recv
            previous_network_stats['timestamp'] = current_time

            current_network_sent = bytes_to_mbps(sent_diff / time_interval)
            current_network_recv = bytes_to_mbps(recv_diff / time_interval)
        else:
            sent_diff = 0
            recv_diff = 0
            current_network_sent = 0
            current_network_recv = 0

        alerts = []
        running_apps = get_running_apps_cpu_and_network()

        # Check for alerts based on thresholds
        if overall_cpu_usage > THRESHOLD_CPU:
            alerts.append("High CPU usage detected!")
        if gpu_usage > THRESHOLD_GPU:
            alerts.append("High GPU usage detected!")
        if ram_usage > THRESHOLD_RAM:
            alerts.append("High RAM usage detected!")
        if sent_diff > THRESHOLD_NETWORK_SENT or recv_diff > THRESHOLD_NETWORK_RECV:
            alerts.append("High network usage detected!")
        if disk_io_read_diff > THRESHOLD_DISK_IO_READ:
            alerts.append("High disk read detected!")
        if disk_io_write_diff > THRESHOLD_DISK_IO_WRITE:
            alerts.append("High disk write detected!")

        core_usages = get_cpu_cores_usage()

        # Add CPU info to system_stats
        cpu_info = get_cpu_info()  # Make sure to get CPU info here

        system_stats = {
            'cpu_usage': overall_cpu_usage,
            'gpu_usage': gpu_usage,
            'ram_usage': ram_usage,
            'network_sent': current_network_sent,
            'network_recv': current_network_recv,
            'disk_io_read': disk_io_read_diff,
            'disk_io_write': disk_io_write_diff,
            'alerts': alerts,
            'running_apps': running_apps,
            'cpu_cores': core_usages,
            'cpu_info': cpu_info,  # Add CPU info to stats
            'running_apps': running_apps
        }


def get_cpu_cores_usage():
    return psutil.cpu_percent(percpu=True)

def get_cpu_info():
    logical_processors = psutil.cpu_count(logical=True)
    physical_sockets = psutil.cpu_count(logical=False)
    return {
        'logical_processors': logical_processors,
        'physical_sockets': physical_sockets
    }


def get_app_ram_usage(pid):
    try:
        process = psutil.Process(pid)
        ram_usage = process.memory_info().rss / (1024 * 1024 * 1024)  # Convert bytes to GB
        return ram_usage
    except (psutil.NoSuchProcess, psutil.AccessDenied):
        return 0

def get_running_apps_cpu_and_network():
    apps = []
    for proc in psutil.process_iter(['pid', 'name', 'cpu_percent']):
        try:
            proc_info = proc.as_dict(attrs=['pid', 'name', 'cpu_percent'])
            ram_usage = get_app_ram_usage(proc_info['pid'])  # Add RAM usage to process info

            # Get network usage (sent and received bytes)
            net_io = proc.io_counters() if proc.io_counters() else (0, 0)
            proc_info['bytes_sent'] = net_io[0]  # bytes sent
            proc_info['bytes_recv'] = net_io[1]  # bytes received

            proc_info['ram_usage_gb'] = ram_usage  # Add RAM usage to process info
            apps.append(proc_info)
        except (psutil.NoSuchProcess, psutil.AccessDenied, AttributeError):
            continue

    formatted_apps = [
        {
            "name": app['name'],
            "cpu_percent": app['cpu_percent'],
            "network_sent_mb": app['bytes_sent'] / (1024 * 1024),  # Convert bytes to MB
            "network_recv_mb": app['bytes_recv'] / (1024 * 1024),  # Convert bytes to MB
            "ram_usage_gb": app['ram_usage_gb']  # Include RAM usage in the output
        }
        for app in apps
    ]
    return formatted_apps

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/running_apps')
def running_apps():
    running_apps = get_running_apps_cpu_and_network()
    return jsonify(running_apps)


@app.route('/current-applications')
def current_applications():
    return render_template('current_applications.html')


@app.route('/stats')
def get_stats():
    global system_stats  # Access the global system_stats variable
    return jsonify(system_stats)  # Return the current stats as JSON

@app.route('/scan')
def scan_device():
    # Implement scanning logic here
    overall_cpu_usage = psutil.cpu_percent(interval=1)
    gpus = GPUtil.getGPUs()
    gpu_usage = gpus[0].load * 100 if gpus else 0
    ram_usage = psutil.virtual_memory().percent

    alerts = []
    if overall_cpu_usage > THRESHOLD_CPU:
        alerts.append("High CPU usage detected!")
    if gpu_usage > THRESHOLD_GPU:
        alerts.append("High GPU usage detected!")
    if ram_usage > THRESHOLD_RAM:
        alerts.append("High RAM usage detected!")

    # Return the scan results
    return jsonify({
        'cryptojacking_detected': bool(alerts),
        'alerts': alerts
    })

if __name__ == '__main__':
    threading.Thread(target=monitor_system_stats, daemon=True).start()
    app.run(debug=True)
