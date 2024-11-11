const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public/cadastroUsuario.html'));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public/login.html'));
});

// router.get('/dashboard', (req, res) => {
//     res.sendFile(path.join(__dirname, '../../frontend/public/dashboard.html'));
// });

module.exports = router;
