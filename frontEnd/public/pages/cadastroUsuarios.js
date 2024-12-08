const form = document.getElementById('registration-form');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Captura os valores dos campos
    const nome = document.getElementById('name').value;
    const matricula = document.getElementById('matricula').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value;
    // const dataCadastro = document.getElementById('data_cadastro').value;

    // Verifica se a data foi preenchida e ajusta o formato para 'DD/MM/YYYY'
    // const [ano, mes, dia] = dataCadastro.split('-');
    // const dataFormatada = `${dia}/${mes}/${ano}`;

    // Prepara os dados para envio
    const userData = {
        nome,
        matricula,
        email,
        senha,
        // data_cadastro: dataFormatada, // Usa a data formatada
    };

    try {
        const response = await fetch('http://localhost:3000/api/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const result = await response.json();

        if (response.ok) {
            alert('Usuário cadastrado com sucesso!');
            form.reset();
        } else {
            alert(`Erro ao cadastrar usuário: ${result.message}`);
        }
    } catch (error) {
        console.error('Erro de conexão:', error);
        alert('Erro ao conectar com o servidor. Tente novamente mais tarde.');
    }
});




// Função para abrir o modal de edição com os dados do usuário
function editUser(matricula) {
    // Enviar uma solicitação para buscar os dados do usuário com base na matrícula
    fetch(`http://localhost:3000/api/user/users/${matricula}`, {
        method: 'GET',
        // headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`
        // }
    })
    .then(response => response.json())
    .then(user => {
        if (user) {
            // Preencher os campos do modal com os dados do usuário
            document.getElementById('edit-name').value = user.nome;
            document.getElementById('edit-matricula').value = user.matricula;
            document.getElementById('edit-email').value = user.email;
            document.getElementById('edit-password').value = ''; // Deixe o campo de senha vazio para o usuário editar se quiser
            
            // Exibir o modal
            const modalEditUser = new bootstrap.Modal(document.getElementById('modalEditUser'));
            modalEditUser.show();
        } else {
            alert('Usuário não encontrado.');
        }
    })
    .catch(error => {
        console.error('Erro ao carregar dados do usuário:', error);
        alert('Erro ao carregar dados do usuário.');
    });
}

// Função para atualizar os dados do usuário
document.getElementById('edit-user-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    // Captura os dados do formulário
    const matricula = document.getElementById('edit-matricula').value;
    const nome = document.getElementById('edit-name').value;
    const email = document.getElementById('edit-email').value;
    const senha = document.getElementById('edit-password').value;

    const userData = {
        nome,
        email,
        senha: senha || undefined, // Envia a senha apenas se ela for preenchida
    };

    try {
        const response = await fetch(`http://localhost:3000/api/user/edit/${matricula}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (response.ok) {
            alert('Usuário atualizado com sucesso!');
            fetchAndRenderUsers();  // Atualiza a tabela
            document.getElementById('modalEditUser').querySelector('.btn-close').click(); // Fecha o modal
        } else {
            alert(`Erro ao atualizar usuário: ${result.message}`);
        }
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        alert('Erro ao atualizar usuário. Tente novamente mais tarde.');
    }
});

