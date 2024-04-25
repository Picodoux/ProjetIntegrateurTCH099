document.addEventListener('DOMContentLoaded', function() {
    updateMenuProfile();;
    fetchLeaderboard(); 
});

function fetchLeaderboard() {
    fetch('http://144.217.83.146:8080/score/leaderboard', { 
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json()) 
    .then(data => {
        if (Array.isArray(data)) {
            updateLeaderboard(data); 
        } else {
            console.error('Données inattendues:', typeof data);
        }
    })
    .catch(error => {
        console.error('Erreur lors de la récupération du classement:', error); 
    });
}

function updateLeaderboard(data) {
    const rankingList = document.querySelector('.ranking-list');
    rankingList.innerHTML = ''; 

    data.forEach((item, index) => {
        const listItem = document.createElement('li');

        const rankSpan = document.createElement('span');
        rankSpan.className = 'rank';
        rankSpan.textContent = `${index + 1}.`;

        const usernameSpan = document.createElement('span');
        usernameSpan.textContent = item.username;

        const scoreSpan = document.createElement('span');
        scoreSpan.className = 'score';
        scoreSpan.textContent = `${item.totalScore.toLocaleString()} Points`;

        listItem.appendChild(rankSpan);
        listItem.appendChild(usernameSpan);
        listItem.appendChild(scoreSpan);

        rankingList.appendChild(listItem); 
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