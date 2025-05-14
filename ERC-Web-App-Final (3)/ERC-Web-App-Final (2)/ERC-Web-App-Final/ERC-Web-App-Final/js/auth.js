// auth.js - Handle Sign In and Sign Up (using localStorage or Firebase placeholder)
var users = JSON.parse(localStorage.getItem('users')) || {};

document.addEventListener('DOMContentLoaded', function() {
    // Sign In form
    var signInForm = document.getElementById('sign-in-form');
    if (signInForm) {
        signInForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var phone = document.getElementById('sign-in-phone').value;
            var password = document.getElementById('sign-in-password').value;
            if (users[phone] && users[phone].password === password) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', phone);
                alert('Sign in successful! Redirecting...');
                window.location.href = 'index.html';
            } else {
                alert('Invalid phone number or password.');
            }
            /*
            // Firebase Authentication example:
            // firebase.auth().signInWithEmailAndPassword(email, password)
            //   .then(user => { ... })
            //   .catch(error => console.error(error));
            */
        });
    }

    // Sign Up form
    var signUpForm = document.getElementById('sign-up-form');
    if (signUpForm) {
        signUpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var name = document.getElementById('sign-up-name').value;
            var phone = document.getElementById('sign-up-phone').value;
            var password = document.getElementById('sign-up-password').value;
            var confirmPassword = document.getElementById('sign-up-password-confirm').value;

            if (password !== confirmPassword) {
                alert('Passwords do not match.');
                return;
            }
            if (users[phone]) {
                alert('User already exists. Please log in.');
                return;
            }
            users[phone] = { name: name, password: password };
            localStorage.setItem('users', JSON.stringify(users));
            alert('Sign up successful! Please sign in.');
            window.location.href = 'login.html';
            /*
            // Firebase Authentication example:
            // firebase.auth().createUserWithEmailAndPassword(email, password)
            //   .then(user => { ... })
            //   .catch(error => console.error(error));
            */
        });
    }
});
