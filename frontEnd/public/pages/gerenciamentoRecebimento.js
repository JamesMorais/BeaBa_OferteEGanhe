const formCadastrarRecebimento = document.getElementById('form-cadastrar-recebimento');

formCadastrarRecebimento.addEventListener('submit', async (event) => {
    event.preventDefault();

    const id_talao = document.getElementById('id_talao').value
    const id_loja = document.getElementById('select-lojas').value;
    const quantidade_recebida = document.getElementById('quantidade_recebida').value;
    const data_recebimento = document.getElementById('data_recebimento').value;

    const recebimentoDados = {
        id_talao,
        id_loja,
        quantidade_recebida,
        data_recebimento
    };

    try {
        const response = await fetch('http://localhost:3000/api/talon/recebimento', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(recebimentoDados),
        });

        const result = await response.json();

        if (response.ok) {
            alert('Recebimento cadastrado com sucesso!');
            formCadastrarRecebimento.reset();
        } else {
            alert(`Erro ao cadastrar recebimento: ${result.message}`);
        }
    } catch (error) {
        console.error('Erro de conexão:', error);
        alert('Erro ao conectar com o servidor. Tente novamente mais tarde.');
    }
});

let dataTable = null;
async function fetchAndRenderRecebimentos() {
    try {
        const response = await fetch('http://localhost:3000/api/talon/talons/recebidos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const taloes = await response.json();
        const tableBody = document.querySelector('table tbody');

        // Limpa a tabela
        tableBody.innerHTML = '';

        // Adiciona as linhas na tabela
        taloes.forEach(talao => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${talao.id_talao}</td>
                <td>${talao.nome_loja}</td>
                <td>${talao.quantidade_recebida}</td>
                <td>${new Date(talao.data_recebimento_real).toLocaleDateString()}</td>
                <td>${talao.id_recebimento}</td>
                <td>${talao.status || 'Não definido'}</td>
                <td>
                    <button class="btn btn-sm me-1" onclick="deleteRecebimento(${talao.id_talao})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Reinicializa o DataTables
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
                url: "https://cdn.datatables.net/plug-ins/2.1.8/i18n/pt-BR.json" 
            },
            stateSave: true
        });
        console.log('Tabela renderizada com sucesso.');

    } catch (error) {
        console.error('Erro ao carregar Recebimentos:', error);
        alert('Erro ao carregar recebimentos. Tente novamente mais tarde.');
    }
}

// Chama a função após carregar o DOM
document.addEventListener('DOMContentLoaded', () => {
    fetchAndRenderRecebimentos();
});