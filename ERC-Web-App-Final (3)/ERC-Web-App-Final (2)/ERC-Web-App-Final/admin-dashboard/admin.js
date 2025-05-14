const firebaseConfig = {
  apiKey: "AIzaSyDndN59Oak3il9sisVV88wk_4NtvIb2Tuw",
  authDomain: "emergencydashboard-7bad3.firebaseapp.com",
  projectId: "emergencydashboard-7bad3",
  storageBucket: "emergencydashboard-7bad3.firebasestorage.app",
  messagingSenderId: "72234513825",
  appId: "1:72234513825:web:ee7bd84ef1d84358d207e0",
  measurementId: "G-PGY3C4Q7VQ"
};

firebase.initializeApp(firebaseConfig);

function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      document.getElementById('login-form').style.display = 'none';
      document.getElementById('dashboard').style.display = 'block';
      fetchData();
    })
    .catch(error => {
      alert("Login failed: " + error.message);
    });
}

function fetchData() {
  fetch('http://localhost:3000/emergencies')
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector('#data-table tbody');
      tbody.innerHTML = '';
      data.forEach(entry => {
        const row = `<tr>
          <td>${entry.userName}</td>
          <td>${entry.time}</td>
          <td>${entry.location}</td>
          <td>${entry.emergencyType}</td>
        </tr>`;
        tbody.innerHTML += row;
      });
    });
}
