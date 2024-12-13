const form = document.getElementById('form-cadastrar-perfilAssc');

if (form) { 
    form.addEventListener('submit', async (event) => {
        event.preventDefault();


        const id_perfil = document.getElementById('select-perfis').value; 
        const matricula = document.getElementById('matricula').value;

  
        if (!id_perfil || !matricula) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const asscData = {
            id_perfil, 
            matricula,
        };

        try {
            const response = await fetch('http://localhost:3000/api/profile/associate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(asscData),
            });

            const result = await response.json();

            if (response.ok) {
                alert('Associação cadastrada com sucesso!');
                form.reset();
            } else {
                alert(`Erro ao cadastrar associação: ${result.message}`);
            }
        } catch (error) {
            console.error('Erro de conexão:', error);
            alert('Erro ao conectar com o servidor. Tente novamente mais tarde.');
        }
    });
} else {
    console.error('Formulário não encontrado.');
}


let dataTable = null;
async function fetchAndRenderAsscPerfil() {
    try {
        const response = await fetch('http://localhost:3000/api/profile/associated', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const perfisAssc = await response.json();
        const tableBody = document.querySelector('table tbody');


        // Limpa a tabela
        tableBody.innerHTML = '';


        perfisAssc.forEach(perfilAssc => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${perfilAssc.id_perfil}</td>
                <td>${perfilAssc.matricula}</td>
                <td>
                    <button class="btn btn-sm me-1" onclick="editPerfilAssc(${perfilAssc.matricula})">
                        <i class="lni lni-pencil"></i>
                    </button>
                    <button class="btn btn-sm me-1" onclick="deletePerfilAssc(${perfilAssc.matricula})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);

        });
        if (dataTable) {
            dataTable.destroy();  
        }

        dataTable = $('.table').DataTable({
            rowReorder: true,
            paging: true,
            pageLength: 5,
            pagingType: 'simple', 
            responsive: true, 
            lengthMenu: [5], 
            language: {
                url: "https://cdn.datatables.net/plug-ins/2.1.8/i18n/pt-BR.json" // URL corrigida
            },
            stateSave: true
        });
    } catch (error) {
        console.error('Erro ao carregar estoques:', error);
        alert('Erro ao carregar estoques. Tente novamente mais tarde.');
    }
}

function deletePerfilAssc(matricula){
    if (confirm('Tem certeza que deseja excluir este estoque?')) {
        fetch(`http://localhost:3000/api/profile/delete/associations/${matricula}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                if (response.ok) {
                    alert('Associação excluída com sucesso!');
                    fetchAndRenderStocks(); // Atualiza a tabela
                } else {
                    alert('Erro ao excluir associação');
                }
            })
            .catch(error => console.error('Erro ao excluir associação:', error));
    }
}


function editPerfilAssc(matricula) {
    // Busca os dados do perfil associado pela matrícula
    fetch(`http://localhost:3000/api/profile/associated/${matricula}`, {
        method: 'GET',
        // headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
        // },
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error('Erro na resposta da API');
        }
        return response.json();
    })
    .then((data) => {

        if (data && data.matricula && data.id_perfil) {
            document.getElementById('edit-select-perfilAssc').value = data.id_perfil; 
            document.getElementById('edit-matricula').value = data.matricula; 

            const modalEditarPerfilAssc = new bootstrap.Modal(document.getElementById('modalEditarPerfilAssc'));
            modalEditarPerfilAssc.show();
        } else {
            alert('Perfil associado com matrícula não encontrado ou resposta inválida.');
        }
    })
    .catch((error) => {
        console.error('Erro ao carregar dados dos perfis associados:', error);
        alert('Erro ao carregar dados dos perfis associados.'); 
    });
}
document.getElementById('modalEditarPerfilAssc').addEventListener('submit', async function (event) {
    event.preventDefault();

    const id_perfil = document.getElementById('edit-select-perfilAssc').value; // pega o id_perfil
    const matricula = document.getElementById('edit-matricula').value;

    const perfilAsscData = {
        id_perfil,
        matricula,
    };

    try {
        const response = await fetch(`http://localhost:3000/api/profile/associated/edit/${matricula}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(perfilAsscData)
        });

        const result = await response.json();

        if (response.ok) {
            alert('Associação atualizada com sucesso!');
            fetchAndRenderAsscPerfil();  // Atualiza a tabela
            document.getElementById('modalEditarPerfilAssc').querySelector('.btn-close').click(); // Fecha o modal
        } else {
            alert(`Erro ao atualizar associação: ${result.message}`);
        }
    } catch (error) {
        console.error('Erro ao atualizar associação:', error);
        alert('Erro ao atualizar associação. Tente novamente mais tarde.');
    }
});



// Chame a função após a submissão do formulário ou em um evento de carregamento
document.addEventListener('DOMContentLoaded', fetchAndRenderAsscPerfil);