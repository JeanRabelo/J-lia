// login.js
document.getElementById("login-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const credentials = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
    };

    try {
        const response = await fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });

        if (response.ok) {
            const data = await response.json();
            // Store JWT token in localStorage
            localStorage.setItem('access_token', data.access_token);
            alert('Login successful!');
            window.location.href = 'index.html'; // Redirect to main page
        } else {
            alert('Login failed!');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error communicating with server.');
    }
});

