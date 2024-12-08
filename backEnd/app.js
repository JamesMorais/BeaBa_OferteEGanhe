const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // Importando cookie-parser

const app = express();
const userRoutes = require('../backEnd/routes/userRoutes');
const storeRoutes = require('../backEnd/routes/storeRoutes');
const talonRoutes = require('../backEnd/routes/talonRoutes');
const profileRoutes = require('../backEnd/routes/profileRoutes');
const stockRoutes = require('../backEnd/routes/stockRoutes');
const viewRoutes = require('../backEnd/routes/viewRoutes');
const dashboardRoutes = require('../backEnd/routes/dashboardRoutes');
const authenticateToken = require('../backEnd/middlewares/authMiddleware');
const authorizePermission = require('../backEnd/middlewares/authorizePermission');


app.use(express.json());
app.use(cookieParser()); // Adicionando o middleware cookie-parser
app.use(cors({
    origin: 'http://localhost:3000', // Substitua pelo seu domínio frontend
    credentials: true
}));

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

app.get('/usuario', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontEnd/public/views/cadastroUsuario.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/views/login.html'));
});
app.get('/loja', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/views/gerenciamentoLoja.html'));
});
app.get('/envio', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/views/envioTalao.html'));
});
app.get('/recebimento', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/views/recebimentoTalao.html'));
});
app.get('/perfil', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/views/gerenciamentoPerfil.html'));
});
app.get('/associacao', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/views/gerenciamentoPerfilAssc.html'));
});
app.get('/estoque', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/views/gerenciamentoEstoque.html'));
});
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/views/dashboard.html'));
});
app.get('/conta', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/views/conta.html'));
});
// APIs
app.use('/api/user', userRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/talon', talonRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/stock', stockRoutes);
// Nova rota para o dashboard
app.use('/api/dashboard', dashboardRoutes);

module.exports = app;
