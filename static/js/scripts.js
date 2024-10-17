document.addEventListener("DOMContentLoaded", function() 
{
    fetchStats();
    document.getElementById("scan-button").addEventListener("click", function()
    {
        scanDevice();
    });

    setInterval(fetchStats, 1000); 
});

const cpuChartCtx = document.getElementById('cpuChart').getContext('2d');
const gpuChartCtx = document.getElementById('gpuChart').getContext('2d');
const ramChartCtx = document.getElementById('ramChart').getContext('2d');
const networkChartCtx = document.getElementById('networkChart').getContext('2d');
const diskChartCtx = document.getElementById('diskChart').getContext('2d');

let cpuChart, gpuChart, ramChart, networkChart, diskChart;

const updateCharts = (data) => 
    {
    if (!cpuChart) 
        {
        cpuChart = new Chart(cpuChartCtx, 
            {
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
            options: 
            {
                scales: 
                {
                    y: {
                        beginAtZero: true,
                        max: 100,
                    },
                },
            },
        });
    } else {
        cpuChart.data.datasets[0].data.push(data.cpu_usage);
        cpuChart.data.datasets[1].data = data.cpu_cores; 
        cpuChart.update();
    }

    if (!gpuChart) 
        {
        gpuChart = new Chart(gpuChartCtx, 
            {
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
            options: 
            {
                scales: 
                {
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

    if (!ramChart) 
        {
        ramChart = new Chart(ramChartCtx, 
            {
            type: 'line',
            data: 
            {
                labels: Array.from({ length: 10 }, (_, i) => i + 1),
                datasets: [{
                    label: 'RAM Usage (%)',
                    data: [data.ram_usage],
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1,
                    fill: false,
                }],
            },
            options: 
            {
                scales: 
                {
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

    if (!networkChart) 
        {
        networkChart = new Chart(networkChartCtx, 
            {
            type: 'line',
            data: 
            {
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
            options: 
            {
                scales: 
                {
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

    if (!diskChart) 
        {
        diskChart = new Chart(diskChartCtx, 
            {
            type: 'line',
            data: 
            {
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
            options: 
            {
                scales: 
                {
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

const fetchStats = async () => 
    {
    try 
    {
        const response = await fetch('/stats');
        if (!response.ok) 
            {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        document.getElementById('cpuUsage').textContent = data.cpu_usage;
        document.getElementById('gpuUsage').textContent = data.gpu_usage;
        document.getElementById('ramUsage').textContent = data.ram_usage;
        document.getElementById('networkSent').textContent = data.network_sent;
        document.getElementById('networkRecv').textContent = data.network_recv;
        document.getElementById('diskRead').textContent = data.disk_io_read;
        document.getElementById('diskWrite').textContent = data.disk_io_write;
        document.getElementById('logicalProcessors').textContent = data.cpu_info.logical_processors;  
        document.getElementById('physicalSockets').textContent = data.cpu_info.physical_sockets;      
        document.getElementById("cpuCore0Usage").textContent = data.cpu_core_0_usage; 

        updateCharts(data);
    } catch (error) {
        console.error('Error fetching stats:', error);
    }
};

function toggleSidebar() 
{
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open'); 
}

function showPopup(message, isError = false) 
{
    const backdrop = document.createElement('div');
    backdrop.className = 'popup-backdrop';
    document.body.appendChild(backdrop);

    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.textContent = message;
    if (isError) {
        popup.style.color = 'red'; 
    } else {
        popup.style.color = 'green'; 
    }
    document.body.appendChild(popup);

    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.zIndex = '1002';
    popup.style.padding = '30px'; 
    popup.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    popup.style.border = '1px solid black';
    popup.style.borderRadius = '10px'; 
    popup.style.fontSize = '18px'; 

    setTimeout(() => {
        document.body.removeChild(popup);
        document.body.removeChild(backdrop);
    }, 3000); 
}

function scanDevice() 
{
    const progressBarContainer = document.createElement('div');
    const progressBar = document.createElement('div');
    
    progressBarContainer.style.position = 'fixed';
    progressBarContainer.style.top = '50%';
    progressBarContainer.style.left = '50%';
    progressBarContainer.style.transform = 'translate(-50%, -50%)';
    progressBarContainer.style.width = '300px'; 
    progressBarContainer.style.height = '30px';
    progressBarContainer.style.backgroundColor = '#ddd'; 
    progressBarContainer.style.borderRadius = '10px'; 

    progressBar.style.height = '100%';
    progressBar.style.width = '0%'; 
    progressBar.style.backgroundColor = 'green'; 
    progressBar.style.borderRadius = '10px'; 


    progressBarContainer.appendChild(progressBar);
    document.body.appendChild(progressBarContainer);

    let progress = 0;
    const interval = setInterval(() => 
        {
        if (progress >= 100) 
            {
            clearInterval(interval);
            document.body.removeChild(progressBarContainer); 
            showPopup('Scan is complete.'); 

            setTimeout(() => {
                fetch('/scan')
                    .then(response => response.json())
                    .then(data => {
                        let finalMessage = '';
                        if (data.cryptojacking_detected) {
                            finalMessage += 'Cryptojacking detected!\n';
                        } 
                        if (data.alerts.length > 0) {
                            finalMessage += data.alerts.join('\n'); 
                        } else {
                            finalMessage += 'No high resource usage detected.';
                        }
                        showPopup(finalMessage, finalMessage.includes('detected'));
                    })
                    .catch(error => {
                        console.error('Error scanning device:', error);
                        showPopup('Error scanning device.', true);
                    });
            }, 1000); 
        } else {
            progress += 2; 
            progressBar.style.width = `${progress}%`; 
        }
    }, 100); 
}

function showAlert(alerts, runningApps) 
{
    const alertMessage = alerts.join('\n');
    let appList = runningApps.map(app => `${app.name}: CPU: ${app.cpu_percent}%, RAM: ${app.ram_usage_gb.toFixed(2)} GB`).join('\n');

    alert(`Alerts:\n${alertMessage}\n\nApplications causing high usage:\n${appList}`);
}

function checkForCryptojacking() 
{
    fetch('/scan') 
        .then(response => response.json())
        .then(data => {
            if (data.cryptojacking_detected) 
                {
                const alerts = data.alerts.join('\n'); 
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

document.getElementById("scan-button").addEventListener("click", startScan);