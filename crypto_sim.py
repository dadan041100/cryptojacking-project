import time
import threading

def cpu_miner(intensity=1000000):
    """Simulate cryptojacking by performing CPU-intensive calculations."""
    print("Starting simulated cryptojacking...")
    while True:
        sum([i**2 for i in range(intensity)])  

def start_miner():
    miner_thread = threading.Thread(target=cpu_miner, args=(1000000,))  
    miner_thread.daemon = True  
    miner_thread.start()
    return miner_thread


if __name__ == "__main__":
    try:
        start_miner()
        while True:
            time.sleep(1)  
    except KeyboardInterrupt:
        print("Stopping simulated cryptojacking.")
