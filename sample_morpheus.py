import torch
import time
import multiprocessing
import signal
import sys


running = True

def signal_handler(sig, frame):
    """Handle signal to terminate the simulation."""
    global running
    running = False
    print("Received interrupt signal. Terminating...")

def matrix_multiply(a, b):
    """Perform matrix multiplication to keep the components busy."""
    while running:
        c = torch.matmul(a, b)
        c.sum()  
        time.sleep(0.1)  

def simulate_high_comp_usage(duration=60, matrix_size=3000, operations=20):
    """Simulate high GPU usage with multiple concurrent operations."""
    a = torch.randn((matrix_size, matrix_size), device='cuda')
    b = torch.randn((matrix_size, matrix_size), device='cuda')

    processes = []
    for _ in range(operations):
        process = multiprocessing.Process(target=matrix_multiply, args=(a, b))
        process.start()
        processes.append(process)

    start_time = time.time()
    try:
        while running and (time.time() - start_time) < duration:
            time.sleep(1)  

    finally:
        # Stop all processes
        print("Terminating all processes...")
        for process in processes:
            process.terminate()  
            process.join()

    print(f"Simulation complete or terminated early after {time.time() - start_time} seconds.")

def short_comp_simulation():
    """Start short GPU simulation for high utilization."""
    duration = 30  
    operations = 20  
    print(f"Starting short CPU, GPU, and RAM simulation for {duration} seconds with {operations} operations...")
    simulate_high_comp_usage(duration, operations=operations)

if __name__ == "__main__":
    signal.signal(signal.SIGINT, signal_handler)
    short_comp_simulation()
