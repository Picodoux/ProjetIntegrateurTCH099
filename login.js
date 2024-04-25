document.addEventListener('DOMContentLoaded', function() {
    const baseURL = 'http://144.217.83.146:8080';
    const loginForm = document.querySelector('form');
    const errorContainer = document.getElementById('errorContainer');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = encodeURIComponent(document.getElementById('username').value);
        const password = encodeURIComponent(document.getElementById('password').value);

        const url = new URL(`${baseURL}/login`);
        url.search = new URLSearchParams({ username, password }).toString();

        // The fetch call should start here, using POST method for login
        fetch(url, {
            method: 'POST', // Assuming that the login should be a POST request
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
        .then(data => handleResponse(data))
        .catch(error => {
            console.error('Error:', error);
            displayError('A network error occurred. Please try again.');
        });
    });

    function handleResponse(data) {
        switch(data.code) {
            case "0":
                console.log('Login successful:', data.data);
                localStorage.setItem('username', JSON.stringify(data.data.username)); // Store user session
				
                localStorage.setItem('password', JSON.stringify(data.data.password)); // Store user session
				
				localStorage.setItem('joinDate', JSON.stringify(data.data.userSince)); // Store user session
				
				localStorage.setItem('bio', JSON.stringify(data.data.bio)); // Store user session
				
                localStorage.setItem('user_id', JSON.stringify(data.data.id)); // Store user session
				
				localStorage.setItem('profilePicture', JSON.stringify(data.data.profilePicture)); // Store user session
				
                localStorage.setItem('email', JSON.stringify(data.data.email)); // Store user session
                window.location.href = '/index.html'; // Redirect to home after login
                break;
            case "1":
                displayError('User not found');
                break;
            case "2":
                displayError('Invalid password');
                break;
            case "3":
                displayError('One of the values to login the user is invalid.');
                break;
            default:
                displayError('An unexpected error occurred');
        }
    }

    function displayError(message) {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
    }
});
