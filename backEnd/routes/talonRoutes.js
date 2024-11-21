const express = require('express');
const router = express.Router();
const talonController = require('../controllers/talonController');

// Definindo as rotas e associando aos métodos do controller
router.get('/', talonController.getHome);

router.get('/talons', talonController.getAllTalons);

router.get('/talons/:id_talao', talonController.getTalonById);

router.put('/talons/edit/envio', talonController.updateTalonEnvio);

router.delete('/delete/:id_talao', talonController.deleteTalon);

router.post('/envio', talonController.insertEnvioTalon);

router.post('/recebimento', talonController.insertRecebimentoTalon);

router.get('/talons/enviados', talonController.getTalonsEnviados);

router.get('/talons/recebidos', talonController.getTalonsRecebidos);

module.exports = router;
