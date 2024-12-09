const form = document.getElementById('login-form');

form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Garante que o comportamento padrão do formulário seja prevenido.

    const email = document.getElementById('email').value.trim(); // Remove espaços extras
    const senha = document.getElementById('password').value.trim();

    if (!email || !senha) {
        alert('Por favor, preencha todos os campos.');
        return; // Sai da função se os campos não forem preenchidos.
    }

    const loginData = {
        email,
        senha,
    };

    try {
        const response = await fetch('http://localhost:3000/api/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                
                // Se você estiver usando cookies, não precisa adicionar o token aqui
            },
            body: JSON.stringify(loginData),
            credentials: 'include'
        });

        const result = await response.json();

        if (response.ok) {
            // O token é armazenado em um cookie, não é necessário exibi-lo
            alert('Login bem-sucedido! Redirecionando...');
            window.location.href = 'http://localhost:3000/conta'; // Redireciona para a página desejada
        } else {
            alert(`Erro ao efetuar login: ${result.message}`);
        }
    } catch (error) {
        console.error('Erro de conexão:', error);
        alert('Erro ao conectar com o servidor. Tente novamente mais tarde.');
    }
});