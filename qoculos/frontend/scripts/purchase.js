// purchase.js

document.getElementById("purchase-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const token = localStorage.getItem('access_token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const formData = {
        cpf: document.getElementById("cpf").value,
        vendedor: document.getElementById("vendedor").value,
        valor: document.getElementById("valor").value,
        data_compra: document.getElementById("data-compra").value,
        identificacao: document.getElementById("identificacao").value,
        observacoes: document.getElementById("observacoes").value
    };

    try {
        const response = await fetch('http://186.202.57.139:8080/save_purchase', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('Compra cadastrada com sucesso!');
            window.location.href = 'index.html'; // Redirect back to main page after submission
        } else if (response.status === 401) {
            alert('Sessão expirada. Faça login novamente.');
            window.location.href = 'login.html';
        } else {
            alert('Erro ao salvar a compra.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Erro ao comunicar com o servidor.');
    }
});

