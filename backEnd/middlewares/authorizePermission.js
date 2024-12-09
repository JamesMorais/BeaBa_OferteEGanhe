// function authorizePermission(requiredTransaction) {
//     return (req, res, next) => {
//         const { permissions } = req.user; // Pega as permissões do token JWT

//         if (!permissions.includes(requiredTransaction)) {
//             return res.status(403).json({ message: 'Acesso negado. Permissão insuficiente.' });
//         }

//         next();
//     };
// }
function authorizePermission(requiredTransaction) {
    return (req, res, next) => {
        const { permissions } = req.user; // Pega as permissões do token JWT
        // console.log('Permissões do usuário:', permissions); // Log das permissões

        if (!permissions || !permissions.includes(requiredTransaction)) {
            return res.status(403).json({ message: 'Acesso negado. Permissão insuficiente.' });
        }

        next();
    };
}

module.exports = authorizePermission;
