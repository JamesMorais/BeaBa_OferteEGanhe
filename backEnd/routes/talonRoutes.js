const express = require('express');
const router = express.Router();
const talonController = require('../controllers/talonController');
const authenticateToken = require('../middlewares/authMiddleware');

// Definindo as rotas e associando aos métodos do controller
router.get('/', talonController.getHome);

router.get('/talons', authenticateToken, talonController.getAllTalons);

router.get('/talons/:id_talao', authenticateToken, talonController.getTalonById);

router.put('/talons/edit/envio', authenticateToken, talonController.updateTalonEnvio);

router.delete('/delete/:id_talao', authenticateToken, talonController.deleteTalon);

router.post('/envio', authenticateToken, talonController.insertEnvioTalon);

router.post('/recebimento', authenticateToken, talonController.insertRecebimentoTalon);

router.get('/talons/enviados', authenticateToken, talonController.getTalonsEnviados);

router.get('/talons/recebidos', authenticateToken, talonController.getTalonsRecebidos);

module.exports = router;
