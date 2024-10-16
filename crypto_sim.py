import time
import threading

def cpu_miner():
    """Simulate cryptojacking by performing CPU-intensive calculations."""
    print("Starting simulated cryptojacking...")
    while True:
        # Simulate heavy CPU usage by performing calculations
        sum([i**2 for i in range(10000)])  # Adjust the range for more or less intensity

# Run the miner in a separate thread
miner_thread = threading.Thread(target=cpu_miner)
miner_thread.daemon = True  # Daemon thread will exit when the main program exits
miner_thread.start()

# Keep the main program running
try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("Stopping simulated cryptojacking.")
