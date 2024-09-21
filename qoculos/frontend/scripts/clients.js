async function loadClients() {
    const token = localStorage.getItem('access_token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/get_clients', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
	    const tableDiv = document.getElementById('client-table');
            const clients = await response.json();
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
        } else if (response.status === 401) {
            alert('Sessão expirada. Faça login novamente.');
            window.location.href = 'login.html';
        } else {
            alert('Erro ao carregar os clientes.');
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

