document.addEventListener("DOMContentLoaded", () => {
    const map = L.map("mapid").setView([51.505, -0.09], 13); // Default location
  
    // Load OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);
  
    let userLocation;
    let nearestPoliceStation = null; // To store the nearest police station
  
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
  
    // Fetch and display nearby police stations
    function fetchNearbyPoliceStations() {
      if (!userLocation) {
        alert("❌ Location not available! Please enable location services.");
        return;
      }
  
      let query = `
        [out:json];
        node["amenity"="police"](around:25000, ${userLocation[0]}, ${userLocation[1]});
        out;
      `;
      let url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
  
      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data.elements.length === 0) {
            alert("❌ No nearby police stations found within 25 km.");
            return;
          }
  
          // Find the nearest police station
          nearestPoliceStation = data.elements.reduce((closest, station) => {
            const stationLocation = [station.lat, station.lon];
            const distance = getDistance(userLocation, stationLocation);
  
            if (!closest || distance < closest.distance) {
              return { station, distance };
            }
  
            return closest;
          }, null);
  
          if (nearestPoliceStation) {
            const { lat, lon } = nearestPoliceStation.station;
  
            // Add marker for nearest police station
            L.marker([lat, lon]).addTo(map)
              .bindPopup("<b>Nearest Police Station</b>")
              .openPopup();
          }
        })
        .catch(() => alert("❌ Error fetching nearby police stations. Try again later."));
    }
  
    // Calculate the distance between two coordinates
    function getDistance(coord1, coord2) {
      const R = 6371; // Radius of the Earth in km
      const dLat = (coord2[0] - coord1[0]) * Math.PI / 180;
      const dLon = (coord2[1] - coord1[1]) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(coord1[0] * Math.PI / 180) * Math.cos(coord2[0] * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // Distance in km
    }
  
    // Function to handle emergency calls or messages (using WhatsApp or SMS)
    function initiateCall(type) {
      const phoneNumber = "9030605034"; // Updated phone number
      let url = "";
  
      switch (type) {
        case "call":
          url = `tel:${phoneNumber}`;
          break;
        case "video":
          url = `https://wa.me/${phoneNumber}?text=Video%20Call%20Request`;
          break;
        case "message":
          url = `https://wa.me/${phoneNumber}?text=Hello%2C%20I%20need%20urgent%20assistance!`;
          break;
        default:
          return;
      }
  
      window.open(url, "_blank");
    }
  
    // Function to send emergency alert via WhatsApp, SMS, and Auto-Call
    function sos() { 
      if (!userLocation) {
        alert("❌ Location not available! Enable location services.");
        return;
      }
  
      let lat = userLocation[0];
      let lon = userLocation[1];
      let locationLink = `https://maps.google.com/?q=${lat},${lon}`;
      let emergencyMessage = `🚨 EMERGENCY ALERT! 🚨\nI need immediate assistance. My live location:\n${locationLink}`;
      let emergencyContact = "9030605034"; // Updated police contact number
  
      // Send via WhatsApp
      let whatsappLink = `https://wa.me/${emergencyContact}?text=${encodeURIComponent(emergencyMessage)}`;
      window.open(whatsappLink, "_blank");
  
      // Send via SMS
      let smsLink = `sms:${emergencyContact}?body=${encodeURIComponent(emergencyMessage)}`;
      window.open(smsLink, "_blank");
  
      // Alert user
      alert("🚨 SOS Activated! Live location sent via WhatsApp and SMS.");
  
      // Auto-call police
      window.location.href = `tel:${emergencyContact}`; // Auto-call the first contact (police number)
    }
  
    // Function to navigate to the nearest police station without redirection to Google Maps
    function navigateToPoliceStation() {
      if (nearestPoliceStation) {
        const { lat, lon } = nearestPoliceStation.station;
  
        // Calculate route directly on the map
        const routeUrl = `https://router.project-osrm.org/route/v1/driving/${userLocation[1]},${userLocation[0]};${lon},${lat}?alternatives=true&overview=full&geometries=geojson`;
  
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
      } else {
        alert("❌ No nearby police station found.");
      }
    }
  
    // Function to clear previous markers
    function clearMarkers() {
      map.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });
    }
  
    // Event Listeners for buttons
    document.getElementById("video-call-btn").addEventListener("click", () => initiateCall("video"));
    document.getElementById("audio-call-btn").addEventListener("click", () => initiateCall("call"));
    document.getElementById("message-btn").addEventListener("click", () => initiateCall("message"));
    document.getElementById("nearby-police-btn").addEventListener("click", fetchNearbyPoliceStations);
    document.getElementById("navigate-btn").addEventListener("click", navigateToPoliceStation);
    document.getElementById("sos-btn").addEventListener("click", sos);
  
    // Load the map with nearby police stations when ready
    fetchNearbyPoliceStations();
  });
  
  