function updateStats() {
    fetch('/stats')
        .then(response => response.json())
        .then(data => {
            const coreUsages = data.cpu_cores;
            for (let i = 0; i < coreUsages.length; i++) {
                document.getElementById(`core${i + 1}-usage`).innerText = `${coreUsages[i]}%`;
            }
        })
        .catch(error => console.error('Error fetching stats:', error));
}

// Update stats every second
setInterval(updateStats, 1000);
