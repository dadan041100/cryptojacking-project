from flask import Flask, render_template, jsonify
import psutil
import GPUtil
import time
import threading

app = Flask(__name__)

previous_network_stats = {'sent': 0, 'recv': 0, 'timestamp': time.time()}
system_stats = {}  # To hold the system stats updated by the thread

# Define thresholds
THRESHOLD_CPU = 80
THRESHOLD_GPU = 70
THRESHOLD_RAM = 80
THRESHOLD_NETWORK_SENT = 500000  # bytes
THRESHOLD_NETWORK_RECV = 500000  # bytes

def bytes_to_mbps(bytes_value):
    """Convert bytes to megabits per second (Mbps) or kilobits per second (kbps) as a whole number."""
    if bytes_value >= 1024 * 1024:
        return round((bytes_value * 8) / (1024 * 1024))  # Convert bytes to Mbps
    else:
        return round((bytes_value * 8) / 1024)  # Convert bytes to kbps

def monitor_system_stats():
    global previous_network_stats, system_stats
    while True:
        # Monitor CPU usage over a 1-second interval for better accuracy
        overall_cpu_usage = psutil.cpu_percent(interval=1)
        gpus = GPUtil.getGPUs()
        gpu_usage = gpus[0].load * 100 if gpus else 0

        ram_usage = psutil.virtual_memory().percent

        # Retrieve the current network stats
        current_network_stats = psutil.net_io_counters()
        network_sent = current_network_stats.bytes_sent
        network_recv = current_network_stats.bytes_recv

        # Calculate the differences since the last check
        current_time = time.time()
        time_interval = current_time - previous_network_stats['timestamp']
        
        if time_interval > 0:  # Ensure time_interval is valid
            sent_diff = network_sent - previous_network_stats['sent']
            recv_diff = network_recv - previous_network_stats['recv']

            # Update previous stats
            previous_network_stats['sent'] = network_sent
            previous_network_stats['recv'] = network_recv
            previous_network_stats['timestamp'] = current_time

            # Calculate actual network usage in Mbps or kbps
            current_network_sent = bytes_to_mbps(sent_diff / time_interval)
            current_network_recv = bytes_to_mbps(recv_diff / time_interval)
        else:
            sent_diff = 0
            recv_diff = 0
            current_network_sent = 0
            current_network_recv = 0

        alerts = []
        running_apps = get_running_apps_cpu_and_network()  # Get running apps with CPU and network usage

        # Alerts based on thresholds
        if overall_cpu_usage > THRESHOLD_CPU:
            alerts.append("High CPU usage detected!")
        if gpu_usage > THRESHOLD_GPU:
            alerts.append("High GPU usage detected!")
        if ram_usage > THRESHOLD_RAM:
            alerts.append("High RAM usage detected!")
        if sent_diff > THRESHOLD_NETWORK_SENT or recv_diff > THRESHOLD_NETWORK_RECV:
            alerts.append("High network usage detected!")

        print(f"Overall CPU Usage: {overall_cpu_usage}%")  # Debug log
        print(f"Network Usage: Sent {current_network_sent} kbps, Received {current_network_recv} kbps")  # Debug log

        # Update system stats
        system_stats = {
            'cpu_usage': overall_cpu_usage,
            'gpu_usage': gpu_usage,
            'ram_usage': ram_usage,
            'network_sent': current_network_sent,
            'network_recv': current_network_recv,
            'alerts': alerts,
            'running_apps': running_apps,
            'cpu_cores': get_cpu_cores_usage(),  # Get CPU core usage
            'cpu_info': get_cpu_info()  # Get CPU socket and processor info
        }

def get_cpu_cores_usage():
    """Return a list of CPU usage percentages for each core."""
    return psutil.cpu_percent(percpu=True)

def get_cpu_info():
    """Return the number of CPU sockets and processors."""
    logical_processors = psutil.cpu_count(logical=True)
    physical_sockets = psutil.cpu_count(logical=False)  # Physical CPU count
    return {
        'logical_processors': logical_processors,
        'physical_sockets': physical_sockets
    }

def get_running_apps_cpu_and_network():
    apps = []
    for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'io_counters']):
        try:
            proc_info = proc.as_dict(attrs=['pid', 'name', 'cpu_percent'])
            io_counters = proc.io_counters()  # Get I/O counters for network usage
            if io_counters:
                proc_info['bytes_sent'] = io_counters.bytes_sent
                proc_info['bytes_recv'] = io_counters.bytes_recv

            apps.append(proc_info)
        except (psutil.NoSuchProcess, psutil.AccessDenied, AttributeError):
            continue

    # Format the list to return application name and CPU, network usage
    formatted_apps = [
        {
            "name": app['name'],
            "cpu_percent": app['cpu_percent'],
            "network_sent_mb": app['bytes_sent'] / (1024 * 1024),
            "network_recv_mb": app['bytes_recv'] / (1024 * 1024)
        }
        for app in apps
    ]
    return formatted_apps

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/stats')
def stats():
    return jsonify(system_stats)  # Return the latest stats from the global variable

if __name__ == '__main__':
    # Start the monitoring thread
    threading.Thread(target=monitor_system_stats, daemon=True).start()
    app.run(debug=True)
