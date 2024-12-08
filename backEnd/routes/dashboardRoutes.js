const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboardController');
const authenticateToken = require('../middlewares/authMiddleware');


router.get('/dashboard/perfis', authenticateToken, DashboardController.getTotalPerfis);

router.get('/dashboard/usuarios', authenticateToken, DashboardController.getTotalUsuarios);

router.get('/dashboard/lojas', authenticateToken, DashboardController.getTotalLojas);

module.exports = router;
