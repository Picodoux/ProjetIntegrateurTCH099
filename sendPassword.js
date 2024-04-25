document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('forgotPasswordForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        sendPasswordResetEmail(email);
    });
});

function sendPasswordResetEmail(email) {
    const baseURL = 'http://144.217.83.146:8080'; //a remplacer quand on a le serveur
    fetch(`${baseURL}/user/sendPassword`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
    })
    .then(response => response.json())
    .then(data => {
        displayMessage(data);
    })
    .catch(error => {
        console.error('Error sending password reset email:', error);
        displayMessage({
            code: "500",
            message: "There was an error processing your request. Please try again later."
        });
    });
}

function displayMessage(data) {
    const messageElement = document.getElementById('message');
    switch (data.code) {
        case "0":
            messageElement.textContent = "Password reset email has been sent.";
            messageElement.style.color = "green";
            break;
        case "1":
            messageElement.textContent = "Invalid Email.";
            messageElement.style.color = "red";
            break;
        case "2":
            messageElement.textContent = "Email is not verified. For you to be able to reset the password, you must verify your email first.";
            messageElement.style.color = "red";
            break;
        case "3":
            messageElement.textContent = "One of the values to send the email is invalid.";
            messageElement.style.color = "red";
            break;
        default:
            messageElement.textContent = "Unexpected error. Please try again.";
            messageElement.style.color = "red";
            break;
    }
}
