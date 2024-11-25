// const express = require('express');
// const path = require('path');
// const router = express.Router();

// router.get('/register', (req, res) => {
//     res.sendFile(path.join(__dirname, '../../frontend/public/cadastroUsuario.html'));
// });

// router.get('/login', (req, res) => {
//     res.sendFile(path.join(__dirname, '../../frontend/public/login.html'));
// });

// // router.get('/dashboard', (req, res) => {
// //     res.sendFile(path.join(__dirname, '../../frontend/public/dashboard.html'));
// // });

// module.exports = router;
const express = require('express');
const path = require('path');
const router = express.Router();

// Rota para página de cadastro de usuário
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public/cadastroUsuario.html'));
});

// Rota para página de login
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public/login.html'));
});

// Rota para página de dashboard (descomentada se necessário)
// router.get('/dashboard', (req, res) => {
//     res.sendFile(path.join(__dirname, '../../frontend/public/dashboard.html'));
// });

module.exports = router;

