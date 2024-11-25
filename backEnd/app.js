const express = require('express');
const path = require('path');  // Adicione esta linha para importar o módulo path
const app = express();
const userRoutes = require('../backEnd/routes/userRoutes');
const storeRoutes = require('../backEnd/routes/storeRoutes');
const talonRoutes = require('../backEnd/routes/talonRoutes');
const profileRoutes = require('../backEnd/routes/profileRoutes');
const stockRoutes = require('../backEnd/routes/stockRoutes');
const viewRoutes = require('../backEnd/routes/viewRoutes');

// import cors from "cors";
// app.use(cors());

// Provisorio:
// const dashboardRoutes = require('../backEnd/routes/dashboardRoutes')

app.use(express.json());

// Aqui você está usando o path, agora que ele está importado, não ocorrerá o erro
app.use(express.static(path.join(__dirname, '../frontEnd/public')));

app.get('/', (req, res) => {
    res.send('Servidor rodando!');
});

app.use('/api/user', userRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/talon', talonRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/stock', stockRoutes);

app.use('/pages', viewRoutes);

//provisorio
// app.use('/dashboard', dashboardRoutes);

module.exports = app;
