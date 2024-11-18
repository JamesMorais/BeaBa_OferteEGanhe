const express = require('express');
const router = express.Router();
const talonController = require('../controllers/talonController');

// Definindo as rotas e associando aos métodos do controller
router.get('/', talonController.ativaRota);

router.get('/talons', talonController.obterTaloes);

router.get('/talons/:id_talao', talonController.obterTalaoPorId);

router.put('/talons/edit/envio', talonController.atualizarEnvioTalao);

router.delete('/delete/:id_talao', talonController.deletarTalao);

router.post('/envio', talonController.registrarEnvioTalao);

router.post('/recebimento', talonController.registrarRecebimentoTalao);

router.get('/talons/enviados', talonController.obterTaloesEnviados);

router.get('/talons/recebidos', talonController.obterTaloesRecebidos);

module.exports = router;
