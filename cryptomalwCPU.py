import multiprocessing
import time

def cpu_intensive_task():
    while True:
        pass  

if __name__ == "__main__":
    num_cores = multiprocessing.cpu_count()  
    processes = []

    for i in range(num_cores):
        process = multiprocessing.Process(target=cpu_intensive_task)
        process.start()
        processes.append(process)

    time.sleep(30)

    for process in processes:
        process.terminate()
