// function authorizePermission(requiredTransaction) {
//     return (req, res, next) => {
//         const { permissions } = req.user; // Pega as permissões do token JWT

//         if (!permissions.includes(requiredTransaction)) {
//             return res.status(403).json({ message: 'Acesso negado. Permissão insuficiente.' });
//         }

//         next();
//     };
// }




// AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

// function authorizePermission(requiredTransactionId) {
//     return (req, res, next) => {
//         const { permissions } = req.user; // Pega as permissões do token JWT

//         if (!permissions || !permissions.includes(requiredTransactionId)) {
//             return res.status(403).json({ message: 'Acesso negado. Permissão insuficiente.' });
//         }

//         next();
//     };
// }
// module.exports = authorizePermission;

// AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

const path = require('path'); // certifique-se de que o 'path' foi importado


function authorizePermission(...requiredTransactionIds) {
    return (req, res, next) => {
        const { permissions } = req.user; // Pega as permissões do token JWT

        // Verifica se o usuário tem alguma das permissões necessárias
        const hasPermission = requiredTransactionIds.some(id => permissions.includes(id));

        if (!permissions || !hasPermission) {
            // Redireciona para a página de "Acesso Negado"
            return res.sendFile(path.join(__dirname, '../../frontEnd/public/views/acessoNegado.html'));
        }
        next();
    };
}

module.exports = authorizePermission;




















// function authorizePermission(requiredTransaction) {
//     return (req, res, next) => {
//         const { permissions } = req.user; // Pega as permissões do token JWT
//         // console.log('Permissões do usuário:', permissions); // Log das permissões

//         if (!permissions || !permissions.includes(requiredTransaction)) {
//             return res.status(403).json({ message: 'Acesso negado. Permissão insuficiente.' });
//         }

//         next();
//     };
// }

// module.exports = authorizePermission;
