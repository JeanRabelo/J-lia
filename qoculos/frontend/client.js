document.getElementById("client-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const clientData = {
        cpf: document.getElementById("cpf").value,
        data_nascimento: document.getElementById("data-nascimento").value,
        nome: document.getElementById("nome").value,
        observacoes: document.getElementById("observacoes").value
    };

    try {
        const response = await fetch('http://localhost:8080/save_client', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clientData)
        });

        if (response.ok) {
            alert('Cliente cadastrado com sucesso!');
            window.location.href = 'clientes.html'; // Redirect to clients page after submission
        } else {
            alert('Erro ao salvar o cliente.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Erro ao comunicar com o servidor.');
    }
});

