let dataTable = null;
async function fetchAndRenderEnvios() {
    try {
        const response = await fetch('http://localhost:3000/api/talon/talons/enviados');
        const taloes = await response.json();
        console.log('Dados recebidos da API:', taloes); // Verificar os dados da API

        const tableBody = document.querySelector('table tbody');
        if (!tableBody) {
            console.error('Elemento tbody não encontrado.');
            return;
        }
        console.log('Elemento tbody encontrado:', tableBody); // Confirmar se o tbody foi encontrado

        tableBody.innerHTML = ''; // Limpar a tabela
        taloes.forEach(talao => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${talao.id_talao}</td>
                <td>${talao.nome_loja}</td>
                <td>${talao.quantidade_enviada}</td>
                <td>${new Date(talao.data_talao_envio).toLocaleDateString()}</td>
                <td>${talao.id_envio}</td>
                <td>
                    <button class="btn btn-sm me-1" onclick="editEnvio(${talao.id_envio})">
                        <i class="lni lni-pencil"></i>
                    </button>
                    <button class="btn btn-sm me-1" onclick="deleteEnvio(${talao.id_envio})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            console.log('Linha criada:', row.innerHTML); // Verificar a criação da linha
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao carregar envios:', error); // Registrar o erro, se ocorrer
    }
}