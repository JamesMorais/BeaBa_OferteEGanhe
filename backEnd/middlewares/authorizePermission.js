const path = require('path'); 


function authorizePermission(...requiredTransactionIds) {
    return (req, res, next) => {
        const { permissions } = req.user; // Pega as permissões do token JWT

  
        const hasPermission = requiredTransactionIds.some(id => permissions.includes(id));

        if (!permissions || !hasPermission) {
 
            return res.sendFile(path.join(__dirname, '../../frontEnd/public/views/acessoNegado.html'));
        }
        next();
    };
}

module.exports = authorizePermission;

