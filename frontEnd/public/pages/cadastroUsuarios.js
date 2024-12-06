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
