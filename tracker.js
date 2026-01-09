// Initialize Map
const map = L.map('map').setView([20.5937, 78.9629], 5); // Default to India

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Function to Find Route
async function findRoute() {
    const from = document.getElementById('fromLocation').value;
    const to = document.getElementById('toLocation').value;

    if (!from || !to) {
        alert('Please enter both From and To locations');
        return;
    }

    try {
        // Geocode From and To Locations
        const fromCoords = await geocodeLocation(from);
        const toCoords = await geocodeLocation(to);

        // Plot Points on Map
        L.marker(fromCoords).addTo(map).bindPopup('From: ' + from).openPopup();
        L.marker(toCoords).addTo(map).bindPopup('To: ' + to).openPopup();
        
        // Draw Route
        const routeUrl = `https://router.project-osrm.org/route/v1/driving/${fromCoords[1]},${fromCoords[0]};${toCoords[1]},${toCoords[0]}?overview=full&geometries=geojson`;
        const response = await fetch(routeUrl);
        const data = await response.json();
        
        const route = data.routes[0].geometry;
        L.geoJSON(route, { color: 'blue', weight: 5 }).addTo(map);
        
        map.fitBounds([fromCoords, toCoords]);
    } catch (error) {
        alert('Failed to find route. Please check the location names or pincodes.');
        console.error(error);
    }
}

// Function to Geocode Locations
async function geocodeLocation(query) {
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;
    const response = await fetch(geocodeUrl);
    const data = await response.json();

    if (data.length === 0) throw new Error('Location not found');
    return [data[0].lat, data[0].lon];
}
