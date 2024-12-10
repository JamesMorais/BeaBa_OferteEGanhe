// document.getElementById('reset-form').addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const token = document.getElementById('token').value;
//     const newPassword = document.getElementById('new-password').value;

//     try {
//         const response = await fetch(`http:localhost:3000/api/user/reset-password/${token}`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ novaSenha: newPassword }),
//         });

//         if (response.ok) {
//             alert('Senha redefinida com sucesso!');
//             window.location.href = '/login'; // Redireciona para a página de login
//         } else {
//             const error = await response.json();
//             alert(`Erro: ${error.message}`);
//         }
//     } catch (err) {
//         console.error('Erro ao redefinir senha:', err);
//         alert('Ocorreu um erro. Tente novamente mais tarde.');
//     }
// });

document.getElementById('reset-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = document.getElementById('token').value;
    const newPassword = document.getElementById('new-password').value;

    try {
        const response = await fetch(`http://localhost:3000/api/user/reset-password/${token}`, { // Corrigido aqui
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ novaSenha: newPassword }),
        });

        if (response.ok) {
            alert('Senha redefinida com sucesso!');
            window.location.href = '/login'; // Redireciona para a página de login
        } else {
            const error = await response.json();
            alert(`Erro: ${error.message}`);
        }
    } catch (err) {
        console.error('Erro ao redefinir senha:', err);
        alert('Ocorreu um erro. Tente novamente mais tarde.');
    }
});
