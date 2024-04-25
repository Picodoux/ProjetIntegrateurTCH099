document.addEventListener('DOMContentLoaded', function() {
    updateMenuProfile();

    const threadID = getQueryParam('threadID');

    if (threadID) {
        fetchAllComments(threadID); 
        attachCommentFormHandler(threadID); 
    } else {
        console.error("Thread ID is missing");
    }
});

function attachCommentFormHandler(threadID) {
    const commentForm = document.getElementById('commentForm'); 
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            const commentContent = document.getElementById('commentContent').value.trim(); // Récupérer le texte du commentaire

            if (commentContent) { 
                postComment(threadID, commentContent); 
            } else {
                alert("Le commentaire ne peut pas être vide."); 
            }
        });
    }
}


function postComment(threadID, commentContent) {
    const ownerId = localStorage.getItem('user_id'); 

    fetch(`http://144.217.83.146:8080/thread/comment/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ownerId: ownerId,
            threadId: threadID,
            value: commentContent
        })
    })
    .then(response => response.json()) 
    .then(data => {
        if (data.code === "0") {
            alert("Commentaire posté avec succès!"); 
        } else if (data.code === "1") {
            alert("Utilisateur ou thread introuvable."); 
        } else if (data.code === "3") {
            alert("Les valeurs fournies sont invalides."); 
        }
    })
    .catch(error => {
        console.error("Erreur lors du post de commentaire:", error); 
    });
}


function getQueryParam(param) {
    const queryString = window.location.search; 
    const urlParams = new URLSearchParams(queryString); 
    return urlParams.get(param);
}

function fetchAllComments(threadID) {
    fetch('http://144.217.83.146:8080/thread/allComments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            forumThreadId: threadID 
        })
    })
    .then(response => response.json()) 
    .then(data => {
        if (Array.isArray(data)) {
            data.forEach(comment => {
                displayComment(comment); 
            });
        } else if (data.code === "1") {
            console.error(data.message); 
        }
    })
    .catch(error => {
        console.error('Erreur lors de la récupération des commentaires:', error); 
    });
}

function displayComment(comment) {
    const { ownerName, ownerProfilePicture, value } = comment; 

    const commentsList = document.getElementById('commentsList'); 
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment-item'; 

    const profileImage = document.createElement('img'); 
    profileImage.src = ownerProfilePicture; 
    profileImage.alt = `${ownerName}'s Profile Picture`;
    profileImage.className = 'profile-picture-small';

    const userName = document.createElement('span');
    userName.className = 'comment-username';
    userName.textContent = ownerName;

    const commentContent = document.createElement('p'); 
    commentContent.className = 'comment-content';
    commentContent.textContent = value;

    commentDiv.appendChild(profileImage); 
    commentDiv.appendChild(userName); 
    commentDiv.appendChild(commentContent); 
    commentsList.appendChild(commentDiv);
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