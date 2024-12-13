const formCadastrarEnvio = document.getElementById('form-cadastrar-envio');

formCadastrarEnvio.addEventListener('submit', async (event) => {
    event.preventDefault();

    const id_loja = document.getElementById('select-lojas').value;
    const quantidade_enviada = document.getElementById('quantidade_enviada').value;
    const data_envio = document.getElementById('data_envio').value;

    const envioDados = {
        id_loja,
        quantidade_enviada,
        data_envio
    };

    try {
        const response = await fetch('http://localhost:3000/api/talon/envio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(envioDados),
        });

        const result = await response.json();

        if (response.ok) {
            alert('Envio cadastrado com sucesso!');
            formCadastrarEnvio.reset();
        } else {
            alert(`Erro ao cadastrar envio: ${result.message}`);
        }
    } catch (error) {
        console.error('Erro de conexão:', error);
        alert('Erro ao conectar com o servidor. Tente novamente mais tarde.');
    }
});

let dataTable = null;


async function fetchAndRenderEnvios() {
    try {
        const response = await fetch('http://localhost:3000/api/talon/talons/enviados', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const taloes = await response.json();
        console.log(taloes); 

        const tableBody = document.querySelector('table tbody');

   
        tableBody.innerHTML = '';


        taloes.forEach(talao => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${talao.id_talao}</td>
                <td>${talao.nome_loja}</td>
                <td>${talao.quantidade_enviada}</td>
                <td>${new Date(talao.data_envio_real).toLocaleDateString()}</td>
                <td>${new Date(talao.hora_envio).toLocaleTimeString()}</td>
                <td>${talao.id_envio}</td>
                <td>${talao.status || 'Não definido'}</td>
                <td>
                    <button class="btn btn-sm me-1" onclick="editEnvio(${talao.id_talao})">
                        <i class="lni lni-pencil"></i>
                    </button>
                    <button class="btn btn-sm me-1" onclick="deleteEnvio(${talao.id_talao})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        if (dataTable) {
            dataTable.destroy(); // Destrói a instância anterior
        }

        dataTable = $('.table').DataTable({
            rowReorder: true,
            paging: true,
            pageLength: 5,
            pagingType: 'simple',
            responsive: true,
            lengthMenu: [5],
            language: {
                url: "https://cdn.datatables.net/plug-ins/2.1.8/i18n/pt-BR.json"
            },
            stateSave: true
        });
        console.log('Tabela renderizada com sucesso.');

    } catch (error) {
        console.error('Erro ao carregar envios:', error);
        alert('Erro ao carregar envios. Tente novamente mais tarde.');
    }
}

// Chama a função após carregar o DOM
document.addEventListener('DOMContentLoaded', () => {
    fetchAndRenderEnvios();
});


function editEnvio(id_talao) {
    // Enviar uma solicitação para buscar os dados do envio com base no id_talao
    fetch(`http://localhost:3000/api/talon/enviados/${id_talao}`, {
        method: 'GET',
        // headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`
        // }
    })
    .then(response => response.json())
    .then(envio => {
        if (envio && envio.length > 0) {
     
            const envioData = envio[0]; 

            document.getElementById('id_talao_editar').value = envioData.id_talao;
            document.getElementById('data_envio_editar').value = envioData.data_envio_real; 
            
            // Exibir o modal
            const modalEditEnvio = new bootstrap.Modal(document.getElementById('modalEditarEnvio'));
            modalEditEnvio.show();
        } else {
            alert('Envio não encontrado.');
        }
    })
    .catch(error => {
        console.error('Erro ao carregar dados do envio:', error);
        alert('Erro ao carregar dados do envio.');
    });
}
document.getElementById('form-editar-envio').addEventListener('submit', async function (event) {
    event.preventDefault();


    const id_talao = document.getElementById('id_talao_editar').value;
    const data_envio = document.getElementById('data_envio_editar').value;

    const envioData = {
        data_envio,  
    };

    try {
        const response = await fetch(`http://localhost:3000/api/talon/talons/edit/${id_talao}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(envioData)
        });

        const result = await response.json();

        if (response.ok) {
            alert('Envio atualizado com sucesso!');
            fetchAndRenderEnvios();  
            document.getElementById('modalEditarEnvio').querySelector('.btn-close').click(); 
        } else {
            alert(`Erro ao atualizar envio: ${result.message}`);
        }
    } catch (error) {
        console.error('Erro ao atualizar envio:', error);
        alert('Erro ao atualizar envio. Tente novamente mais tarde.');
    }
});


function deleteEnvio(id_talao) {
    if (confirm('Tem certeza que deseja excluir este estoque?')) {
        fetch(`http://localhost:3000/api/talon/delete/${id_talao}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                if (response.ok) {
                    alert('Envio excluído com sucesso!');
                    fetchAndRenderStocks(); // Atualiza a tabela
                } else {
                    alert('Erro ao excluir envio');
                }
            })
            .catch(error => console.error('Erro ao excluir envio:', error));
    }
}