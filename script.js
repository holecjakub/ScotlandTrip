let map;

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        0.5 - Math.cos(dLat)/2 + 
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        (1 - Math.cos(dLon)) / 2;
    return R * 2 * Math.asin(Math.sqrt(a));
}

function initMap() {
    const glasgowCoords = { lat: 55.8642, lng: -4.2518 };

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: glasgowCoords, // General center of Scotland
        gestureHandling: 'greedy',
        disableDefaultUI: true, // Remove Google Maps controls
        styles: [
            {
                "featureType": "poi",
                "elementType": "labels",
                "stylers": [{"visibility": "off"}]
            }
        ]
    });

    const locations = [
        { name: "Stirling Castle", position: { lat: 56.1236, lng: -3.9416 }, description: "A grand medieval fortress.", instagram: "https://www.instagram.com/explore/tags/stirlingcastle/" },
        { name: "Falls of Dourface", position: { lat: 56.2181, lng: -4.6824 }, description: "A breathtaking waterfall.", instagram: "https://www.instagram.com/explore/tags/fallsofdourface/" },
        { name: "Elgin Sands", position: { lat: 57.6482, lng: -3.3158 }, description: "A beautiful sandy landscape.", instagram: "https://www.instagram.com/explore/tags/elginsands/" },
        { name: "Glen Glen", position: { lat: 57.2000, lng: -4.5000 }, description: "A serene glen surrounded by mountains.", instagram: "https://www.instagram.com/explore/tags/glenglen/" },
        { name: "Dumbarton Heather Fields", position: { lat: 55.9477, lng: -4.5701 }, description: "Lavender fields stretching as far as the eye can see.", instagram: "https://www.instagram.com/explore/tags/dumbartonheatherfields/" },
        { name: "Paisley Park", position: { lat: 55.8467, lng: -4.4239 }, description: "A park with stunning waterfalls.", instagram: "https://www.instagram.com/explore/tags/paisleypark/" },
        { name: "Cairngorm Caves", position: { lat: 57.1215, lng: -3.6474 }, description: "Mysterious caves glowing with bioluminescence.", instagram: "https://www.instagram.com/explore/tags/cairngormcaves/" },
        { name: "Lower Loch Ness Falls", position: { lat: 57.3230, lng: -4.4452 }, description: "Waterfalls cascading into the famous Loch Ness.", instagram: "https://www.instagram.com/explore/tags/lowerlochnessfalls/" },
        { name: "Kingdom of Fife", position: { lat: 56.2083, lng: -3.1490 }, description: "A historic region with charming towns.", instagram: "https://www.instagram.com/explore/tags/kingdomoffife/" },
        { name: "Glasgow", position: { lat: 55.8642, lng: -4.2518 }, description: "Scotland's largest city, known for its culture and architecture.", instagram: "https://www.instagram.com/explore/tags/glasgow/" },
        { name: "Fairy Pools, Isle of Skye", position: { lat: 57.2500, lng: -6.2167 }, description: "Crystal clear pools in a scenic setting.", instagram: "https://www.instagram.com/explore/tags/fairypools/" },
        { name: "Kilchurn Castle, Loch Awe", position: { lat: 56.4039, lng: -5.0291 }, description: "A picturesque ruined castle by Loch Awe.", instagram: "https://www.instagram.com/explore/tags/kilchurncastle/" },
        { name: "Glenfinnan Viaduct", position: { lat: 56.8714, lng: -5.4311 }, description: "A railway viaduct famous for its appearance in Harry Potter films.", instagram: "https://www.instagram.com/explore/tags/glenfinnanviaduct/" }
    ];

    locations.forEach(location => {
        const marker = new google.maps.Marker({
            position: location.position,
            map: map,
            title: location.name
        });

        marker.addListener('click', () => {
            showLocationDetails(location);
        });
    });

    populateLocationsList(locations, glasgowCoords);
}

function showLocationDetails(location) {
    const glasgowCoords = { lat: 55.8642, lng: -4.2518 };
    document.getElementById('locationName').innerText = location.name;
    document.getElementById('locationDescription').innerText = location.description;

    const distance = calculateDistance(glasgowCoords.lat, glasgowCoords.lng, location.position.lat, location.position.lng);
    const travelTime = (distance / 60).toFixed(2); // Assuming 60 km/h average speed
    document.getElementById('locationDistance').innerText = `${distance.toFixed(2)} km (${travelTime} hours) from Glasgow`;

    document.getElementById('searchBtn').onclick = () => window.open(`https://www.google.com/search?q=${encodeURIComponent(location.name)}`, '_blank');
    document.getElementById('copyBtn').onclick = () => {
        navigator.clipboard.writeText(location.name);
        alert(`${location.name} copied to clipboard!`);
    };
    document.getElementById('instagramBtn').onclick = () => window.open(location.instagram, '_blank');

    document.getElementById('info').classList.add('active');
}

function populateLocationsList(locations, glasgowCoords) {
    const listContainer = document.getElementById('locations-list');
    listContainer.innerHTML = '';

    locations.forEach(location => {
        const distance = calculateDistance(glasgowCoords.lat, glasgowCoords.lng, location.position.lat, location.position.lng);
        const travelTime = (distance / 60).toFixed(2);

        const item = document.createElement('div');
        item.className = 'location-item';
        item.innerHTML = `
            <h3>${location.name}</h3>
            <p>${location.description}</p>
            <p>${distance.toFixed(2)} km (${travelTime} hours) from Glasgow</p>
            <button class="search-btn">Search on Google</button>
            <button class="instagram-btn">Open in Instagram</button>
        `;

        item.querySelector('.search-btn').onclick = () => window.open(`https://www.google.com/search?q=${encodeURIComponent(location.name)}`, '_blank');
        item.querySelector('.instagram-btn').onclick = () => window.open(location.instagram, '_blank');

        listContainer.appendChild(item);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            if (tab.dataset.tab === 'itinerary') {
                document.getElementById('map-container').style.display = 'block';
                document.getElementById('locations-list').style.display = 'none';
            } else {
                document.getElementById('map-container').style.display = 'none';
                document.getElementById('locations-list').style.display = 'block';
            }
        });
    });

    document.getElementById('expand-map').addEventListener('click', () => {
        document.getElementById('map-container').classList.toggle('fullscreen');
        google.maps.event.trigger(map, 'resize');
    });

    document.getElementById('close-app').addEventListener('click', () => {
        // Implement app closing logic here
        console.log('Closing app');
    });
});

// Register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
    .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
    }).catch(error => {
        console.log('Service Worker registration failed:', error);
    });
}

// Add event listener for device orientation changes
window.addEventListener('orientationchange', () => {
    // Trigger a resize event to adjust the map
    google.maps.event.trigger(map, 'resize');
});

// Add event listener for window resize
window.addEventListener('resize', () => {
    // Adjust UI elements if needed
    const info = document.getElementById('info');
    if (info.classList.contains('active')) {
        // Ensure info panel doesn't cover more than 80% of the screen height
        info.style.maxHeight = `${window.innerHeight * 0.8}px`;
    }
});