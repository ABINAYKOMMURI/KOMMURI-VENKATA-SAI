document.addEventListener('DOMContentLoaded', function () {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = localStorage.getItem('currentUser');
    const users = JSON.parse(localStorage.getItem('users')) || {};
  
    // Redirect to login if not logged in
    if (!isLoggedIn || !currentUser || !users[currentUser]) {
      alert('Please log in first.');
      window.location.href = 'login.html';
      return;
    }
  
    const user = users[currentUser];
  
    // Set user info
    document.querySelectorAll('#user-name').forEach(el => el.textContent = user.name);
    document.querySelectorAll('#user-phone').forEach(el => el.textContent = currentUser);
  
    // Display SOS logs
    const allLogs = JSON.parse(localStorage.getItem('sosLogs')) || {};
    const logs = allLogs[currentUser] || [];
    const sosList = document.getElementById('sos-logs');
    sosList.innerHTML = '';
  
    if (logs.length === 0) {
      sosList.innerHTML = '<li class="list-group-item text-muted">No SOS history available.</li>';
    } else {
      logs.slice().reverse().forEach(log => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = `${log.name} (${log.phone}) pressed ${log.type} at ${log.time}`;
        sosList.appendChild(li);
      });
    }
  
    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
      });
    }
  
    // Toggle dark mode
    const toggleThemeBtn = document.getElementById('toggle-theme');
    if (toggleThemeBtn) {
      toggleThemeBtn.addEventListener('click', () => {
        document.body.classList.toggle('bg-dark');
        document.body.classList.toggle('text-white');
      });
    }
  
    // Load child lock status (optional)
    const childLock = document.getElementById('child-lock');
    const childLockStatus = localStorage.getItem(`childLock_${currentUser}`);
    if (childLockStatus === 'true') {
      childLock.checked = true;
    }
  
    childLock.addEventListener('change', () => {
      localStorage.setItem(`childLock_${currentUser}`, childLock.checked.toString());
    });
  });
  
// Function to log SOS button press in other pages like police, ambulance, etc.
function logSOSButtonPress(emergencyType) {
    const currentUser = localStorage.getItem('currentUser');
    const users = JSON.parse(localStorage.getItem('users')) || {};
    const user = users[currentUser];

    if (user) {
      // Collect SOS log details
      const log = {
        name: user.name,
        phone: currentUser,
        type: emergencyType,
        time: new Date().toLocaleString()
      };

      // Retrieve existing logs from localStorage
      const allLogs = JSON.parse(localStorage.getItem('sosLogs')) || {};
      const userLogs = allLogs[currentUser] || [];

      // Add the new log
      userLogs.push(log);

      // Save the updated logs back to localStorage
      allLogs[currentUser] = userLogs;
      localStorage.setItem('sosLogs', JSON.stringify(allLogs));

      // Optionally, alert user or provide feedback
      alert(`${emergencyType} SOS button pressed!`);
    }
  }

// Example: Police Button press handler
document.getElementById('police-btn')?.addEventListener('click', function() {
    logSOSButtonPress('Police');
});

// Example: Ambulance Button press handler
document.getElementById('ambulance-btn')?.addEventListener('click', function() {
    logSOSButtonPress('Ambulance');
});

// Example: Other Emergency Button press handler
document.getElementById('other-btn')?.addEventListener('click', function() {
    logSOSButtonPress('Other Emergency');
});
document.addEventListener('DOMContentLoaded', function () {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = localStorage.getItem('currentUser');
    const users = JSON.parse(localStorage.getItem('users')) || {};
  
    // Redirect to login if not logged in
    if (!isLoggedIn || !currentUser || !users[currentUser]) {
      alert('Please log in first.');
      window.location.href = 'login.html';
      return;
    }
  
    const user = users[currentUser];
  
    // Set user info
    document.querySelectorAll('#user-name').forEach(el => el.textContent = user.name);
    document.querySelectorAll('#user-phone').forEach(el => el.textContent = currentUser);
  
    // Display SOS logs
    const allLogs = JSON.parse(localStorage.getItem('sosLogs')) || {};
    const logs = allLogs[currentUser] || [];
    const sosList = document.getElementById('sos-logs');
    sosList.innerHTML = '';
  
    if (logs.length === 0) {
      sosList.innerHTML = '<li class="list-group-item text-muted">No SOS history available.</li>';
    } else {
      logs.slice().reverse().forEach(log => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = `${log.name} (${log.phone}) pressed ${log.type} at ${log.time}`;
        sosList.appendChild(li);
      });
    }
  
    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
      });
    }
  
    // Toggle dark mode
    const toggleThemeBtn = document.getElementById('toggle-theme');
    if (toggleThemeBtn) {
      toggleThemeBtn.addEventListener('click', () => {
        document.body.classList.toggle('bg-dark');
        document.body.classList.toggle('text-white');
      });
    }
  
    // Load child lock status (optional)
    const childLock = document.getElementById('child-lock');
    const childLockStatus = localStorage.getItem(`childLock_${currentUser}`);
    if (childLockStatus === 'true') {
      childLock.checked = true;
    }
  
    childLock.addEventListener('change', () => {
      localStorage.setItem(`childLock_${currentUser}`, childLock.checked.toString());
    });
  });
  
// Function to log SOS button press in other pages like police, ambulance, etc.
function logSOSButtonPress(emergencyType) {
    const currentUser = localStorage.getItem('currentUser');
    const users = JSON.parse(localStorage.getItem('users')) || {};
    const user = users[currentUser];

    if (user) {
      // Collect SOS log details
      const log = {
        name: user.name,
        phone: currentUser,
        type: emergencyType,
        time: new Date().toLocaleString()
      };

      // Retrieve existing logs from localStorage
      const allLogs = JSON.parse(localStorage.getItem('sosLogs')) || {};
      const userLogs = allLogs[currentUser] || [];

      // Add the new log
      userLogs.push(log);

      // Save the updated logs back to localStorage
      allLogs[currentUser] = userLogs;
      localStorage.setItem('sosLogs', JSON.stringify(allLogs));

      // Optionally, alert user or provide feedback
      alert(`${emergencyType} SOS button pressed!`);
    }
  }

// Example: Police Button press handler
document.getElementById('police-btn')?.addEventListener('click', function() {
    logSOSButtonPress('Police');
});

// Example: Ambulance Button press handler
document.getElementById('ambulance-btn')?.addEventListener('click', function() {
    logSOSButtonPress('Ambulance');
});

// Example: Other Emergency Button press handler
document.getElementById('other-btn')?.addEventListener('click', function() {
    logSOSButtonPress('Other Emergency');
});
document.addEventListener('DOMContentLoaded', function () {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = localStorage.getItem('currentUser');
    const users = JSON.parse(localStorage.getItem('users')) || {};
  
    // Redirect to login if not logged in
    if (!isLoggedIn || !currentUser || !users[currentUser]) {
      alert('Please log in first.');
      window.location.href = 'login.html';
      return;
    }
  
    const user = users[currentUser];
  
    // Set user info
    document.querySelectorAll('#user-name').forEach(el => el.textContent = user.name);
    document.querySelectorAll('#user-phone').forEach(el => el.textContent = currentUser);
  
    // Display SOS logs
    const allLogs = JSON.parse(localStorage.getItem('sosLogs')) || {};
    const logs = allLogs[currentUser] || [];
    const sosList = document.getElementById('sos-logs');
    sosList.innerHTML = '';
  
    if (logs.length === 0) {
      sosList.innerHTML = '<li class="list-group-item text-muted">No SOS history available.</li>';
    } else {
      logs.slice().reverse().forEach(log => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = `${log.name} (${log.phone}) pressed ${log.type} at ${log.time}`;
        sosList.appendChild(li);
      });
    }
  
    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
      });
    }
  
    // Toggle dark mode
    const toggleThemeBtn = document.getElementById('toggle-theme');
    if (toggleThemeBtn) {
      toggleThemeBtn.addEventListener('click', () => {
        document.body.classList.toggle('bg-dark');
        document.body.classList.toggle('text-white');
      });
    }
  
    // Load child lock status (optional)
    const childLock = document.getElementById('child-lock');
    const childLockStatus = localStorage.getItem(`childLock_${currentUser}`);
    if (childLockStatus === 'true') {
      childLock.checked = true;
    }
  
    childLock.addEventListener('change', () => {
      localStorage.setItem(`childLock_${currentUser}`, childLock.checked.toString());
    });
  });
  
// Function to log SOS button press in other pages like police, ambulance, etc.
function logSOSButtonPress(emergencyType) {
    const currentUser = localStorage.getItem('currentUser');
    const users = JSON.parse(localStorage.getItem('users')) || {};
    const user = users[currentUser];

    if (user) {
      // Collect SOS log details
      const log = {
        name: user.name,
        phone: currentUser,
        type: emergencyType,
        time: new Date().toLocaleString()
      };

      // Retrieve existing logs from localStorage
      const allLogs = JSON.parse(localStorage.getItem('sosLogs')) || {};
      const userLogs = allLogs[currentUser] || [];

      // Add the new log
      userLogs.push(log);

      // Save the updated logs back to localStorage
      allLogs[currentUser] = userLogs;
      localStorage.setItem('sosLogs', JSON.stringify(allLogs));

      // Optionally, alert user or provide feedback
      alert(`${emergencyType} SOS button pressed!`);
    }
  }

// Example: Police Button press handler
document.getElementById('police-btn')?.addEventListener('click', function() {
    logSOSButtonPress('Police');
});

// Example: Ambulance Button press handler
document.getElementById('ambulance-btn')?.addEventListener('click', function() {
    logSOSButtonPress('Ambulance');
});

// Example: Other Emergency Button press handler
document.getElementById('other-btn')?.addEventListener('click', function() {
    logSOSButtonPress('Other Emergency');
});
document.addEventListener('DOMContentLoaded', function () {
    const childLockCheckbox = document.getElementById('child-lock');
    const sosButton = document.getElementById('sos-btn');
    const childLockModal = new bootstrap.Modal(document.getElementById('childLockModal'));
  
    // Check the status of the child lock on page load
    if (childLockCheckbox.checked) {
      sosButton.disabled = true; // Disable SOS button if child lock is on
    }
  
    // Listen for child lock checkbox change
    childLockCheckbox.addEventListener('change', function () {
      if (childLockCheckbox.checked) {
        sosButton.disabled = true; // Disable SOS button if child lock is on
      } else {
        sosButton.disabled = false; // Enable SOS button if child lock is off
      }
    });
  
    // SOS Button click event
    sosButton.addEventListener('click', function () {
      if (childLockCheckbox.checked) {
        // Show modal if child lock is enabled and SOS is attempted
        childLockModal.show();
      } else {
        // Proceed with SOS functionality here
        alert('SOS sent!');
      }
    });
  });
  