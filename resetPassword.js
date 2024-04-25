document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('resetPasswordForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        if (newPassword === confirmPassword) {
            const token = new URLSearchParams(window.location.search).get('token');
            if (token) {
                resetPassword(token, newPassword);
            } else {
                displayMessage("No reset token found. Please check your link and try again.", "red");
            }
        } else {
            displayMessage("Passwords do not match. Please try again.", "red");
        }
    });
});

function resetPassword(token, password) {
    const baseURL = 'http://144.217.83.146:8080'; //a remplacer quand on a le serveur
    fetch(`${baseURL}/user/resetPassword`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: token,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.code === "0") {
            displayMessage("Password has been reset.", "green");
            // possible a faire : redirect le user a une autre page avec un timeout ? 
        } else {
            displayMessage(data.message, "red");
        }
    })
    .catch(error => {
        console.error('Error resetting password:', error);
        displayMessage("Failed to reset password due to a network error. Please try again later.", "red");
    });
}

function displayMessage(message, color) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.style.color = color;
}
