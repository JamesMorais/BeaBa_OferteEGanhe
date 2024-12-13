const formCadastrarPerfil = document.getElementById('form-cadastrar-perfil');
const tableBodyPerfis = document.querySelector('#tablePerfis tbody');
let dataTablePerfis = null;

// Função para buscar e renderizar perfis na tabela
async function fetchAndRenderPerfis() {
    try {
        const response = await fetch('http://localhost:3000/api/profile/profiles', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const perfis = await response.json();

        // Limpa a tabela
        tableBodyPerfis.innerHTML = '';

        perfis.forEach(perfil => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${perfil.id_perfil}</td>
                <td>${perfil.nome_perfil}</td>
                <td>${perfil.descricao}</td>
                <td>
                    <button class="btn btn-sm me-1" data-bs-toggle="modal" data-bs-target="#modalEditarPerfil" data-id-perfil="${perfil.id_perfil}">
                        <i class="lni lni-pencil"></i>
                    </button>
                    <button class="btn btn-sm me-1" onclick="deletePerfil(${perfil.id_perfil})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            tableBodyPerfis.appendChild(row);
        });


        if (dataTablePerfis) {
            dataTablePerfis.destroy();  // Destroi a instância anterior do DataTable
        }

        dataTablePerfis = $('#tablePerfis').DataTable({
            rowReorder: true,
            paging: true,
            pageLength: 5,
            pagingType: 'simple', // Itens por página
            responsive: true, // Ativa responsividade
            lengthMenu: [5], // Opções de itens por página
            language: {
                url: "https://cdn.datatables.net/plug-ins/2.1.8/i18n/pt-BR.json" // URL corrigida
            },
            stateSave: true
        });
    } catch (error) {
        console.error('Erro ao carregar perfis:', error);
        alert('Erro ao carregar perfis. Tente novamente mais tarde.');
    }
}

// async function fetchAndRenderPerfis() {
//     try {
//         const response = await fetch('http://localhost:3000/api/profile/profiles', {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//             }
//         });

//         const perfis = await response.json();

//         // Limpa a tabela
//         tableBodyPerfis.innerHTML = '';

//         // Adiciona as linhas na tabela
//         perfis.forEach(perfil => {
//             const row = document.createElement('tr');
//             row.innerHTML = `
//                 <td>${perfil.id_perfil}</td>
//                 <td>${perfil.nome_perfil}</td>
//                 <td>${perfil.descricao}</td>
//                 <td>
//                     <button class="btn btn-sm me-1" data-bs-toggle="modal" data-bs-target="#modalEditarPerfil" data-id-perfil="${perfil.id_perfil}">
//                         <i class="lni lni-pencil"></i>
//                     </button>
//                     <button class="btn btn-sm me-1" onclick="deletePerfil(${perfil.id_perfil})">
//                         <i class="bi bi-trash"></i>
//                     </button>
//                 </td>
//             `;
//             tableBodyPerfis.appendChild(row);
//         });

//         if (dataTablePerfis) {
//             dataTablePerfis.destroy();  // Destroi a instância anterior do DataTable
//         }

//         dataTablePerfis = $('#tablePerfis').DataTable({
//             rowReorder: true,
//             paging: true,
//             pageLength: 5,
//             pagingType: 'simple', // Itens por página
//             responsive: true, // Ativa responsividade
//             lengthMenu: [5], // Opções de itens por página
//             language: {
//                 url: "https://cdn.datatables.net/plug-ins/2.1.8/i18n/pt-BR.json" // URL corrigida
//             },
//             stateSave: true
//         });
//     } catch (error) {
//         console.error('Erro ao carregar perfis:', error);
//         alert('Erro ao carregar perfis. Tente novamente mais tarde.');
//     }
// }

// Função para cadastrar um novo perfil
if (formCadastrarPerfil) {
    formCadastrarPerfil.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nomePerfil = document.getElementById('nome_perfil').value;
        const descricao = document.getElementById('descricao').value;
        const transacoes = Array.from(document.querySelectorAll('#checkbox-transacoes input[type="checkbox"]:checked')).map(checkbox => checkbox.value);

        if (!nomePerfil || !descricao || transacoes.length === 0) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const perfilData = {
            nome_perfil: nomePerfil,
            descricao: descricao,
            transacoes: transacoes,
        };

        try {
            const response = await fetch('http://localhost:3000/api/profile/register/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(perfilData),
            });

            const result = await response.json();

            if (response.ok) {
                alert('Perfil cadastrado com sucesso!');
                formCadastrarPerfil.reset();
                fetchAndRenderPerfis(); // Atualiza a tabela
            } else {
                alert(`Erro ao cadastrar perfil: ${result.message}`);
            }
        } catch (error) {
            console.error('Erro de conexão:', error);
            alert('Erro ao conectar com o servidor. Tente novamente mais tarde.');
        }
    });
}



// Função para excluir um perfil
function deletePerfil(id_perfil) {
    if (confirm('Tem certeza que deseja excluir este perfil?')) {
        fetch(`http://localhost:3000/api/profile/delete/${id_perfil}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                if (response.ok) {
                    alert('Perfil excluído com sucesso!');
                    fetchAndRenderPerfis(); // Atualiza a tabela
                } else {
                    alert('Erro ao excluir perfil');
                }
            })
            .catch(error => console.error('Erro ao excluir perfil:', error));
    }
}

// Chama a função para renderizar perfis ao carregar a página
document.addEventListener('DOMContentLoaded', fetchAndRenderPerfis);

