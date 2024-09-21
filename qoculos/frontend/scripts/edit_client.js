// edit_client.js

// Function to load client data into the form
async function loadClientData(cpf) {
    const token = localStorage.getItem('access_token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`http://186.202.57.139:8080/get_client/${cpf}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const client = await response.json();
            document.getElementById("cpf").value = client.cpf;
            document.getElementById("data-nascimento").value = client.data_nascimento;
            document.getElementById("nome").value = client.nome;
            document.getElementById("observacoes").value = client.observacoes;
        } else if (response.status === 401) {
            alert('Sessão expirada. Faça login novamente.');
            window.location.href = 'login.html';
        } else {
            alert('Erro ao carregar os dados do cliente.');
        }
    } catch (error) {
        console.error('Error loading client data:', error);
        alert('Erro ao comunicar com o servidor.');
    }
}

// On form submission, send an update request
document.getElementById("edit-client-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const token = localStorage.getItem('access_token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const cpf = document.getElementById("cpf").value;
    const clientData = {
        data_nascimento: document.getElementById("data-nascimento").value,
        nome: document.getElementById("nome").value,
        observacoes: document.getElementById("observacoes").value
    };

    try {
        const response = await fetch(`http://186.202.57.139:8080/update_client/${cpf}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(clientData)
        });

        if (response.ok) {
            alert('Cliente atualizado com sucesso!');
            window.location.href = 'clientes.html'; // Redirect to clients page after update
        } else if (response.status === 401) {
            alert('Sessão expirada. Faça login novamente.');
            window.location.href = 'login.html';
        } else {
            alert('Erro ao atualizar o cliente.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Erro ao comunicar com o servidor.');
    }
});

// Load client data when the page is loaded
window.onload = function() {
    // Retrieve the CPF from query parameters or other means
    const urlParams = new URLSearchParams(window.location.search);
    const cpf = urlParams.get('cpf');

    if (cpf) {
        loadClientData(cpf);
    } else {
        alert('CPF do cliente não fornecido.');
        window.location.href = 'clientes.html';
    }
};

