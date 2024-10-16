function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open'); // Toggle the 'open' class to show/hide the sidebar
}


const cpuChartCtx = document.getElementById('cpuChart').getContext('2d');
const gpuChartCtx = document.getElementById('gpuChart').getContext('2d');
const ramChartCtx = document.getElementById('ramChart').getContext('2d');
const networkChartCtx = document.getElementById('networkChart').getContext('2d');
const diskChartCtx = document.getElementById('diskChart').getContext('2d');

let cpuChart, gpuChart, ramChart, networkChart, diskChart;

const updateRunningApps = (runningApps) => {
    // Get the element where the running applications will be displayed
    const runningAppsList = document.getElementById('running-apps-list');

    // Clear the existing list
    runningAppsList.innerHTML = '';

    // Check if any running applications are returned
    if (runningApps.length === 0) {
        runningAppsList.innerHTML = '<li>No applications running</li>';
        return;
    }

    // Create a list item for each running application
    runningApps.forEach(app => {
        const listItem = document.createElement('li');
        listItem.textContent = `${app.name} - CPU: ${app.cpu_percent}% | RAM: ${app.ram_usage_gb.toFixed(2)} GB | Network: ${app.network_sent_mb.toFixed(2)} MB sent, ${app.network_recv_mb.toFixed(2)} MB received`; // Show name, CPU, RAM, and Network usage
        runningAppsList.appendChild(listItem); // Add the list item to the running apps list
    });
};

const updateCharts = (data) => {
    // Update CPU Usage Chart
    if (!cpuChart) {
        cpuChart = new Chart(cpuChartCtx, {
            type: 'line',
            data: {
                labels: Array.from({ length: 10 }, (_, i) => i + 1),
                datasets: [
                    {
                        label: 'Overall CPU Usage (%)',
                        data: [data.cpu_usage],
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                        fill: false,
                    },
                    {
                        label: 'CPU Usage Per Core (%)',
                        data: data.cpu_cores,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        fill: false,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                    },
                },
            },
        });
    } else {
        cpuChart.data.datasets[0].data.push(data.cpu_usage);
        cpuChart.data.datasets[1].data = data.cpu_cores; // Update per core data
        cpuChart.update();
    }

    // Update GPU Usage Chart
    if (!gpuChart) {
        gpuChart = new Chart(gpuChartCtx, {
            type: 'line',
            data: {
                labels: Array.from({ length: 10 }, (_, i) => i + 1),
                datasets: [{
                    label: 'GPU Usage (%)',
                    data: [data.gpu_usage],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false,
                }],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                    },
                },
            },
        });
    } else {
        gpuChart.data.datasets[0].data.push(data.gpu_usage);
        gpuChart.update();
    }

    // Update RAM Usage Chart
    if (!ramChart) {
        ramChart = new Chart(ramChartCtx, {
            type: 'line',
            data: {
                labels: Array.from({ length: 10 }, (_, i) => i + 1),
                datasets: [{
                    label: 'RAM Usage (%)',
                    data: [data.ram_usage],
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1,
                    fill: false,
                }],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                    },
                },
            },
        });
    } else {
        ramChart.data.datasets[0].data.push(data.ram_usage);
        ramChart.update();
    }

    // Update Network Usage Chart
    if (!networkChart) {
        networkChart = new Chart(networkChartCtx, {
            type: 'line',
            data: {
                labels: Array.from({ length: 10 }, (_, i) => i + 1),
                datasets: [
                    {
                        label: 'Network Sent (Mbps)',
                        data: [data.network_sent],
                        borderColor: 'rgba(255, 206, 86, 1)',
                        borderWidth: 1,
                        fill: false,
                    },
                    {
                        label: 'Network Received (Mbps)',
                        data: [data.network_recv],
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        fill: false,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    } else {
        networkChart.data.datasets[0].data.push(data.network_sent);
        networkChart.data.datasets[1].data.push(data.network_recv);
        networkChart.update();
    }

    // Update Disk I/O Chart
    if (!diskChart) {
        diskChart = new Chart(diskChartCtx, {
            type: 'line',
            data: {
                labels: Array.from({ length: 10 }, (_, i) => i + 1),
                datasets: [
                    {
                        label: 'Disk I/O Read (Bytes)',
                        data: [data.disk_io_read],
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                        fill: false,
                    },
                    {
                        label: 'Disk I/O Write (Bytes)',
                        data: [data.disk_io_write],
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        fill: false,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    } else {
        diskChart.data.datasets[0].data.push(data.disk_io_read);
        diskChart.data.datasets[1].data.push(data.disk_io_write);
        diskChart.update();
    }
};

const fetchStats = async () => {
    try {
        const response = await fetch('/stats');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Update HTML elements with new data
        document.getElementById('cpuUsage').textContent = data.cpu_usage;
        document.getElementById('gpuUsage').textContent = data.gpu_usage;
        document.getElementById('ramUsage').textContent = data.ram_usage;
        document.getElementById('networkSent').textContent = data.network_sent;
        document.getElementById('networkRecv').textContent = data.network_recv;
        document.getElementById('diskRead').textContent = data.disk_io_read;
        document.getElementById('diskWrite').textContent = data.disk_io_write;
        document.getElementById('logicalProcessors').textContent = data.cpu_info.logical_processors;  // Updated line
        document.getElementById('physicalSockets').textContent = data.cpu_info.physical_sockets;      // Updated line

        // Update the running applications
        updateRunningApps(data.running_apps); // New line to update running apps
        updateCharts(data);
    } catch (error) {
        console.error('Error fetching stats:', error);
    }
};

// Fetch stats every second
setInterval(fetchStats, 1000);
