function toggleSidebar() 
{
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open'); 
}


const updateRunningApps = (runningApps) => 
    {
    const runningAppsList = document.getElementById('running-apps-list');

    runningAppsList.innerHTML = '';

    if (runningApps.length === 0) {
        runningAppsList.innerHTML = '<li>No applications running</li>';
        return;
    }

    runningApps.forEach(app => {
        const listItem = document.createElement('li');
        listItem.textContent = `${app.name} - CPU: ${app.cpu_percent}% | RAM: ${app.ram_usage_gb.toFixed(2)} 
                                                GB | Network: ${app.network_sent_mb.toFixed(2)} 
                                                MB sent, ${app.network_recv_mb.toFixed(2)} 
                                                MB received`; 
        runningAppsList.appendChild(listItem); 
    });
};

const fetchStats = async () => 
    {
    try {
        const response = await fetch('/stats');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        updateRunningApps(data.running_apps); 

    } catch (error) {
        console.error('Error fetching stats:', error);
    }
};

setInterval(fetchStats, 1000);
