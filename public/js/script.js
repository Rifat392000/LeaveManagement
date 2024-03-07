document.getElementById('login-btn').addEventListener('click', () => {
    const user = document.getElementById('login-user').value;
    const pass = document.getElementById('login-pass').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user, pass }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const userInformation = data.user;
            sessionStorage.setItem('currentUser', JSON.stringify(userInformation));
            window.location.href = 'dashboard.html';
        } else {
            if (data.error === 'Internal Server Error') {
                alert('Error during login request. Please try again later.');
            } else {
                alert('Invalid username or password. Please check your credentials.');
            }
        }
    })
    .catch(error => {
        alert('Error during login request');
    });
});
