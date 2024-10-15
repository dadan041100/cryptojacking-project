// Initialize variables for chart data
let cpuUsageData = [];
let gpuUsageData = [];
let ramUsageData = [];
let networkSentData = [];  
let networkRecvData = [];  
let timeLabels = [];
let cpuCoresData = []; // New variable for CPU cores data

// Set up the charts
const ctxCPU = document.getElementById('cpuChart').getContext('2d');
const ctxGPU = document.getElementById('gpuChart').getContext('2d');
const ctxRAM = document.getElementById('ramChart').getContext('2d');
const ctxNetwork = document.getElementById('networkChart').getContext('2d');

const cpuChart = new Chart(ctxCPU, {
    type: 'line',
    data: {
        labels: timeLabels,
        datasets: [{
            label: 'CPU Usage %',
            data: cpuUsageData,
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: false,
        }]
    },
    options: {
        scales: {
            y: { beginAtZero: true }
        }
    }
});

const gpuChart = new Chart(ctxGPU, {
    type: 'line',
    data: {
        labels: timeLabels,
        datasets: [{
            label: 'GPU Usage %',
            data: gpuUsageData,
            borderColor: 'rgba(255, 99, 132, 1)',
            fill: false,
        }]
    },
    options: {
        scales: {
            y: { beginAtZero: true }
        }
    }
});

const ramChart = new Chart(ctxRAM, {
    type: 'line',
    data: {
        labels: timeLabels,
        datasets: [{
            label: 'RAM Usage %',
            data: ramUsageData,
            borderColor: 'rgba(54, 162, 235, 1)',
            fill: false,
        }]
    },
    options: {
        scales: {
            y: { beginAtZero: true }
        }
    }
});

const networkChart = new Chart(ctxNetwork, {
    type: 'line',
    data: {
        labels: timeLabels,
        datasets: [{
            label: 'Network Sent (kbps)',
            data: networkSentData,
            borderColor: 'rgba(255, 206, 86, 1)',
            fill: false,
        }, {
            label: 'Network Received (kbps)',
            data: networkRecvData,
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: false,
        }]
    },
    options: {
        scales: {
            y: { beginAtZero: true }
        }
    }
});

// Function to fetch system stats and update the UI
function fetchStats() {
    fetch('/stats')
        .then(response => response.json())
        .then(data => {
            // Update the UI with the latest data
            document.getElementById('cpuUsage').textContent = data.cpu_usage;
            document.getElementById('gpuUsage').textContent = data.gpu_usage;
            document.getElementById('ramUsage').textContent = data.ram_usage;
            document.getElementById('networkSent').textContent = data.network_sent;
            document.getElementById('networkRecv').textContent = data.network_recv;
            document.getElementById('logicalProcessors').textContent = data.cpu_info.logical_processors;
            document.getElementById('physicalSockets').textContent = data.cpu_info.physical_sockets;

            // Update alerts
            const alertsElement = document.getElementById('alerts');
            alertsElement.innerHTML = ''; // Clear previous alerts
            if (data.alerts.length === 0) {
                alertsElement.innerHTML = '<li>No alerts at this time</li>';
            } else {
                data.alerts.forEach(alert => {
                    const li = document.createElement('li');
                    li.textContent = alert;
                    alertsElement.appendChild(li);
                });
            }

            // Update running applications
            const runningAppsElement = document.getElementById('runningApps');
            runningAppsElement.innerHTML = ''; // Clear previous apps
            if (data.running_apps.length === 0) {
                runningAppsElement.innerHTML = '<li>No applications using significant resources</li>';
            } else {
                data.running_apps.forEach(app => {
                    const li = document.createElement('li');
                    li.textContent = `${app.name}: CPU ${app.cpu_percent}%, Network Sent ${app.network_sent_mb.toFixed(2)} MB, Network Received ${app.network_recv_mb.toFixed(2)} MB`;
                    runningAppsElement.appendChild(li);
                });
            }

            // Update CPU cores usage
            const cpuCoresElement = document.getElementById('cpuCores');
            cpuCoresElement.innerHTML = ''; // Clear previous core data
            data.cpu_cores.forEach((coreUsage, index) => {
                const li = document.createElement('li');
                li.textContent = `Core ${index}: ${coreUsage}%`;
                cpuCoresElement.appendChild(li);
            });

            // Update chart data
            updateChartData(data);
        })
        .catch(error => console.error('Error fetching stats:', error));
}

// Update chart data
function updateChartData(data) {
    const currentTime = new Date().toLocaleTimeString();
    timeLabels.push(currentTime);
    cpuUsageData.push(data.cpu_usage);
    gpuUsageData.push(data.gpu_usage);
    ramUsageData.push(data.ram_usage);
    networkSentData.push(data.network_sent);
    networkRecvData.push(data.network_recv);

    // Update charts
    cpuChart.update();
    gpuChart.update();
    ramChart.update();
    networkChart.update();
}

// Fetch stats every second
setInterval(fetchStats, 1000);
