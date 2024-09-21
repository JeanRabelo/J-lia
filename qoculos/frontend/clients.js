async function loadClients() {
    try {
        const response = await fetch('http://localhost:8080/get_clients');
        const clients = await response.json();

        const tableDiv = document.getElementById('client-table');

        if (clients.length > 0) {
            let tableHTML = '<table border="1"><tr><th>CPF</th><th>Data de Nascimento</th><th>Nome</th><th>Observações</th><th>Número de Compras</th><th>Valor Total Gasto</th></tr>';
            clients.forEach(client => {
                tableHTML += `<tr>
                                <td>${client.cpf}</td>
                                <td>${client.data_nascimento}</td>
                                <td>${client.nome}</td>
                                <td>${client.observacoes}</td>
                                <td>${client.numero_compras}</td>
                                <td>${client.valor_total_gasto}</td>
                              </tr>`;
            });
            tableHTML += '</table>';
            tableDiv.innerHTML = tableHTML;
        } else {
            tableDiv.innerHTML = '<p>Nenhum cliente registrado.</p>';
        }
    } catch (error) {
        console.error('Error fetching clients:', error);
        document.getElementById('client-table').innerHTML = '<p>Erro ao carregar os clientes.</p>';
    }
}

// Load clients when the page is loaded
window.onload = function() {
    loadClients();
};

