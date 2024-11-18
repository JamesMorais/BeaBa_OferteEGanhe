const pool = require('../config/dataBase');

async function getTotalPerfis() {
    try {
        const result = await pool.query('SELECT COUNT(*) FROM public.perfil');
        return result.rows[0].count;
    } catch (error) {
        throw new Error('Erro ao consultar a quantidade de perfis');
    }
}

async function getTotalUsuarios() {
    try {
        const result = await pool.query('SELECT COUNT(*) FROM public.usuario');
        return result.rows[0].count;
    } catch (error) {
        throw new Error('Erro ao consultar a quantidade de usuários');
    }
}

async function getTotalLojas() {
    try {
        const result = await pool.query('SELECT COUNT(*) FROM public.loja');
        return result.rows[0].count;
    } catch (error) {
        throw new Error('Erro ao consultar a quantidade de lojas');
    }
}

module.exports = {
    getTotalPerfis,
    getTotalUsuarios,
    getTotalLojas
};
