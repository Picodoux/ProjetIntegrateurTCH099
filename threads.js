document.addEventListener('DOMContentLoaded', function() {
    updateMenuProfile();
    fetchThreads();
    attachFormSubmitAction();
});

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

function attachFormSubmitAction() {
    const form = document.getElementById('threadForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const title = document.getElementById('threadTitle').value.trim();
            const content = document.getElementById('threadContent').value.trim();
            if (title && content) {
                const ownerId = localStorage.getItem('user_id');  //Devoir changer ca, car le api de post thread demande uid, mais mieux si username + pw.
                const username = localStorage.getItem('username');  // localstorage aura username storé le pseudo
                const profilePicture = localStorage.getItem('profilePicture') || 'defaultpfp.jpg';  // localstorage pt store pfp? 
                postThread(ownerId, username, profilePicture, title, content);
            } else {
                console.log("Title or content cannot be empty");
            }
        });
    } else {
        console.log("Form not found");
    }
}

function fetchThreads() {
    fetch('http://144.217.83.146:8080/thread/all') 
        .then(response => response.json())
        .then(threads => {
            
            const thread_example = document.querySelector('.thread-item-example'); 
            thread_example.style.display = 'none'; 

            threads.forEach(thread => {
                fetchLikesForThread(thread.id) 
                    .then(likes => {
                        displayThread(thread, likes); 
                    });
            });
        })
        .catch(error => console.error('Error fetching threads:', error));
}

function fetchLikesForThread(threadID) {
    return fetch(`http://144.217.83.146:8080/thread/allLikes`, {
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
            return data.length; 
        } else if (typeof data === 'object') { 
            return Object.keys(data).length; 
        } else {
            console.error('Unexpected data type:', typeof data);
            return -1;
        }
    })
    .catch(error => {
        console.error('Error fetching like count:', error); 
        return -1; 
    });
}


function postThread(ownerId, username, profilePicture, title, content) {
    fetch('http://144.217.83.146:8080/thread/create', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ownerId: ownerId,
            title: title,
            value: content
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.code === "0") {
            const now = new Date().toLocaleString("fr-FR");
            const newThread = {
                title: title,
                value: content,
                created: now,
                username: username,
                profilePicture: profilePicture,
                id : id
            };
            displayThread(newThread); 
            document.getElementById('threadTitle').value = '';
            document.getElementById('threadContent').value = '';
            console.log('Thread created successfully');
        } else {
            console.error('Failed to create thread:', data.message);
        }
    })
    .catch(error => console.error('Error posting thread:', error));
}

function createThreadElement(title, content, created, username, profilePicture, forumThreadId, likeCount) {
    const threadDiv = document.createElement('div');
    threadDiv.classList.add('thread-item');
    threadDiv.setAttribute('data-thread-id', forumThreadId);

    const threadTitle = document.createElement('h3');
    threadTitle.classList.add('thread-title');
    threadTitle.textContent = title;

    const threadContent = document.createElement('p');
    threadContent.classList.add('thread-content');
    threadContent.textContent = content;

    const threadInfo = document.createElement('div');
    threadInfo.classList.add('thread-info');
    threadInfo.innerHTML = `<span>Posted by: <strong>${username}</strong> at ${created}</span> <img src="${profilePicture}" alt="Profile Image" class="profile-picture">`;

    const likeInfo = document.createElement('span'); 
    likeInfo.classList.add('like-info');
    likeInfo.textContent = `Likes: ${likeCount}`;

    const likeButton = document.createElement('button');
    likeButton.classList.add('like-button');
    likeButton.textContent = 'Like'; 
    likeButton.addEventListener('click', likeThread); 

    const openThreadButton = document.createElement('a');
    openThreadButton.classList.add('open-thread-button');
    openThreadButton.textContent = 'Ouvrir le Thread';
    openThreadButton.href = `view_thread.html?threadID=${forumThreadId}`;

    threadDiv.appendChild(threadTitle);
    threadDiv.appendChild(threadContent);
    threadDiv.appendChild(threadInfo);
    threadDiv.appendChild(likeInfo); 
    threadDiv.appendChild(likeButton); 
    threadDiv.appendChild(openThreadButton); 

    return threadDiv;
}

function likeThread() {
    const threadDiv = this.parentElement; 
    const forumThreadId = threadDiv.getAttribute('data-thread-id'); 
    const ownerId = localStorage.getItem('user_id'); 

    fetch('http://144.217.83.146:8080/thread/like', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ownerId: ownerId,
            forumThreadId: forumThreadId
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.code === "1") {
            console.error(data.message);
            alert(data.message); 
        } else if (data.code === "2") {
            alert('Vous avez déjà liké ce thread.'); 
        } else if (data.code === "0") {
            alert('Merci pour votre like!');
        }
    })
    .catch(error => {
        console.error('Erreur lors du like:', error); 
    });
}


function displayThread(thread, likeCount) {
    const { title, value: content, created, username, profilePicture, id } = thread;
    const profileImage = profilePicture || 'defaultpfp.jpg';
    const threadDiv = createThreadElement(title, content, new Date(created).toLocaleString(), username, profileImage, id, likeCount);
    document.getElementById('threadsList').appendChild(threadDiv);
}