const { getTotalPerfis, getTotalUsuarios, getTotalLojas } = require('../models/dashboardModel');

class DashboardController {

    static async getTotalPerfis(req, res) {
        try {
            const totalPerfis = await getTotalPerfis();
            res.json({ total_perfis: totalPerfis });
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Erro ao buscar dados');
        }
    }

    static async getTotalUsuarios(req, res) {
        try {
            const totalUsuarios = await getTotalUsuarios();
            res.json({ total_usuarios: totalUsuarios });
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Erro ao buscar dados');
        }
    }

    static async getTotalLojas(req, res) {
        try {
            const totalLojas = await getTotalLojas();
            res.json({ total_lojas: totalLojas });
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Erro ao buscar dados');
        }
    }
}

module.exports = DashboardController;
