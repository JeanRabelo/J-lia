document.getElementById("client-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const token = localStorage.getItem('access_token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const clientData = {
        cpf: document.getElementById("cpf").value,
        data_nascimento: document.getElementById("data-nascimento").value,
        nome: document.getElementById("nome").value,
        observacoes: document.getElementById("observacoes").value
    };

    try {
        const response = await fetch('https://186.202.57.139:8080/save_client', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(clientData)
        });

        if (response.ok) {
            alert('Cliente cadastrado com sucesso!');
            window.location.href = 'clientes.html';
        } else if (response.status === 401) {
            alert('Sessão expirada. Faça login novamente.');
            window.location.href = 'login.html';
        } else {
            alert('Erro ao salvar o cliente.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Erro ao comunicar com o servidor.');
    }
});

