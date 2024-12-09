const formCadastrarRepasse = document.getElementById('registration-form');
formCadastrarRepasse.addEventListener('submit', async (event) => {
    event.preventDefault();

    const id_talao = document.getElementById('id_talao').value
    const id_loja = document.getElementById('select-lojas').value;
    const quantidade_repassada = document.getElementById('quantidade_repassada').value;

    const repasseDados = {
        id_talao,
        id_loja,
        quantidade_repassada
    };

    try {
        const response = await fetch('http://localhost:3000/api/talon/repasse', {
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