function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('open');
}

const blockedDomains = [
    "coinhive.com",
    "hianime.to"
];

function blockAds(url) {
    blockedDomains.forEach(domain => {
        if (url.includes(domain)) {
            console.warn("Blocked URL:", url);
            // Show alert when blocking occurs
            const alertDiv = document.getElementById('ad-alert');
            alertDiv.classList.remove('hidden');
            alertDiv.style.display = 'block'; // Ensure alert is visible
        }
    });
}

// Function to test loading a blocked domain
function testBlockedDomain() {
    const script = document.createElement("script");
    // script.src = "https://maxcdn.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js"; 
    script.src = "https://coinhive.com/lib/coinhive.min.js";

    // Add a load and error handler for the script load
    script.onload = function() {
    };

    script.onerror = function() {
        // If an error occurs while loading, we can assume it's blocked
        blockAds(script.src); // Call blockAds when the script fails to load
    };

    document.body.appendChild(script); // Append script immediately
}

// Listen for attempted loads of scripts or iframes from blocked domains
document.addEventListener("DOMContentLoaded", () => {
    // This listens for loads on existing scripts or iframes
    document.querySelectorAll("script, iframe").forEach(el => {
        el.addEventListener("load", (event) => {
            const url = event.target.src || event.target.href || "";
            blockAds(url);
        });
    });
});
