import torch
import time
import multiprocessing
import signal
import sys

# Global variable to control running state
running = True

def signal_handler(sig, frame):
    """Handle signal to terminate the simulation."""
    global running
    running = False
    print("Received interrupt signal. Terminating...")

def matrix_multiply(a, b):
    """Perform matrix multiplication to keep GPU busy."""
    while running:
        c = torch.matmul(a, b)
        c.sum()  # Ensure the operation is executed

def simulate_high_gpu_usage(duration=60, matrix_size=3000, operations=20):
    """Simulate high GPU usage with multiple concurrent operations."""
    # Create large tensors in the GPU
    a = torch.randn((matrix_size, matrix_size), device='cuda')
    b = torch.randn((matrix_size, matrix_size), device='cuda')

    # Create and start multiple processes to increase GPU usage
    processes = []
    for _ in range(operations):
        process = multiprocessing.Process(target=matrix_multiply, args=(a, b))
        process.start()
        processes.append(process)

    # Allow the simulation to run for the specified duration
    time.sleep(duration)
    global running
    running = False  # Set running to False to stop all processes

    # Wait for all processes to complete
    for process in processes:
        process.join()

    print(f"Simulation complete for {duration} seconds.")

def short_gpu_simulation():
    """Start short GPU simulation for high utilization."""
    duration = 30  # Duration for the simulation
    operations = 20  # Increase the number of concurrent operations
    print(f"Starting short GPU simulation for {duration} seconds with {operations} operations...")
    simulate_high_gpu_usage(duration, operations=operations)

if __name__ == "__main__":
    # Register the signal handler for graceful termination
    signal.signal(signal.SIGINT, signal_handler)
    short_gpu_simulation()
