document.addEventListener("DOMContentLoaded", () => {
  const map = L.map("mapid").setView([51.505, -0.09], 13); // Default location

  // Load OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  let userLocation;
  let markers = [];
  let routeLayer;

  // Get User Location
  function updateLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          userLocation = [position.coords.latitude, position.coords.longitude];
          map.setView(userLocation, 14);

          // Add Marker for User Location
          L.marker(userLocation).addTo(map)
            .bindPopup("📍 You are here")
            .openPopup();
        },
        () => alert("❌ Location access denied! Enable location to see nearby places.")
      );
    } else {
      alert("❌ Geolocation is not supported by this browser.");
    }
  }

  updateLocation();
  setInterval(updateLocation, 300000); // Auto-update every 5 minutes

  // Function to send emergency alert via WhatsApp and Auto-Call
  function sendEmergencyAlert() {
    if (!userLocation) {
      alert("❌ Location not available! Enable location services.");
      return;
    }

    let lat = userLocation[0];
    let lon = userLocation[1];
    let locationLink = `https://maps.google.com/?q=${lat},${lon}`;
    let emergencyMessage = `🚨 EMERGENCY ALERT! 🚨\nI need immediate assistance. My live location:\n${locationLink}`;
    let emergencyContacts = ["+917671952358", "+919030605034"];

    emergencyContacts.forEach((number) => {
      let whatsappLink = `https://wa.me/${number}?text=${encodeURIComponent(emergencyMessage)}`;
      window.open(whatsappLink, "_blank");
    });

    alert("🚨 SOS Activated! Live location sent.");
    window.location.href = `tel:${emergencyContacts[0]}`; // Auto-call police
  }

  // Function to fetch and display the nearest hospitals
  function fetchNearbyHospitals() {
    if (!userLocation) {
      alert("❌ Location not available! Please enable location services.");
      return;
    }

    let query = `
      [out:json];
      node["amenity"="hospital"](around:25000, ${userLocation[0]}, ${userLocation[1]});
      out;
    `;
    let url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        clearMarkers();

        if (data.elements.length === 0) {
          alert("❌ No nearby hospitals found within 25 km.");
          return;
        }

        // Sort hospitals by distance
        const sortedHospitals = data.elements.map((hospital) => {
          const lat = hospital.lat;
          const lon = hospital.lon;
          const name = hospital.tags.name || "Hospital";
          const phone = hospital.tags.phone || "9030605034";

          // Calculate distance from user location
          const distance = getDistance(userLocation[0], userLocation[1], lat, lon);

          return { lat, lon, name, phone, distance };
        }).sort((a, b) => a.distance - b.distance); // Sort by distance

        // Only show the nearest hospital (or a few nearest ones)
        const nearestHospital = sortedHospitals[0];

        // Add marker for the nearest hospital
        let marker = L.marker([nearestHospital.lat, nearestHospital.lon])
          .addTo(map)
          .bindPopup(`🏥 ${nearestHospital.name}`);
        markers.push(marker);

        // Show hospital details in dropdown (only the nearest one)
        showLocationSelector(nearestHospital);
      })
      .catch(() => alert("❌ Error fetching nearby hospitals. Try again later."));
  }

  // Function to show location selector with call options for the nearest hospital
  function showLocationSelector(hospital) {
    const selectorDiv = document.createElement("div");
    selectorDiv.innerHTML = `
      <label for="locationSelect">Select a hospital to navigate:</label>
      <select id="locationSelect">
        <option value="${hospital.lat},${hospital.lon},${hospital.phone}">${hospital.name}</option>
      </select>
      <button id="navigateButton">🚗 Navigate</button>
      <button id="callButton">📞 Call</button>
    `;
    selectorDiv.style = "position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); padding: 10px; background-color: rgba(0,0,0,0.8); color: white; border: 1px solid white; border-radius: 10px;";
    document.body.appendChild(selectorDiv);

    document.getElementById("navigateButton").addEventListener("click", () => {
      const selectedData = document.getElementById("locationSelect").value.split(",");
      calculateRoute(parseFloat(selectedData[0]), parseFloat(selectedData[1]));
      document.body.removeChild(selectorDiv);
    });

    // Call Button with WhatsApp link
    document.getElementById("callButton").addEventListener("click", () => {
      const selectedData = document.getElementById("locationSelect").value.split(",");
      const phoneNumber = selectedData[2]; // Get phone number from the selected option

      if (phoneNumber) {
        // Remove non-digit characters and open WhatsApp with the selected hospital number
        const phoneNumberFormatted = phoneNumber.replace(/\D/g, "");
        window.open(`https://wa.me/${phoneNumberFormatted}`, "_blank");
      } else {
        alert("❌ No phone number available.");
      }
    });
  }

  // Function to clear previous markers
  function clearMarkers() {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    if (routeLayer) map.removeLayer(routeLayer);
  }

  // Function to calculate route to selected hospital
  function calculateRoute(destLat, destLon) {
    if (!userLocation) {
      alert("❌ Cannot calculate route without location access.");
      return;
    }

    const routeUrl = `https://router.project-osrm.org/route/v1/driving/${userLocation[1]},${userLocation[0]};${destLon},${destLat}?alternatives=true&overview=full&geometries=geojson`;

    fetch(routeUrl)
      .then(response => response.json())
      .then(data => {
        clearMarkers();
        data.routes.forEach(route => {
          L.geoJSON(route.geometry, { style: { color: "blue", weight: 4 } }).addTo(map);
        });
        map.fitBounds(L.geoJSON(data.routes[0].geometry).getBounds());
        alert("🚗 Routes displayed! Follow the blue line to reach your destination.");
      })
      .catch(() => alert("❌ Error calculating the route."));
  }

  // Haversine Formula to calculate the distance between two lat/lon points
  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }

  // Event Listeners
  document.getElementById("sos-btn").addEventListener("click", sendEmergencyAlert);
  document.getElementById("nearby-ambulance-btn").addEventListener("click", fetchNearbyHospitals);
});
