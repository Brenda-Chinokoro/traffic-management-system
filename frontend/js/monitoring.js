// monitoring.js - Traffic monitoring functionality

document.addEventListener('DOMContentLoaded', function() {
    initMonitoring();
});

function initMonitoring() {
    loadTrafficMap();
    loadIntersectionStatus();
    loadCameraFeeds();
    setupFilters();
    initRealTimeUpdates();
}

// Initialize the traffic map
function loadTrafficMap() {
    // This would integrate with mapping APIs like Google Maps or Mapbox
    console.log('Traffic map initialized');
    
    // Mock map initialization - in a real app, you would use a mapping library
    const mapContainer = document.getElementById('traffic-map');
    
    if (mapContainer) {
        mapContainer.innerHTML = `
            <div class="map-placeholder">
                <p>Interactive Traffic Map</p>
                <p class="map-note">Map shows real-time traffic conditions, incidents, and signal status</p>
            </div>
        `;
    }
}

// Load intersection status data
async function loadIntersectionStatus() {
    // Mock data - would be replaced with actual API call
    const intersections = [
        { id: 1, name: 'Main St & Broadway', status: 'Normal', load: 'Medium', lastUpdated: new Date() },
        { id: 2, name: '5th Ave & Park Rd', status: 'Congested', load: 'High', lastUpdated: new Date() },
        { id: 3, name: 'Central Blvd & 10th St', status: 'Normal', load: 'Low', lastUpdated: new Date() },
        { id: 4, name: 'Commerce Way & Market St', status: 'Warning', load: 'Medium', lastUpdated: new Date() }
    ];
    
    const tableBody = document.getElementById('intersection-status-table');
    
    if (tableBody) {
        tableBody.innerHTML = '';
        
        intersections.forEach(intersection => {
            const row = document.createElement('tr');
            
            // Apply status-based class for color coding
            const statusClass = `status-${intersection.status.toLowerCase()}`;
            
            row.innerHTML = `
                <td>${intersection.id}</td>
                <td>${intersection.name}</td>
                <td><span class="${statusClass}">${intersection.status}</span></td>
                <td>${intersection.load}</td>
                <td>${formatDate(intersection.lastUpdated)}</td>
                <td>
                    <button class="btn btn-sm btn-view" data-id="${intersection.id}">Details</button>
                    <button class="btn btn-sm btn-configure" data-id="${intersection.id}">Configure</button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Add event listeners to the buttons
        addIntersectionButtonListeners();
    }
}

// Add event listeners to intersection table buttons
function addIntersectionButtonListeners() {
    document.querySelectorAll('.btn-view').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            viewIntersectionDetails(id);
        });
    });
    
    document.querySelectorAll('.btn-configure').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            configureIntersection(id);
        });
    });
}

// View intersection details
function viewIntersectionDetails(id) {
    showAlert(`Viewing details for intersection ID: ${id}`, 'info');
    // In a real app, this might open a modal or navigate to a details page
}

// Configure intersection settings
function configureIntersection(id) {
    showAlert(`Opening configuration for intersection ID: ${id}`, 'info');
    // In a real app, this would open a configuration modal or page
}

// Load camera feeds
function loadCameraFeeds() {
    // Mock camera data - in a real app, these would be actual video feeds
    const cameras = [
        { id: 1, location: 'Main St & Broadway', status: 'Online' },
        { id: 2, location: '5th Ave & Park Rd', status: 'Online' },
        { id: 3, location: 'Central Blvd & 10th St', status: 'Offline' },
        { id: 4, location: 'Commerce Way & Market St', status: 'Online' }
    ];
    
    const cameraContainer = document.getElementById('camera-feeds');
    
    if (cameraContainer) {
        cameraContainer.innerHTML = '';
        
        cameras.forEach(camera => {
            const statusClass = camera.status === 'Online' ? 'camera-online' : 'camera-offline';
            
            const cameraElement = document.createElement('div');
            cameraElement.className = `camera-feed ${statusClass}`;
            cameraElement.innerHTML = `
                <div class="camera-header">
                    <span class="camera-title">Camera #${camera.id}: ${camera.location}</span>
                    <span class="camera-status">${camera.status}</span>
                </div>
                <div class="camera-content">
                    ${camera.status === 'Online' 
                        ? '<div class="camera-placeholder">Live Feed</div>' 
                        : '<div class="camera-offline-message">Camera Offline</div>'}
                </div>
                <div class="camera-footer">
                    <button class="btn-camera-control" data-id="${camera.id}">Controls</button>
                    <button class="btn-camera-fullscreen" data-id="${camera.id}">Fullscreen</button>
                </div>
            `;
            
            cameraContainer.appendChild(cameraElement);
        });
        
        // Add event listeners to camera buttons
        document.querySelectorAll('.btn-camera-control').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                openCameraControls(id);
            });
        });
        
        document.querySelectorAll('.btn-camera-fullscreen').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                openCameraFullscreen(id);
            });
        });
    }
}

// Open camera controls panel
function openCameraControls(cameraId) {
    showAlert(`Opening controls for camera ID: ${cameraId}`, 'info');
    // In a real app, this would open camera control options
}

// Open camera fullscreen view
function openCameraFullscreen(cameraId) {
    showAlert(`Opening fullscreen view for camera ID: ${cameraId}`, 'info');
    // In a real app, this would expand the camera feed to fullscreen
}

// Setup filtering options
function setupFilters() {
    const filterForm = document.getElementById('monitoring-filters');
    
    if (filterForm) {
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get filter values
            const statusFilter = document.getElementById('filter-status').value;
            const locationFilter = document.getElementById('filter-location').value;
            
            // Apply filters - in a real app, this would filter the data
            showAlert(`Filters applied: Status=${statusFilter}, Location=${locationFilter}`, 'info');
            
            // Reload data with filters
            loadIntersectionStatus();
            loadCameraFeeds();
        });
        
        // Reset filters button
        const resetButton = document.getElementById('reset-filters');
        if (resetButton) {
            resetButton.addEventListener('click', function() {
                filterForm.reset();
                showAlert('Filters reset', 'info');
                loadIntersectionStatus();
                loadCameraFeeds();
            });
        }
    }
}

// Initialize real-time updates (would use WebSockets in a real application)
function initRealTimeUpdates() {
    console.log('Real-time monitoring updates initialized');
    
    // In a real app, this would connect to a WebSocket for live updates
    // Mock periodic updates for demo purposes
    setInterval(() => {
        // Update random elements to simulate real-time changes
        simulateRealtimeUpdates();
    }, 15000); // Every 15 seconds
}

// Simulate real-time updates (for demo purposes)
function simulateRealtimeUpdates() {
    const statuses = ['Normal', 'Warning', 'Congested'];
    const loads = ['Low', 'Medium', 'High'];
    
    // Randomly update an intersection
    const intersectionRows = document.querySelectorAll('#intersection-status-table tr');
    if (intersectionRows.length > 0) {
        const randomRow = Math.floor(Math.random() * intersectionRows.length);
        if (intersectionRows[randomRow]) {
            const statusCell = intersectionRows[randomRow].cells[2].querySelector('span');
            const loadCell = intersectionRows[randomRow].cells[3];
            
            if (statusCell && loadCell) {
                const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
                const newLoad = loads[Math.floor(Math.random() * loads.length)];
                
                // Remove old status class
                statusCell.className = '';
                // Add new status class
                statusCell.className = `status-${newStatus.toLowerCase()}`;
                statusCell.textContent = newStatus;
                
                loadCell.textContent = newLoad;
                
                // Flash the updated row to highlight the change
                intersectionRows[randomRow].classList.add('highlight-update');
                setTimeout(() => {
                    intersectionRows[randomRow].classList.remove('highlight-update');
                }, 2000);
            }
        }
    }
}