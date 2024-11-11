const express = require('express');
const router = express.Router();
const pool = require('../config/dataBase')

router.get('/dashboard/perfis', async (req, res) => {
    try {
        const result = await pool.query('SELECT COUNT(*) FROM public.perfil');
        res.json({ total_perfis: result.rows[0].count });
    } catch (error) {
        console.error('Erro ao consultar a quantidade de perfis:', error);
        res.status(500).send('Erro ao buscar dados');
    }
});
router.get('/dashboard/usuarios', async (req, res) => {
    try {
        const result = await pool.query('SELECT COUNT(*) FROM public.usuario');
        res.json({ total_usuarios: result.rows[0].count });
    } catch (error) {
        console.error('Erro ao consultar a quantidade de usuários:', error);
        res.status(500).send('Erro ao buscar dados');
    }
});
router.get('/dashboard/lojas', async (req, res) => {
    try {
        const result = await pool.query('SELECT COUNT(*) FROM public.loja');
        res.json({ total_lojas: result.rows[0].count });
    } catch (error) {
        console.error('Erro ao consultar a quantidade de lojas:', error);
        res.status(500).send('Erro ao buscar dados');
    }
});

module.exports = router;