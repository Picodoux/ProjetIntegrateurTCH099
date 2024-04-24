document.addEventListener('DOMContentLoaded', function() {
    const saveChangesButton = document.getElementById('saveChangesButton');
    saveChangesButton.addEventListener('click', updateBio);
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
