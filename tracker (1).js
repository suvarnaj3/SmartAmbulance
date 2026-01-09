let map = L.map('map').setView([20.5937, 78.9629], 5);
let userMarker, routeLayer, lastCoords;
let placeMarkers = [];

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// 📍 Track User's Location in Real-Time
function trackLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(position => {
            const { latitude, longitude } = position.coords;
            lastCoords = [latitude, longitude];

            // Remove previous user marker
            if (userMarker) map.removeLayer(userMarker);

            // Add new user marker
            userMarker = L.marker(lastCoords).addTo(map)
                .bindPopup('You are here')
                .openPopup();

            map.setView(lastCoords, 14);

            // Recommend nearest places once location is tracked
            recommendPlaces(latitude, longitude);
        });
    } else {
        alert("Geolocation not supported");
    }
}

// 🚀 Find Fastest Route
async function findRoute() {
    const destination = document.getElementById('toLocation').value;

    if (!lastCoords || !destination) {
        alert("Please enter a valid destination and enable location tracking");
        return;
    }

    try {
        // Geocode destination to coordinates
        const destinationCoords = await geocodeLocation(destination);

        // Remove previous route
        if (routeLayer) map.removeLayer(routeLayer);

        // Build OSRM routing URL using coordinates
        const routeUrl = `https://router.project-osrm.org/route/v1/driving/${lastCoords[1]},${lastCoords[0]};${destinationCoords[1]},${destinationCoords[0]}?overview=full&geometries=geojson`;
        const response = await fetch(routeUrl);
        const data = await response.json();

        if (data.routes.length === 0) {
            alert("Route not found.");
            return;
        }

        // Draw route on the map
        const route = data.routes[0].geometry;
        routeLayer = L.geoJSON(route, { color: 'blue' }).addTo(map);

        map.fitBounds(routeLayer.getBounds());
    } catch (error) {
        console.error("Error finding route:", error);
        alert("Failed to find route. Please try again.");
    }
}

// 🌍 Geocode Location to Coordinates
async function geocodeLocation(query) {
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
    const response = await fetch(geocodeUrl);
    const data = await response.json();

    if (data.length === 0) throw new Error('Location not found');
    return [data[0].lat, data[0].lon];
}

// 🏥 Recommend Nearest Hospitals and Pharmacies (Fixed)
async function recommendPlaces(lat, lon) {
    // Clear previous markers
    placeMarkers.forEach(marker => map.removeLayer(marker));
    placeMarkers = [];

    const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];(node["amenity"="hospital"](around:5000,${lat},${lon});node["amenity"="pharmacy"](around:5000,${lat},${lon}));out;`;

    try {
        const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(overpassUrl)}`);
        const data = await response.json();

        const placesList = document.getElementById('places-list');
        placesList.innerHTML = '';

        data.elements.forEach(element => {
            const { lat, lon, tags } = element;
            const name = tags.name || 'Unknown';

            const icon = tags.amenity === 'hospital' ? '🏥' : '💊';
            const marker = L.marker([lat, lon]).addTo(map)
                .bindPopup(`${icon} ${name}`)
                .openPopup();

            placeMarkers.push(marker);

            const placeItem = `<div class="place-item"><span>${name}</span> - ${tags.amenity}</div>`;
            placesList.innerHTML += placeItem;
        });

        if (placeMarkers.length === 0) {
            placesList.innerHTML = `<p>No nearby hospitals or pharmacies found.</p>`;
        }
    } catch (error) {
        console.error("Error fetching nearby places:", error);
        alert("Failed to load nearby places. Please try again.");
    }
}
