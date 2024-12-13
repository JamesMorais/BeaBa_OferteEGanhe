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
// app.get(
//     '/secure-endpoint',
//     authenticateToken,
//     authorizePermission('Visualizar Histórico de Envios'),
//     (req, res) => {
//         res.send('Você tem permissão para acessar esta rota.');
//     }
// );
app.get(
    '/secure-endpoint',
    authenticateToken,
    authorizePermission(1), // Supondo que 1 seja o ID da transação que você deseja verificar
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

app.get('/usuario', authenticateToken, authorizePermission(1,18), (req, res) => {
    res.sendFile(path.join(__dirname, '../frontEnd/public/views/cadastroUsuario.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/views/login.html'));
});
app.get('/loja', authenticateToken, authorizePermission(13), (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/views/gerenciamentoLoja.html'));
});
app.get('/envio', authenticateToken, authorizePermission(13), (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/views/envioTalao.html'));
});
app.get('/recebimento', authenticateToken, authorizePermission(13, 14, 15, 16, 17), (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/views/recebimentoTalao.html'));
});
app.get('/perfil', authenticateToken, authorizePermission(7,8, 9), (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/views/gerenciamentoPerfil.html'));
});
app.get('/associacao', authenticateToken, authorizePermission(7,8, 9), (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/views/gerenciamentoPerfilAssc.html'));
});
app.get('/estoque', authenticateToken, authorizePermission(10, 11, 12), (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/views/gerenciamentoEstoque.html'));
});
app.get('/dashboard', authenticateToken, authorizePermission(18), (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/views/dashboard.html'));
});
app.get('/conta', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/views/conta.html'));
});
app.get('/manutencao', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/views/manutencao.html'));
});
app.get('/redefinir-senha', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/views/enviaEmail.html'));
});
app.get('/link-enviado', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/views/envioLink.html'));
});
app.get('/reset-password/:token', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/views/redefinicao.html'));
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
