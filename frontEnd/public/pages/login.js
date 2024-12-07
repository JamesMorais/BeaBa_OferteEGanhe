// const form = document.getElementById('login-form');

// form.addEventListener('submit', async (event) => {
//     event.preventDefault();


//     const email = document.getElementById('email').value;
//     const senha = document.getElementById('password').value;


//     const loginData = {
//         email,
//         senha,
//     };

//     try {
//         const response = await fetch('http://localhost:3000/api/user/login', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(loginData),
//         });

//         const result = await response.json();

//         if (response.ok) {
//             alert('Login bem-sucedido!');
//             console.log('Token recebido:', result.token); // Exibe o token no console
//             window.location.href = 'http://localhost:3000/register';
//         } else {
//             alert(`Erro ao efetuar login: ${result.message}`);
//         }
//     } catch (error) {
//         console.error('Erro de conexão:', error);
//         alert('Erro ao conectar com o servidor. Tente novamente mais tarde.');
//     }
// });
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
            },
            body: JSON.stringify(loginData),
        });

        const result = await response.json();

        if (response.ok) {
            console.log('Token recebido:', result.token); // Exibe o token no console
            
            // Redireciona para a página de registro após login bem-sucedido
            alert('Login bem-sucedido! Redirecionando...');
            window.location.href = 'http://localhost:3000/register';
        } else {
            alert(`Erro ao efetuar login: ${result.message}`);
        }
    } catch (error) {
        console.error('Erro de conexão:', error);
        alert('Erro ao conectar com o servidor. Tente novamente mais tarde.');
    }
});
