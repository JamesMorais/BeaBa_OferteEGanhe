const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboardController');


router.get('/dashboard/perfis', DashboardController.getTotalPerfis);

router.get('/dashboard/usuarios', DashboardController.getTotalUsuarios);

router.get('/dashboard/lojas', DashboardController.getTotalLojas);

module.exports = router;
