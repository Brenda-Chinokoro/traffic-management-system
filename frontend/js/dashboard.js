// Global variables
let map;
let trafficLayer;
let trafficEnabled = true;
let defaultCenter = { lat: -17.8292, lng: 31.0522 }; // Harare, Zimbabwe
let trafficData = {
    congestionLevel: 35,
    clearRoads: 65,
    moderateTraffic: 25,
    heavyTraffic: 10,
    routes: {
        "Second Street": { status: "heavy", vehicles: 1245, delay: 18, speed: 12, trend: "up" },
        "Samora Machel": { status: "moderate", vehicles: 950, delay: 8, speed: 25, trend: "up" },
        "Rekai Tagwira": { status: "clear", vehicles: 520, delay: 2, speed: 45, trend: "down" },
        "Main Street": { status: "moderate", vehicles: 830, delay: 12, speed: 22, trend: "down" }
    },
    signals: {
        operational: 38,
        flashing: 3,
        inactive: 1
    },
    hourlyData: [],
    alerts: []
};

// Initialize map when the API loads
function initMap() {
    // Try to get user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                defaultCenter = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                createMap();
            },
            error => {
                console.log("Error getting location: ", error);
                createMap();
            }
        );
    } else {
        createMap();
    }
}

// Create the map with traffic layer
function createMap() {
    // Create map instance
    map = new google.maps.Map(document.getElementById("map"), {
        center: defaultCenter,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    
    // Add traffic layer
    trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);
    
    // Add event listener for when the map is idle (loaded and ready)
    google.maps.event.addListenerOnce(map, 'idle', function() {
        // Initial data fetch
        fetchTrafficData();
        
        // Set up real-time data polling (every 2 minutes)
        setInterval(fetchTrafficData, 120000);
        
        // Generate initial hourly data
        generateHourlyData();
        
        // Create chart
        createTrafficChart();
    });
    
    // Set up traffic toggle button
    document.getElementById('toggleTraffic').addEventListener('click', function() {
        if (trafficEnabled) {
            trafficLayer.setMap(null);
            trafficEnabled = false;
            this.innerHTML = '<i class="fas fa-layer-group"></i> Show Traffic';
        } else {
            trafficLayer.setMap(map);
            trafficEnabled = true;
            this.innerHTML = '<i class="fas fa-layer-group"></i> Hide Traffic';
        }
    });
    
    // Set up refresh button
    document.getElementById('refreshMap').addEventListener('click', function() {
        if (trafficEnabled) {
            trafficLayer.setMap(null);
            trafficLayer = new google.maps.TrafficLayer();
            trafficLayer.setMap(map);
        }
        fetchTrafficData();
    });
    
    // Set up refresh summary button
    document.getElementById('refreshSummary').addEventListener('click', function() {
        fetchTrafficData();
    });
    
    // Set up view selector
    document.getElementById('mapViewSelector').addEventListener('change', function() {
        updateMapView(this.value);
    });
}

// Function to simulate fetching real traffic data
// In a real implementation, this would call your backend API
function fetchTrafficData() {
    // Show loading animation
    const refreshBtn = document.getElementById('refreshSummary');
    refreshBtn.classList.add('rotating');
    
    // In a real implementation, you would make an API call here
    // For demo purposes, we'll simulate getting data from the traffic layer
    
    // Simulate network delay
    setTimeout(() => {
        // Simulate retrieving data from the traffic layer
        simulateTrafficData();
        
        // Update the dashboard with new data
        updateTrafficSummary();
        updateRoutesStatus();
        updateSignalStatus();
        updateAlerts();
        updateTrafficChart();
        
        // Update timestamp
        updateTimestamp();
        
        // Remove loading animation
        refreshBtn.classList.remove('rotating');
    }, 1000);
}

// Function to simulate traffic data changes
function simulateTrafficData() {
    // In a real implementation, you would extract actual data from the Google Maps Traffic Layer
    // or from your own backend traffic monitoring system
    
    // For demo purposes, we'll generate random variations of traffic data
    const variationFactor = 0.15; // 15% maximum variation
    
    // Update overall congestion level (with some random variation)
    const congestionVariation = Math.random() * variationFactor * 2 - variationFactor;
    trafficData.congestionLevel = Math.min(Math.max(
        Math.round(trafficData.congestionLevel * (1 + congestionVariation)),
        5), 95); // Keep between 5% and 95%
    
    // Update road status percentages based on congestion
    trafficData.heavyTraffic = Math.round(trafficData.congestionLevel / 3);
    trafficData.moderateTraffic = Math.round(trafficData.congestionLevel * 2 / 3);
    trafficData.clearRoads = 100 - trafficData.heavyTraffic - trafficData.moderateTraffic;
    
    // Update individual routes
    for (const route in trafficData.routes) {
        const data = trafficData.routes[route];
        
        // Random variation for vehicles
        const vehicleVariation = Math.random() * variationFactor * 2 - variationFactor;
        data.vehicles = Math.max(Math.round(data.vehicles * (1 + vehicleVariation)), 100);
        
        // Random variation for speed
        const speedVariation = Math.random() * variationFactor * 2 - variationFactor;
        data.speed = Math.max(Math.round(data.speed * (1 + speedVariation)), 5);
        
        // Determine status based on speed
        if (data.speed > 35) {
            data.status = "clear";
            data.delay = Math.round(data.speed / 20);
        } else if (data.speed > 15) {
            data.status = "moderate";
            data.delay = Math.round(data.speed / 2);
        } else {
            data.status = "heavy";
            data.delay = Math.round(60 / data.speed);
        }
        
        // Update trend
        const previousSpeed = data.speed / (1 + speedVariation); // Approximate previous speed
        data.trend = (data.speed > previousSpeed) ? "down" : "up"; // Down trend means improving (speed increasing)
    }
    
    // Update signal status (randomly toggle a few)
    if (Math.random() < 0.2) { // 20% chance of signal status change
        const changeType = Math.floor(Math.random() * 3);
        if (changeType === 0 && trafficData.signals.operational > 30) {
            trafficData.signals.operational--;
            trafficData.signals.flashing++;
        } else if (changeType === 1 && trafficData.signals.flashing > 0) {
            trafficData.signals.flashing--;
            trafficData.signals.operational++;
        } else if (changeType === 2 && trafficData.signals.inactive > 0) {
            trafficData.signals.inactive--;
            trafficData.signals.operational++;
        }
    }
    
    // Create random alert (25% chance)
    if (Math.random() < 0.25) {
        createRandomAlert();
    }
    
    // Update hourly traffic data
    updateHourlyData();
}

// Function to update the traffic summary panel
function updateTrafficSummary() {
    // Update overall congestion percentage
    document.querySelector('.circle-progress').style.setProperty('--percentage', `${trafficData.congestionLevel}%`);
    document.querySelector('.status-circle span').textContent = `${trafficData.congestionLevel}%`;
    
    // Update traffic indicators
    document.querySelectorAll('.indicator-group').forEach(group => {
        const label = group.querySelector('.indicator-label span:last-child').textContent.trim();
        if (label === "Clear Roads") {
            group.querySelector('.indicator-value').textContent = `${trafficData.clearRoads}%`;
        } else if (label === "Moderate Traffic") {
            group.querySelector('.indicator-value').textContent = `${trafficData.moderateTraffic}%`;
        } else if (label === "Heavy Congestion") {
            group.querySelector('.indicator-value').textContent = `${trafficData.heavyTraffic}%`;
        }
    });
}

// Function to update the routes status section
function updateRoutesStatus() {
    const routeCards = document.querySelectorAll('.route-card');
    let index = 0;
    
    for (const route in trafficData.routes) {
        if (index >= routeCards.length) break;
        
        const card = routeCards[index];
        const data = trafficData.routes[route];
        
        // Update route name
        card.querySelector('.route-header h4').textContent = route;
        
        // Update status badge
        const badge = card.querySelector('.traffic-badge');
        badge.className = `traffic-badge ${data.status}`;
        badge.textContent = data.status.charAt(0).toUpperCase() + data.status.slice(1);
        
        // Update metrics
        card.querySelector('.route-metric:nth-child(1) span').textContent = `${data.vehicles} vehicles/hr`;
        card.querySelector('.route-metric:nth-child(2) span').textContent = `+${data.delay} min delay`;
        card.querySelector('.speed-value').textContent = data.speed;
        
        // Update trend
        const trendIndicator = card.querySelector('.trend-indicator');
        if (data.trend === "up") {
            trendIndicator.className = "trend-indicator up";
            trendIndicator.innerHTML = '<i class="fas fa-arrow-up"></i> Worsening';
        } else {
            trendIndicator.className = "trend-indicator down";
            trendIndicator.innerHTML = '<i class="fas fa-arrow-down"></i> Improving';
        }
        
        index++;
    }
}

// Function to update the signal status section
function updateSignalStatus() {
    const signalItems = document.querySelectorAll('.signal-status-item');
    
    // Update operational signals
    signalItems[0].querySelector('.signal-count').textContent = trafficData.signals.operational;
    
    // Update flashing signals
    signalItems[1].querySelector('.signal-count').textContent = trafficData.signals.flashing;
    
    // Update inactive signals
    signalItems[2].querySelector('.signal-count').textContent = trafficData.signals.inactive;
}

// Function to generate hourly traffic data
function generateHourlyData() {
    const currentHour = new Date().getHours();
    trafficData.hourlyData = [];
    
    // Generate data for the last 24 hours
    for (let i = 0; i < 24; i++) {
        const hour = (currentHour - 23 + i + 24) % 24;
        const hourLabel = `${hour}:00`;
        
        // Traffic follows a typical pattern with peaks during rush hours
        let baseDensity;
        if (hour >= 7 && hour <= 9) {
            // Morning rush
            baseDensity = 75 + Math.random() * 15;
        } else if (hour >= 16 && hour <= 18) {
            // Evening rush
            baseDensity = 80 + Math.random() * 15;
        } else if (hour >= 10 && hour <= 15) {
            // Midday
            baseDensity = 40 + Math.random() * 20;
        } else if (hour >= 19 && hour <= 22) {
            // Evening
            baseDensity = 30 + Math.random() * 20;
        } else {
            // Night/early morning
            baseDensity = 10 + Math.random() * 15;
        }
        
        trafficData.hourlyData.push({
            hour: hourLabel,
            density: Math.round(baseDensity),
            vehicles: Math.round(baseDensity * 100)
        });
    }
}

// Function to update hourly data with the latest hour
function updateHourlyData() {
    const currentHour = new Date().getHours();
    const hourLabel = `${currentHour}:00`;
    
    // Calculate current density based on congestion level
    let currentDensity;
    if (currentHour >= 7 && currentHour <= 9) {
        // Morning rush
        currentDensity = 60 + trafficData.congestionLevel / 2;
    } else if (currentHour >= 16 && currentHour <= 18) {
        // Evening rush
        currentDensity = 65 + trafficData.congestionLevel / 2;
    } else if (currentHour >= 10 && currentHour <= 15) {
        // Midday
        currentDensity = 30 + trafficData.congestionLevel;
    } else if (currentHour >= 19 && currentHour <= 22) {
        // Evening
        currentDensity = 20 + trafficData.congestionLevel / 1.5;
    } else {
        // Night/early morning
        currentDensity = 5 + trafficData.congestionLevel / 3;
    }
    
    // Remove oldest hour and add newest
    trafficData.hourlyData.shift();
    trafficData.hourlyData.push({
        hour: hourLabel,
        density: Math.round(currentDensity),
        vehicles: Math.round(currentDensity * 100)
    });
}

// Function to create a random traffic alert
function createRandomAlert() {
    const alertTypes = [
        {
            type: "critical",
            title: "Traffic Congestion",
            icon: "exclamation-circle"
        },
        {
            type: "warning",
            title: "Signal Malfunction",
            icon: "exclamation-triangle"
        },
        {
            type: "info",
            title: "Traffic Light Issue",
            icon: "info-circle"
        }
    ];
    
    const streets = ["Second Street", "Samora Machel", "Rekai Tagwira", "Main Street", "Tongogara", "Seke Road"];
    const randomStreet1 = streets[Math.floor(Math.random() * streets.length)];
    const randomStreet2 = streets[Math.floor(Math.random() * streets.length)];
    
    const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const timeMinutes = Math.floor(Math.random() * 120) + 1; // Random time 1-120 minutes ago
    
    let description;
    if (alertType.type === "critical") {
        description = `Heavy traffic on ${randomStreet1} and ${randomStreet2} due to ${Math.random() > 0.5 ? 'an accident' : 'road work'}`;
    } else if (alertType.type === "warning") {
        description = `Traffic light on ${randomStreet1} and ${randomStreet2} is operating in flashing mode`;
    } else {
        description = `${randomStreet1} and ${randomStreet2}`;
    }
    
    const newAlert = {
        type: alertType.type,
        title: alertType.title,
        icon: alertType.icon,
        description: description,
        time: timeMinutes
    };
    
    // Add to beginning of alerts array (most recent first)
    trafficData.alerts.unshift(newAlert);
    
    // Keep only the 10 most recent alerts
    if (trafficData.alerts.length > 10) {
        trafficData.alerts.pop();
    }
}

// Function to update alerts section
function updateAlerts() {
    const alertList = document.querySelector('.alert-list');
    alertList.innerHTML = ''; // Clear existing alerts
    
    // Create alerts from traffic data
    trafficData.alerts.slice(0, 3).forEach(alert => {
        const timeText = alert.time === 1 ? "1 minute ago" :
                        alert.time < 60 ? `${alert.time} minutes ago` :
                        alert.time === 60 ? "1 hour ago" :
                        `${Math.floor(alert.time / 60)} hours ago`;
        
        const alertHTML = `
            <li class="alert-item">
                <div class="alert-icon ${alert.type}">
                    <i class="fas fa-${alert.icon}"></i>
                </div>
                <div class="alert-content">
                    <h4>${alert.title}</h4>
                    <p>${alert.description}</p>
                    <span class="alert-time">${timeText}</span>
                </div>
                <div class="alert-actions">
                    <button class="btn btn-sm">${alert.type === 'info' ? 'Dismiss' : 'Resolve'}</button>
                </div>
            </li>
        `;
        
        alertList.innerHTML += alertHTML;
    });
    
    // Add event listeners to the resolve/dismiss buttons
    document.querySelectorAll('.alert-actions .btn').forEach((btn, index) => {
        btn.addEventListener('click', function() {
            // Remove the alert from both the data and the DOM
            trafficData.alerts.splice(index, 1);
            updateAlerts(); // Refresh the alerts list
        });
    });
}

// Function to create the traffic density chart
function createTrafficChart() {
    // Replace the chart placeholder with a canvas element
    const chartContainer = document.querySelector('.chart-container');
    chartContainer.innerHTML = '<canvas id="trafficChart"></canvas>';
    
    // Get the canvas context
    const ctx = document.getElementById('trafficChart').getContext('2d');
    
    // Prepare data for the chart
    const labels = trafficData.hourlyData.map(data => data.hour);
    const densityData = trafficData.hourlyData.map(data => data.density);
    
    // Create the chart
    window.trafficChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Traffic Density (%)',
                data: densityData,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Congestion Level (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Hour of Day'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const index = context.dataIndex;
                            const vehicles = trafficData.hourlyData[index].vehicles;
                            return [
                                `Congestion: ${context.raw}%`,
                                `Vehicles: ${vehicles}/hr`
                            ];
                        }
                    }
                }
            }
        }
    });
}

// Function to update the traffic chart with new data
function updateTrafficChart() {
    if (window.trafficChart) {
        window.trafficChart.data.labels = trafficData.hourlyData.map(data => data.hour);
        window.trafficChart.data.datasets[0].data = trafficData.hourlyData.map(data => data.density);
        window.trafficChart.update();
    }
}

// Function to update the timestamp
function updateTimestamp() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`;
    
    document.getElementById('updateTime').textContent = timeString;
}

// Function to update the map view based on selection
function updateMapView(view) {
    // In a real implementation, this would switch between different map layers
    // For demonstration, we'll just show an alert
    console.log(`Switching to ${view} view`);
    
    // For a real implementation, you would:
    // 1. Hide/show different layers on the map
    // 2. Make API calls to fetch specific data for the selected view
    // 3. Update the relevant UI components
    
    // Example:
    if (view === "roadwork") {
        // Show roadwork markers/layers
        alert("Switching to Roadwork view - In a real implementation, this would display roadwork markers");
    } else if (view === "incidents") {
        // Show incident markers/layers
        alert("Switching to Incidents view - In a real implementation, this would display incident markers");
    } else {
        // Default traffic view
        // Already handled by the traffic layer
    }
}

// Add event listener for alert resolution
document.addEventListener('DOMContentLoaded', function() {
    // Ensure Chart.js is loaded
    if (typeof Chart === 'undefined') {
        // Create a script element to load Chart.js from CDN
        const chartScript = document.createElement('script');
        chartScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.0/chart.min.js';
        chartScript.onload = function() {
            // Chart.js is now loaded - initialize if map is ready
            if (map) {
                generateHourlyData();
                createTrafficChart();
            }
        };
        document.head.appendChild(chartScript);
    }
    
    // Initial alerts
    createRandomAlert();
    createRandomAlert();
    createRandomAlert();
    updateAlerts();
});