// Function to load client data into the form
async function loadClientData(cpf) {
    try {
        const response = await fetch(`http://localhost:8080/get_client/${cpf}`);
        const client = await response.json();

        document.getElementById("cpf").value = client.cpf;
        document.getElementById("data-nascimento").value = client.data_nascimento;
        document.getElementById("nome").value = client.nome;
        document.getElementById("observacoes").value = client.observacoes;
    } catch (error) {
        console.error('Error loading client data:', error);
    }
}

// On form submission, send an update request
document.getElementById("edit-client-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const cpf = document.getElementById("cpf").value;
    const clientData = {
        data_nascimento: document.getElementById("data-nascimento").value,
        nome: document.getElementById("nome").value,
        observacoes: document.getElementById("observacoes").value
    };

    try {
        const response = await fetch(`http://localhost:8080/update_client/${cpf}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clientData)
        });

        if (response.ok) {
            alert('Cliente atualizado com sucesso!');
            window.location.href = 'clientes.html'; // Redirect to clients page after update
        } else {
            alert('Erro ao atualizar o cliente.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Erro ao comunicar com o servidor.');
    }
});

