document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const successDiv = document.getElementById('login-success');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        if (username === 'admin' && password === 'traffic123') {
            // Show success message
            successDiv.textContent = "Login successful!";
            successDiv.style.color = "green";
            successDiv.style.display = "block";
            // Optionally set login state
            localStorage.setItem('loggedIn', 'true');
            // Redirect after 1 second
            setTimeout(function() {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            alert('Invalid username or password. Please try again.');
            document.getElementById('password').value = '';
            document.getElementById('username').focus();
        }
    });
});