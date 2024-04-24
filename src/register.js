const form = document.querySelector('form');
const messageContainer = document.createElement('div');

messageContainer.setAttribute('id', 'message-container');
document.body.appendChild(messageContainer);

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        displayMessage('Les mots de passe ne correspondent pas.', 'error');
        return;
    }

    const user = {
        username: username,
        password: password,
        email: email
    };

    try {
        const response = await fetch('{baseURL}/register', { //a remplacer avec le bon lien
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erreur inconnue');
        }

        displayMessage(data.message, 'success');
        
        form.reset();
    } catch (error) {
        displayMessage(error.message, 'error');
    }
});

function displayMessage(message, type) {
    const messageParagraph = document.createElement('p');
    messageParagraph.textContent = message;

    if (type === 'error') {
        messageParagraph.style.color = 'red';
    } else {
    messageParagraph.style.color = 'green';
    }

    const messageContainer = document.getElementById('message-container');
    messageContainer.innerHTML = '';
    messageContainer.appendChild(messageParagraph);
}
