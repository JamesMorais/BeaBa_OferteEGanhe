// const formCadastrarRepasse = document.getElementById('registration-form');
// formCadastrarRepasse.addEventListener('submit', async (event) => {
//     event.preventDefault();

//     const id_talao = document.getElementById('id_talao').value
//     const id_loja = document.getElementById('select-lojas').value;
//     const quantidade_repassada = document.getElementById('quantidade_repassada').value;

//     const repasseDados = {
//         id_talao,
//         id_loja,
//         quantidade_repassada
//     };

//     try {
//         const response = await fetch('http://localhost:3000/api/talon/manutencao', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(repasseDados),
//         });

//         const result = await response.json();

//         if (response.ok) {
//             alert('Repasse cadastrado com sucesso!');
//             formCadastrarRepasse.reset();
//         } else {
//             alert(`Erro ao cadastrar repasse: ${result.message}`);
//         }
//     } catch (error) {
//         console.error('Erro de conexão:', error);
//         alert('Erro ao conectar com o servidor. Tente novamente mais tarde.');
//     }
// });
// Função de Cadastro de Repasse (Modal 1)
const formCadastrarRepasse = document.getElementById('registration-form');
formCadastrarRepasse.addEventListener('submit', async (event) => {
    event.preventDefault();

    const id_talao = document.getElementById('id_talao').value;
    const id_loja = document.getElementById('select-lojas-repasse').value; // Usar ID exclusivo
    const quantidade_repassada = document.getElementById('quantidade_repassada').value;

    const repasseDados = {
        id_talao,
        id_loja,
        quantidade_repassada
    };

    try {
        const response = await fetch('http://localhost:3000/api/talon/manutencao', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(repasseDados),
        });

        const result = await response.json();

        if (response.ok) {
            alert('Repasse cadastrado com sucesso!');
            formCadastrarRepasse.reset();
        } else {
            alert(`Erro ao cadastrar repasse: ${result.message}`);
        }
    } catch (error) {
        console.error('Erro de conexão:', error);
        alert('Erro ao conectar com o servidor. Tente novamente mais tarde.');
    }
});

// Função de Cadastro de Solicitação de Talão (Modal 2)
const formSolicitacao = document.getElementById('registration-form-solicitacao');
formSolicitacao.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Pega o valor do select de lojas no segundo modal
    const id_loja = document.getElementById('select-lojas-solicitacao').value;

    // Objeto de dados a serem enviados para a API
    const solicitacaoDados = {
        id_loja
    };

    try {
        const response = await fetch('http://localhost:3000/api/talon/manutencao/solicitacao', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(solicitacaoDados),
        });

        const result = await response.json();

        if (response.ok) {
            alert('Solicitação de talão cadastrada com sucesso!');
            formSolicitacao.reset();
        } else {
            alert(`Erro ao solicitar talão: ${result.message}`);
        }
    } catch (error) {
        console.error('Erro de conexão:', error);
        alert('Erro ao conectar com o servidor. Tente novamente mais tarde.');
    }
});
