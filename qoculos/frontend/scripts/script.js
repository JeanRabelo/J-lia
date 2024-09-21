// script.js

window.onload = function() {
    const token = localStorage.getItem('access_token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    loadPurchases(); // Load the purchase table on page load
    const typedText = "QÓculos";
    const typedContainer = document.getElementById("typed-text");
    const cursor = document.querySelector(".blinking-cursor");
    
    let currentIndex = 0;
    
    // Function to type out each character
    function typeNextChar() {
        if (currentIndex < typedText.length) {
            typedContainer.innerHTML += typedText[currentIndex];
            currentIndex++;
            setTimeout(typeNextChar, 200); // Adjust speed of typing
        } else {
            // Remove the cursor after typing is done
            cursor.style.display = 'none';

            // Show the original static QÓculos and start animations
            document.querySelector(".opqrs-container").style.display = "flex";
            
            // Remove the typed animation container
            setTimeout(() => {
                document.querySelector(".typing-container").remove();
                startAnimations();
            }, 500); // Give it some time before starting animations
        }
    }
    
    // Start typing after a brief delay
    setTimeout(() => {
        typeNextChar();
    }, 1000);

    // Function to start the existing animations after typing
    function startAnimations() {
        setTimeout(() => {
            document.body.classList.add('fade-pqrs');
            setTimeout(() => {
                document.body.classList.add('move-o');
                setTimeout(() => {
                    setTimeout(() => {
                        document.body.classList.add('zoom-active');
                    }, 1000);
                    setTimeout(() => {
                        document.body.classList.add('show-content');
			// remove the div class="opqrs-container" after the animation
			setTimeout(() => {
				document.querySelector(".opqrs-container").remove();
			}, 1000);
                    }, 2000);
                }, 1000);
            }, 1000);
        }, 2000);
    }

    // Existing animation code...
    // [Keep your existing typing and animation functions here]
};

async function loadPurchases() {
    const token = localStorage.getItem('access_token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/get_purchases', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const purchases = await response.json();
            const tableDiv = document.getElementById('purchase-table');

            if (purchases.length > 0) {
                let tableHTML = '<table border="1"><tr><th>CPF</th><th>Vendedor</th><th>Valor</th><th>Data</th><th>Identificação</th><th>Observações</th></tr>';
                purchases.forEach(purchase => {
                    tableHTML += `<tr>
                                    <td>${purchase.cpf}</td>
                                    <td>${purchase.vendedor}</td>
                                    <td>${purchase.valor}</td>
                                    <td>${purchase.data_compra}</td>
                                    <td>${purchase.identificacao}</td>
                                    <td>${purchase.observacoes}</td>
                                  </tr>`;
                });
                tableHTML += '</table>';
                tableDiv.innerHTML = tableHTML;
            } else {
                tableDiv.innerHTML = '<p>Nenhuma compra registrada.</p>';
            }
        } else if (response.status === 401) {
            alert('Sessão expirada. Faça login novamente.');
            window.location.href = 'login.html';
        } else {
            document.getElementById('purchase-table').innerHTML = '<p>Erro ao carregar as compras.</p>';
        }
    } catch (error) {
        console.error('Error fetching purchases:', error);
        document.getElementById('purchase-table').innerHTML = '<p>Erro ao carregar as compras.</p>';
    }
}

