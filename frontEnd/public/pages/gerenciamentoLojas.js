const form = document.getElementById('registration-form');

form.addEventListener('submit', async (event) => {
    event.preventDefault();


    const id_loja = document.getElementById('codigo').value;
    const nome_loja = document.getElementById('name').value;

    if (!id_loja || !nome_loja) {
        alert('Por favor, preencha todos os campos.');
        return;
    }



    const storeData = {
        id_loja,
        nome_loja,
    };

    try {
        const response = await fetch('http://localhost:3000/api/store/register/store', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(storeData),
        });

        const result = await response.json();

        if (response.ok) {
            alert('Loja cadastrada com sucesso!');
            form.reset();
        } else {
            alert(`Erro ao cadastrar Loja: ${result.message}`);
        }
    } catch (error) {
        console.error('Erro de conexão:', error);
        alert('Erro ao conectar com o servidor. Tente novamente mais tarde.');
    }
});


function editStore(id_loja) {

    fetch(`http://localhost:3000/api/store/stores/${id_loja}`, {
        method: 'GET',
        // headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`
        // }
    })
        .then(response => response.json())
        .then(loja => {
            if (loja) {

                document.getElementById('edit-matricula').value = loja.id_loja;
                document.getElementById('edit-name').value = loja.nome_loja;


                // Exibir o modal
                const modalEditUser = new bootstrap.Modal(document.getElementById('modalEditUser'));
                modalEditUser.show();
            } else {
                alert('Loja não encontrado.');
            }
        })
        .catch(error => {
            console.error('Erro ao carregar dados da Loja:', error);
            alert('Erro ao carregar dados da Loja.');
        });
}

// Função para atualizar os dados do usuário
document.getElementById('edit-user-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    // Captura os dados do formulário
    const id_loja = document.getElementById('edit-matricula').value;
    const nome_loja = document.getElementById('edit-name').value;

    if (!id_loja || !nome_loja) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    
    const userData = {
        id_loja,
        nome_loja,
    };

    try {
        const response = await fetch(`http://localhost:3000/api/store/stores/edit/${id_loja}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (response.ok) {
            alert('Loja atualizada com sucesso!');
            fetchAndRenderStores();  
            document.getElementById('modalEditUser').querySelector('.btn-close').click();
        } else {
            alert(`Erro ao atualizar Loja: ${result.message}`);
        }
    } catch (error) {
        console.error('Erro ao atualizar Loja:', error);
        alert('Erro ao atualizar Loja. Tente novamente mais tarde.');
    }
});

