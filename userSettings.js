document.addEventListener('DOMContentLoaded', function() {
    const bioForm = document.getElementById('bioForm');
    const profilePictureForm = document.getElementById('profilePictureForm');
    const messageContainer = document.getElementById('messageContainer');


    bioForm.addEventListener('submit', function(event) {
        event.preventDefault();
        updateBio();
    });

    profilePictureForm.addEventListener('submit', function(event) {
        event.preventDefault();
        updateProfilePicture();
    });
});

function updateBio() {
    const bio = document.getElementById('bio').value;

    fetch('/user/updateBio', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bio: bio })
    })
    .then(response => response.json())
    .then(data => {
        if (data.code === 0) {
            alert('Biographie mise à jour avec succès.');
        } else {
            alert('Erreur: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Erreur lors de la mise à jour de la biographie:', error);
        alert('Erreur lors de la connexion au serveur.');
    });
}

function updateProfilePicture() {
    const inputElement = document.getElementById('profilePicture');
    const file = inputElement.files[0];

    if (!file) {
        alert('Please select a file.');
        return;
    }

    // Check if the file is a PNG.
    if (file.type !== "image/png") {
        alert('Only PNG files are allowed.');
        return;
    }

    // Retrieve user's ID from localStorage or any other storage you use
    const user_id = localStorage.getItem('user_id'); // Adjust according to where/how you store the user ID
    if (!user_id) {
        alert('User ID not found. Please ensure you are logged in.');
        return;
    }

    // Set file name as User ID with PNG extension
    const newFileName = user_id + '.png';

    const formData = new FormData();
    formData.append('file', file, newFileName);
    formData.append('id', user_id);

    fetch('http://144.217.83.146:8080/user/changeProfilePicture', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => handleProfilePictureResponse(data))
    .catch(error => {
        console.error('Erreur lors de la mise à jour de la photo de profil:', error);
        alert('Erreur lors de la connexion au serveur.');
    });
}

function handleProfilePictureResponse(data) {
    const messageContainer = document.getElementById('messageContainer'); // Ensure this element exists in your HTML

    switch (data.code) {
        case "0":
            console.log('Profile picture updated successfully');
            alert('Profile picture has been changed.');
            break;
        case "1":
            console.error('User not found');
            messageContainer.textContent = 'User not found';
            break;
        case "2":
            console.error('An issue has occurred');
            messageContainer.textContent = 'An issue has occurred. Please try again.';
            break;
        case "3":
            console.error('Invalid input');
            messageContainer.textContent = 'One of the values to change the user\'s profile picture is invalid.';
            break;
        default:
            console.error('An unexpected error occurred');
            messageContainer.textContent = 'An unexpected error occurred. Please contact support.';
    }

    // Update the UI to show the message
    messageContainer.style.display = 'block';
}
