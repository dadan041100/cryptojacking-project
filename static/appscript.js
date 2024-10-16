function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open'); // Toggle the 'open' class to show/hide the sidebar
}


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

const fetchStats = async () => {
    try {
        const response = await fetch('/stats');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        updateRunningApps(data.running_apps); // New line to update running apps

    } catch (error) {
        console.error('Error fetching stats:', error);
    }
};

setInterval(fetchStats, 1000);
