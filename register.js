/* SCRIPT NON FONCTIONNEL POUR LE MOMENT, AUCUN SERVEUR 
   POUR SE CONNECTER A L'API, NOUS ALLONS SIMULER QUE LE REGISTER
   S'EST BIEN FONCTIONNÉ */

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
           const response = await fetch(`http://144.217.83.146:8080/register`, { // Utilisation de baseURL
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
		   alert(response.message || "Vous êtes bien enregistré !");
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
   
/* 
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const messageContainer = document.createElement('div');

    messageContainer.setAttribute('id', 'message-container');
    document.body.appendChild(messageContainer);

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const email = document.getElementById('email').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password !== confirmPassword) {
            displayMessage('Les mots de passe ne correspondent pas.', 'error');
            return;
        }

        // Stockage dans localStorage
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);  // À noter: stocker des mots de passe en clair dans localStorage n'est pas sécurisé.
        localStorage.setItem('email', email);

        displayMessage('Compte créé avec succès !', 'success');
        
        form.reset();
    });

    function displayMessage(message, type) {
        messageContainer.textContent = message;
        messageContainer.style.color = type === 'error' ? 'red' : 'green';
    }
});
 */