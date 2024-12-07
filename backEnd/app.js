const express = require('express');
const path = require('path');
const cors = require('cors'); 

const app = express();
const userRoutes = require('../backEnd/routes/userRoutes');
const storeRoutes = require('../backEnd/routes/storeRoutes');
const talonRoutes = require('../backEnd/routes/talonRoutes');
const profileRoutes = require('../backEnd/routes/profileRoutes');
const stockRoutes = require('../backEnd/routes/stockRoutes');
const viewRoutes = require('../backEnd/routes/viewRoutes');
const authenticateToken = require('../backEnd/middlewares/authMiddleware');
const authorizePermission = require('../backEnd/middlewares/authorizePermission');


app.use(express.json());

app.use(cors());

// Rota protegida teste
app.get(
    '/secure-endpoint',
    authenticateToken,
    authorizePermission('Cadastrar Novo Envio'),
    (req, res) => {
        res.send('Você tem permissão para acessar esta rota.');
    }
);

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../frontEnd/public')));

// Rotas principais
app.get('/', (req, res) => {
    res.send('Servidor rodando!');
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontEnd/public/views/cadastroUsuario.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/views/login.html'));
});
app.get('/loja', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/views/gerenciamentoLoja.html'));
});

// APIs
app.use('/api/user', userRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/talon', talonRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/stock', stockRoutes);

module.exports = app;
