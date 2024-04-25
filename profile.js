document.addEventListener('DOMContentLoaded', function() {
const userData = {
    username: localStorage.getItem('username') || "Unknown",
    email: localStorage.getItem('email') || "Unknown",
    joinDate:  "2024-04-24",
    playedTime: "0 heures",
    bio: localStorage.getItem('bio') || "Unknown",
};

document.getElementById('username').textContent = userData.username.replace(/"/g, '');
document.getElementById('email').textContent = "Email: " + userData.email.replace(/"/g, '');
document.getElementById('joinDate').textContent = "Date d'inscription: " + userData.joinDate.replace(/"/g, '');
document.getElementById('playedTime').textContent = "Temps joué: " + userData.playedTime;
document.getElementById('bio').textContent = userData.bio.replace(/"/g, '');

});
