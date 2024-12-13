const form = document.getElementById('login-form');

form.addEventListener('submit', async (event) => {
    event.preventDefault(); 

    const email = document.getElementById('email').value.trim(); 
    const senha = document.getElementById('password').value.trim();

    if (!email || !senha) {
        alert('Por favor, preencha todos os campos.');
        return; 
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
                
            },
            body: JSON.stringify(loginData),
            credentials: 'include'
        });

        const result = await response.json();

        if (response.ok) {
            alert('Login bem-sucedido! Redirecionando...');
            window.location.href = 'http://localhost:3000/conta'; 
        } else {
            alert(`Erro ao efetuar login: ${result.message}`);
        }
    } catch (error) {
        console.error('Erro de conexão:', error);
        alert('Erro ao conectar com o servidor. Tente novamente mais tarde.');
    }
});