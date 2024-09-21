// register.js

document.getElementById("register-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    // Check for JWT token
    const token = localStorage.getItem('access_token');
    if (!token) {
        alert('Você precisa estar logado para registrar um novo usuário.');
        window.location.href = 'login.html';
        return;
    }

    const userData = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
    };

    try {
        const response = await fetch('http://186.202.57.139:8080/register', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            alert('Usuário registrado com sucesso!');
            window.location.href = 'index.html'; // Redirect to main page
        } else if (response.status === 401 || response.status === 403) {
            alert('Você não está autorizado a registrar novos usuários.');
            window.location.href = 'login.html';
        } else if (response.status === 409) {
            alert('Nome de usuário já existe. Escolha outro nome de usuário.');
        } else {
            alert('Erro ao registrar o usuário.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Erro ao comunicar com o servidor.');
    }
});

