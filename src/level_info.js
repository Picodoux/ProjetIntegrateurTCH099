document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.comments-section').addEventListener('click', function (e) {
        if (e.target.classList.contains('like-btn')) {
            const commentId = e.target.getAttribute('data-comment-id');
            const formData = new FormData();
            formData.append('commentId', commentId);
            fetch('handle_like.php', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        e.target.textContent = `♥ ${data.likesCount}`;
                        if (data.action === 'liked') {
                            e.target.classList.add('liked');
                        } else if (data.action === 'unliked') {
                            e.target.classList.remove('liked');
                        }
                    } else {
                        let messageDisplay = document.getElementById('messageDisplay');
                        if (!messageDisplay) {
                            messageDisplay = document.createElement('h5');
                            messageDisplay.id = 'messageDisplay';
                            const commentForm = document.getElementById('comment-form');
                            if (commentForm) {
                                commentForm.parentNode.insertBefore(messageDisplay, commentForm.nextSibling);
                            } else {
                                console.error("Comment form not found");
                            }
                        }
                        messageDisplay.innerHTML = data.message;
                        messageDisplay.classList.add('comments-section');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Something went wrong. Please try again.');
                });
        }

        if (e.target.classList.contains('delete-btn')) {
            const commentId = e.target.getAttribute('data-comment-id');
            const formData = new FormData();
            formData.append('commentId', commentId);
            formData.append('action', 'delete');
            fetch('handle_comment.php', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        e.target.closest('.comment').remove();
                    } else {
                        alert(data.message);
                    }
                })
                .catch(error => console.error('Error:', error));
        }
    });
});
