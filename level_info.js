document.addEventListener('DOMContentLoaded', function() {
    updateMenuProfile();
    updateLevelDetails();
    fetchComments();
    attachCommentFormHandler();
});

function attachCommentFormHandler() {
    const form = document.getElementById('comment-form');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const commentText = document.getElementById('comment-text').value.trim();

            if (!commentText) {
                alert("Le commentaire ne peut pas être vide.");
                return;
            }

            submitComment(commentText);  // Appeler la fonction de soumission du commentaire
        });
    }
}

function submitComment(commentText) {
    const ownerId = localStorage.getItem('user_id');
    const mapId = getLevelIdFromURL();

    postComment(ownerId, mapId, commentText)  // Appel de l'API pour publier le commentaire
        .then(() => {
            fetchComments();  // Recharger les commentaires après soumission
        })
        .catch(error => {
            console.error('Erreur lors de la publication du commentaire:', error);
            alert("Erreur lors de la publication du commentaire.");
        });
}

function fetchComments() {
    const levelId = getLevelIdFromURL();
    
    fetch('http://144.217.83.146:8080/map/allComments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mapId: levelId }) 
    })
    .then(response => response.json())
    .then(data => {
        if (Array.isArray(data)) {
            data.forEach(comment => {
                const commentElement = createCommentElement(comment); 
                const commentsSection = document.querySelector('.comments-section');
                commentsSection.appendChild(commentElement); 
            });
        } else if (data.code === "1") {
            console.error('Map not found with the provided ID');
        }
    })
    .catch(error => {
        console.error('Erreur lors de la récupération des commentaires:', error); 
    });
}

function postComment(ownerId, mapId, commentText) {
    return fetch('http://144.217.83.146:8080/thread/comment/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ownerId: ownerId,
            mapId: mapId,
            value: commentText
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.code === "0") {
            console.log("Commentaire posté avec succès!");
        } else if (data.code === "1") {
            console.error("Utilisateur ou niveau introuvable.");
            throw new Error("Utilisateur ou niveau introuvable.");
        } else if (data.code === "3") {
            console.error("Les valeurs fournies sont invalides.");
            throw new Error("Les valeurs fournies sont invalides.");
        }
    });
}

function updateMenuProfile() {
    const username = localStorage.getItem('username'); 
    const password = localStorage.getItem('password'); 
    
    const loginButton = document.getElementById('loginButton'); 
    const profileIcon = document.querySelector('.icone-profil'); 
    const menuOptions = document.querySelector('.menu-options'); 
    
    if (username && password) {
        loginButton.style.display = 'none'; 
        profileIcon.style.display = 'block'; 
    } else {
        loginButton.style.display = 'block'; 
        profileIcon.style.display = 'none'; 
        menuOptions.style.display = 'none';

        loginButton.addEventListener('click', function() {
            window.location.href = 'login.html';
        });
    }
}

function createCommentElement(comment) {
    const { ownerName, ownerProfilePicture, value } = comment; // Récupérer les propriétés du commentaire
    
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment';

    const profilePic = document.createElement('img'); 
    profilePic.src = ownerProfilePicture; 
    profilePic.alt = `${ownerName}'s Profile Picture`; 
    profilePic.className = 'profile-pic'; 

    const commentBody = document.createElement('div');
    commentBody.className = 'comment-body';

    const commentContent = document.createElement('div');
    commentContent.className = 'comment-content';

    const commentAuthor = document.createElement('h3');
    commentAuthor.textContent = ownerName;

    const commentText = document.createElement('p');
    commentText.textContent = value;

    commentContent.appendChild(commentAuthor);
    commentContent.appendChild(commentText);
    commentBody.appendChild(commentContent);

    commentDiv.appendChild(profilePic);
    commentDiv.appendChild(commentBody);

    return commentDiv;
}

function getLevelIdFromURL() {
    const queryString = window.location.search; 
    const urlParams = new URLSearchParams(queryString); 
    return urlParams.get('id'); 
}

function createComment(username, title, text) {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment';

    const profilePic = document.createElement('img');
    profilePic.src = '../img/joobi.png'; 
    profilePic.alt = 'Profile Picture';
    profilePic.className = 'profile-pic';

    const commentBody = document.createElement('div');
    commentBody.className = 'comment-body';

    const commentContent = document.createElement('div');
    commentContent.className = 'comment-content';

    const commentAuthor = document.createElement('h3');
    commentAuthor.textContent = username;

    const commentTitle = document.createElement('h4');
    commentTitle.textContent = title;

    const commentText = document.createElement('p');
    commentText.textContent = text;

    const commentActions = document.createElement('div');
    commentActions.className = 'comment-actions';

    commentContent.appendChild(commentAuthor);
    commentContent.appendChild(commentTitle);
    commentContent.appendChild(commentText);
    commentBody.appendChild(commentContent);
    commentBody.appendChild(commentActions);
    commentDiv.appendChild(profilePic);
    commentDiv.appendChild(commentBody);

    return commentDiv;
}

function updateLevelDetails() {

    const levelName = localStorage.getItem('levelName');
    const ownerName = localStorage.getItem('ownerName');
    const ownerProfilePicture = localStorage.getItem('ownerProfilePicture');
    const levelDifficulty = localStorage.getItem('levelDifficulty');

    document.querySelector('.level-details h1').textContent = `Informations sur le niveau: ${levelName}`;
    document.querySelector('.level-details p:nth-child(2)').innerHTML = `<strong>Auteur:</strong> ${ownerName}`;
    document.querySelector('.level-details p:nth-child(3)').innerHTML = `<strong>Difficulté:</strong> ${levelDifficulty}`;

    if (ownerProfilePicture) {
        const profileImage = document.createElement('img');
        profileImage.src = ownerProfilePicture;
        profileImage.alt = "Profile Picture of Level Creator";
        profileImage.className = 'profile-pic'; 

        const profilePicContainer = document.createElement('div');
        profilePicContainer.appendChild(profileImage);

        const levelHeader = document.querySelector('.level-details');
        levelHeader.insertBefore(profilePicContainer, levelHeader.firstChild);
    }

    const downloadButton = document.querySelector('.level-details button.download-button');
    const downloadUrl = localStorage.getItem('downloadUrl'); 
    if (downloadButton && downloadUrl) {
        downloadButton.setAttribute('onclick', `location.href='${downloadUrl}'`);
    }
}
