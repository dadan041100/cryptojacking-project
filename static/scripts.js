document.addEventListener("DOMContentLoaded", function() {
    fetchStats();

    // Add event listener to the scan button
    document.getElementById("scan-button").addEventListener("click", function() {
        scanDevice();
    });

    setInterval(fetchStats, 1000); // Fetch stats every second
});

const cpuChartCtx = document.getElementById('cpuChart').getContext('2d');
const gpuChartCtx = document.getElementById('gpuChart').getContext('2d');
const ramChartCtx = document.getElementById('ramChart').getContext('2d');
const networkChartCtx = document.getElementById('networkChart').getContext('2d');
const diskChartCtx = document.getElementById('diskChart').getContext('2d');

let cpuChart, gpuChart, ramChart, networkChart, diskChart;

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

        updateCharts(data);
    } catch (error) {
        console.error('Error fetching stats:', error);
    }
};

// Function to toggle sidebar visibility
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open'); // Toggle the 'open' class to show/hide the sidebar
}

// Function to display a pop-up message with a backdrop
function showPopup(message, isError = false) {
    // Create backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'popup-backdrop';
    document.body.appendChild(backdrop);

    // Create pop-up message
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.textContent = message;
    if (isError) {
        popup.style.color = 'red'; // Red color for error messages
    } else {
        popup.style.color = 'green'; // Green color for success messages
    }
    document.body.appendChild(popup);

    // Center the pop-up
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.zIndex = '1002';
    popup.style.padding = '30px'; // Increased padding
    popup.style.backgroundColor = 'white';
    popup.style.border = '1px solid black';
    popup.style.borderRadius = '10px'; // Rounded corners
    popup.style.fontSize = '18px'; // Larger font size

    // Remove the pop-up and backdrop after 5 seconds
    setTimeout(() => {
        document.body.removeChild(popup);
        document.body.removeChild(backdrop);
    }, 5000); // Show for 5 seconds
}

// Scan the device for cryptojacking
function scanDevice() {
    fetch('/scan')
        .then(response => response.json())
        .then(data => {
            if (data.cryptojacking_detected) {
                const alerts = data.alerts.join('\n'); // Join alerts into a single string
                showPopup(`Cryptojacking detected!${alerts ? '\n' + alerts : ''}`, true);
            } else {
                showPopup('No cryptojacking detected.');
            }
        })
        .catch(error => {
            console.error('Error scanning device:', error);
            showPopup('Error scanning device.', true);
        });
}
