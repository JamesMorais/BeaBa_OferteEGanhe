const formCadastrarEstoque = document.getElementById('form-cadastrar-estoque');

formCadastrarEstoque.addEventListener('submit', async (event) => {
    event.preventDefault();

    const id_loja = document.getElementById('select-lojas').value;
    const quantidade_recomendada = document.getElementById('quantidade_recomendada').value;
    const quantidade_minima = document.getElementById('quantidade_minima').value;

    const stockData = {
        id_loja,
        quantidade_recomendada,
        quantidade_minima
    };

    try {
        const response = await fetch('http://localhost:3000/api/stock/register/stock', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(stockData),
        });

        const result = await response.json();

        if (response.ok) {
            alert('Estoque cadastrado com sucesso!');
            formCadastrarEstoque.reset();
        } else {
            alert(`Erro ao cadastrar estoque: ${result.message}`);
        }
    } catch (error) {
        console.error('Erro de conexão:', error);
        alert('Erro ao conectar com o servidor. Tente novamente mais tarde.');
    }
});


let dataTable = null;
// Função para buscar e exibir estoques
async function fetchAndRenderStocks() {
    try {
        const response = await fetch('http://localhost:3000/api/stock/stocks', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const estoques = await response.json();
        const tableBody = document.querySelector('table tbody');


        // Limpa a tabela
        tableBody.innerHTML = '';

        // Adiciona as linhas na tabela
        estoques.forEach(estoque => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${estoque.id_loja}</td>
                <td>${estoque.quantidade_recomendada}</td>
                <td>${estoque.quantidade_minima}</td>
                <td>${estoque.quantidade_atual}</td>
                <td>
                    <button class="btn btn-sm me-1" onclick="editStock(${Number(estoque.id_loja)})">
                        <i class="lni lni-pencil"></i>
                    </button>
                    <button class="btn btn-sm me-1" onclick="deleteStock(${estoque.id_loja})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);

        });
        if (dataTable) {
            dataTable.destroy();  // Destroi a instância anterior do DataTable
        }

        dataTable = $('.table').DataTable({
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
        console.error('Erro ao carregar estoques:', error);
        alert('Erro ao carregar estoques. Tente novamente mais tarde.');
    }
}



function editStock(id_loja) {
    id_loja = Number(id_loja);

    // Busca os dados do estoque pelo id_loja
    fetch(`http://localhost:3000/api/stock/stocks/${id_loja}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    })
        .then((response) => response.json())
        .then((estoqueArray) => {
            console.log('Resposta do backend:', estoqueArray); // Verifica a estrutura do retorno

            if (estoqueArray && estoqueArray.length > 0) {
                const estoque = estoqueArray[0]; // Obtém o primeiro (e único) objeto do array

                // Preenche o campo "Loja" (read-only)
                const lojaInfo = `${estoque.id_loja} - Loja ${estoque.id_loja}`;
                document.getElementById('edit-select-lojas').value = lojaInfo;

                // Preenche os demais campos do modal de edição
                document.getElementById('edit-quantidade-recomendada').value = estoque.quantidade_recomendada || '';
                document.getElementById('edit-quantidade-minima').value = estoque.quantidade_minima || '';

                // Abre o modal de edição
                const modalEditEstoque = new bootstrap.Modal(document.getElementById('modalEditarEstoque'));
                modalEditEstoque.show();
            } else {
                alert('Estoque não encontrado ou resposta inválida.');
            }
        })
        .catch((error) => {
            console.error('Erro ao carregar dados do estoque:', error);
            alert('Erro ao carregar dados do estoque.'); 
        });
}

// Atualização do ID para o formulário de edição
document.getElementById('form-editar-estoque').addEventListener('submit', async function (event) {
    event.preventDefault();

    // Captura o valor da loja (por exemplo, "1 - Loja 1") e extrai apenas o número
    const id_loja = document.getElementById('edit-select-lojas').value.split(' - ')[0];  // Pega só o número da loja
    const quantidade_recomendada = document.getElementById('edit-quantidade-recomendada').value;
    const quantidade_minima = document.getElementById('edit-quantidade-minima').value;

    const userData = {
        quantidade_recomendada,
        quantidade_minima,
    };

    try {
        const response = await fetch(`http://localhost:3000/api/stock/edit/stock/${id_loja}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (response.ok) {
            alert('Estoque atualizado com sucesso!');
            fetchAndRenderStocks();  // Atualiza a tabela
            document.getElementById('modalEditarEstoque').querySelector('.btn-close').click(); // Fecha o modal
        } else {
            alert(`Erro ao atualizar Loja: ${result.message}`);
        }
    } catch (error) {
        console.error('Erro ao atualizar Loja:', error);
        alert('Erro ao atualizar Loja. Tente novamente mais tarde.');
    }
});

// Função para deletar um estoque
function deleteStock(id_loja) {
    if (confirm('Tem certeza que deseja excluir este estoque?')) {
        fetch(`http://localhost:3000/api/stock/delete/stock/${id_loja}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                if (response.ok) {
                    alert('Estoque excluído com sucesso!');
                    fetchAndRenderStocks(); // Atualiza a tabela
                } else {
                    alert('Erro ao excluir estoque');
                }
            })
            .catch(error => console.error('Erro ao excluir estoque:', error));
    }
}

// Chama a função ao carregar a página
document.addEventListener('DOMContentLoaded', fetchAndRenderStocks);
