const express = require('express');
const app = express();
const userRoutes = require('../backEnd/routes/userRoutes');
const storeRoutes = require('../backEnd/routes/storeRoutes')
const talonRoutes = require('../backEnd/routes/talonRoutes');
const profileRoutes = require('../backEnd/routes/profileRoutes');
const stockRoutes = require('../backEnd/routes/stockRoutes');

// import cors from "cors";
// app.use(cors());

//Provisorio:
// const dashboardRoutes = require('../backEnd/routes/dashboardRoutes')

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Servidor rodando!');
});

app.use('/api/user', userRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/talon', talonRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/stock', stockRoutes)

//provisorio
// app.use('/dashboard', dashboardRoutes);

module.exports = app;
