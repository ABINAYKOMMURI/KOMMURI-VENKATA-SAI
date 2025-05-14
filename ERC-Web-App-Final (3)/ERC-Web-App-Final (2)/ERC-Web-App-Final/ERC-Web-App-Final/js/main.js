document.addEventListener("DOMContentLoaded", () => {
    const map = L.map("map").setView([51.505, -0.09], 13);

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
    setInterval(updateLocation, 300000);

    // Emergency Alert
    function SOS() {
        if (!userLocation) {
            alert("❌ Location not available! Enable location services.");
            return;
        }

        let lat = userLocation[0];
        let lon = userLocation[1];
        let locationLink = `https://maps.google.com/?q=${lat},${lon}`;
        let emergencyMessage = `🚨 EMERGENCY ALERT! 🚨\nI need immediate assistance. My live location:\n${locationLink}`;
        let emergencyContacts = ["+917671952358"];
        
        emergencyContacts.forEach((number) => {
            let whatsappLink = `https://wa.me/${number}?text=${encodeURIComponent(emergencyMessage)}`;
            window.open(whatsappLink, "_blank");
        });

        alert("🚨 SOS Activated! Live location sent.");
        window.location.href = `tel:${emergencyContacts[0]}`; // Auto-call
    }

    // Fetch Nearby
    function fetchNearbyPlaces(type, emoji) {
        if (!userLocation) {
            alert("❌ Location not available! Please enable location services.");
            return;
        }

        let query = `
            [out:json];
            node["amenity"="${type}"](around:25000, ${userLocation[0]}, ${userLocation[1]});
            out;
        `;
        let url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                clearMarkers();

                if (data.elements.length === 0) {
                    alert(`❌ No nearby ${type}s found within 25 km.`);
                    return;
                }

                let locationOptions = "";
                data.elements.forEach((element) => {
                    let lat = element.lat;
                    let lon = element.lon;
                    let name = element.tags.name || `${emoji} ${type.charAt(0).toUpperCase() + type.slice(1)}`;
                    let phone = element.tags.phone || "";

                    let marker = L.marker([lat, lon])
                        .addTo(map)
                        .bindPopup(`${emoji} ${name}`);
                    markers.push(marker);

                    locationOptions += `<option value="${lat},${lon},${phone}">${name}</option>`;
                });

                showLocationSelector(locationOptions, type);
            })
            .catch(() => alert("❌ Error fetching nearby locations. Try again later."));
    }

    // Location selector with call options
    function showLocationSelector(options, type) {
        const selectorDiv = document.createElement("div");
        selectorDiv.innerHTML = `
            <label for="locationSelect">Select a ${type} to navigate:</label>
            <select id="locationSelect">${options}</select>
            <button id="navigateButton">🚗 Navigate</button>
            <button id="callButton">📞 Call</button>
            <button id="videoCallButton">📹 Video Call</button>
        `;
        selectorDiv.style = "position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); padding: 10px; background-color: rgba(0,0,0,0.8); color: white; border: 1px solid white; border-radius: 10px;";
        document.body.appendChild(selectorDiv);

        document.getElementById("navigateButton").addEventListener("click", () => {
            const selectedData = document.getElementById("locationSelect").value.split(",");
            calculateRoute(parseFloat(selectedData[0]), parseFloat(selectedData[1]));
            document.body.removeChild(selectorDiv);
        });

        document.getElementById("callButton").addEventListener("click", () => {
            const phoneNumber = document.getElementById("locationSelect").value.split(",")[2];
            if (phoneNumber) window.location.href = `tel:${phoneNumber}`;
            else alert("❌ No phone number available.");
        });

        document.getElementById("videoCallButton").addEventListener("click", () => {
            const phoneNumber = document.getElementById("locationSelect").value.split(",")[2].replace(/\D/g, "");
            if (phoneNumber) window.open(`https://wa.me/${phoneNumber}?call&video=true`, "_blank");
            else alert("❌ No phone number available.");
        });
    }

    function clearMarkers() {
        markers.forEach(marker => map.removeLayer(marker));
        markers = [];
        if (routeLayer) map.removeLayer(routeLayer);
    }

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

    // Button event bindings
    document.getElementById("sosButton").addEventListener("click", sendEmergencyAlert);
    document.getElementById("medicalButton").addEventListener("click", () => fetchNearbyPlaces("hospital", "🏥"));
    document.getElementById("policeButton").addEventListener("click", () => fetchNearbyPlaces("police", "🚔"));
});
document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("sos-btn");e&&e.addEventListener("click",()=>{navigator.geolocation?navigator.geolocation.getCurrentPosition(o=>{const t=o.coords.latitude,n=o.coords.longitude,c="9030605034",a=`Emergency! 🚨\nI need immediate help. Here's my live location: https://www.google.com/maps?q=${t},${n}`,d=encodeURIComponent(a),i=`https://wa.me/91${c}?text=${d}`;window.open(i,"_blank")},()=>{alert("Location access denied or unavailable. Please enable GPS.")}):alert("Geolocation is not supported by your browser.")});
});
function logEmergency(type) {
    const phone = localStorage.getItem('currentUser');
    if (!phone) return;
  
    const logs = JSON.parse(localStorage.getItem('sosLogs')) || {};
    if (!logs[phone]) logs[phone] = [];
  
    logs[phone].push({
      type: type,
      time: new Date().toLocaleString()
    });
  
    localStorage.setItem('sosLogs', JSON.stringify(logs));
  }
  
  // Example usage
  document.getElementById('sos-medical').addEventListener('click', () => {
    logEmergency('Medical');
    alert('Medical SOS sent!');
  });
  // Firebase init (replace with your config)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-app.firebaseapp.com",
    projectId: "your-app",
    storageBucket: "your-app.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID"
  };
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const auth = firebase.auth();
  
  // Function to log actions
  function logEmergencyAction(buttonType) {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in first.");
      return;
    }
  
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const log = {
          userID: user.uid,
          email: user.email,
          buttonType,
          timestamp: new Date().toISOString(),
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        };
  
        db.collection("emergency_logs")
          .add(log)
          .then(() => console.log("Log added"))
          .catch((err) => console.error("Error logging action:", err));
      },
      (err) => {
        console.error("Geolocation error:", err);
        alert("Location access is required to log emergencies.");
      }
    );
  }
  
  // Attach to your buttons
  document.addEventListener("DOMContentLoaded", () => {
    const sosBtn = document.getElementById("sos-btn");
    const ambulanceBtn = document.getElementById("nearby-ambulance-btn");
  
    if (sosBtn) {
      sosBtn.addEventListener("click", () => {
        logEmergencyAction("SOS");
      });
    }
  
    if (ambulanceBtn) {
      ambulanceBtn.addEventListener("click", () => {
        logEmergencyAction("Nearby Hospital");
      });
    }
  });
  