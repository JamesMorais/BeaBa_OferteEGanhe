const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.split(" ")[1]; // Token no formato "Bearer <token>"
    if (!token) return res.status(401).json({ message: 'Token não fornecido' });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; // Adiciona o usuário decodificado ao request
        next();
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expirado' });
        }
        return res.status(403).json({ message: 'Token inválido' });
    }
}
 
module.exports = authenticateToken;
