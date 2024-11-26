const form = document.getElementById('login-form');

form.addEventListener('submit', async (event) => {
    event.preventDefault();


    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value;


    const loginData = {
        email,
        senha,
    };

    try {
        const response = await fetch('http://localhost:3000/api/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        });

        const result = await response.json();

        if (response.ok) {
            alert('Login bem-sucedido!');
            console.log('Token recebido:', result.token); // Exibe o token no console
            // Redirecione para o dashboard ou outra página, se necessário
            // window.location.href = '/dashboard';
        } else {
            alert(`Erro ao efetuar login: ${result.message}`);
        }
    } catch (error) {
        console.error('Erro de conexão:', error);
        alert('Erro ao conectar com o servidor. Tente novamente mais tarde.');
    }
});
