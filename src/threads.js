document.addEventListener('DOMContentLoaded', function() {
    fetchThreads(); // Fetch existing threads from the server
    attachFormSubmitAction();
});

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
    fetch('http://{baseurl}:8080/thread/all')  // Remplacer base url avec notre futur site
        .then(response => response.json())
        .then(threads => {
            threads.forEach(thread => {
                displayThread(thread);
            });
        })
        .catch(error => console.error('Error fetching threads:', error));
}

function postThread(ownerId, username, profilePicture, title, content) {
    fetch('http://{baseurl}:8080/thread/create', {  // API endpoint for creating a thread
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
                profilePicture: profilePicture
            };
            displayThread(newThread);  // Call displayThread to visually add the thread to the list
            document.getElementById('threadTitle').value = '';
            document.getElementById('threadContent').value = '';
            console.log('Thread created successfully');
        } else {
            console.error('Failed to create thread:', data.message);
        }
    })
    .catch(error => console.error('Error posting thread:', error));
}

function createThreadElement(title, content, created, username, profilePicture, forumThreadId) {
    const threadDiv = document.createElement('div');
    threadDiv.classList.add('thread-item');
    threadDiv.setAttribute('data-thread-id', forumThreadId);  // Store thread ID for use in like feature

    const threadTitle = document.createElement('h3');
    threadTitle.classList.add('thread-title');
    threadTitle.textContent = title;

    const threadContent = document.createElement('p');
    threadContent.classList.add('thread-content');
    threadContent.textContent = content;

    const threadInfo = document.createElement('div');
    threadInfo.classList.add('thread-info');
    threadInfo.innerHTML = `<span>Posted by: <strong>${username}</strong> at ${created}</span> <img src="../img/${profilePicture}" alt="Profile Image" class="profile-picture">`;

    const likeButton = document.createElement('button');
    likeButton.classList.add('like-button');
    likeButton.textContent = 'Like';
    likeButton.onclick = function() { likeThread(forumThreadId); };

    threadDiv.appendChild(threadTitle);
    threadDiv.appendChild(threadContent);
    threadDiv.appendChild(threadInfo);
    threadDiv.appendChild(likeButton);

    return threadDiv;
}

function likeThread(forumThreadId) {
    const ownerId = localStorage.getItem('user_id');  // Assuming user's ID is stored in localStorage
    fetch('{baseURL}/thread/like', {
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
            alert(data.message);  // Show error message to user
        } else if (data.code === "2") {
            alert('You have already liked this thread.');
        } else if (data.code === "0") {
            alert('Thanks for liking!');
        }
    })
    .catch(error => {
        console.error('Error liking the thread:', error);
    });
}


function displayThread(thread) {
    const { title, value: content, created, username, profilePicture } = thread;
    const profileImage = profilePicture || 'defaultpfp.jpg';  // Ensure there's a default image path
    const threadDiv = createThreadElement(title, content, new Date(created).toLocaleString(), username, profileImage);
    document.getElementById('threadsList').appendChild(threadDiv);
}