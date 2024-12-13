const express = require('express');
const router = express.Router();
const talonController = require('../controllers/talonController');
const authenticateToken = require('../middlewares/authMiddleware');

// Rotas estáticas devem vir antes das dinâmicas
router.get('/talons/enviados', authenticateToken, talonController.getTalonsEnviados);
router.get('/talons/recebidos', authenticateToken, talonController.getTalonsRecebidos);
router.get('/talons/envios/exportar', authenticateToken, talonController.exportTalonsEnviadosCSV);

// Rotas dinâmicas
router.get('/talons/:id_talao', authenticateToken, talonController.getTalonById);

// Outras rotas
router.get('/', talonController.getHome);
router.get('/talons', /*authenticateToken,*/ talonController.getAllTalons);
router.get('/enviados/:id_talao', /*authenticateToken,*/ talonController.getTalonsEnviadosById);
router.put('/talons/edit/:id_talao', /*authenticateToken,*/ talonController.updateTalonEnvio);
router.delete('/delete/:id_talao', /*authenticateToken,*/ talonController.deleteTalon);
router.post('/envio', /*authenticateToken,*/ talonController.insertEnvioTalon);
router.post('/recebimento', /*authenticateToken,*/ talonController.insertRecebimentoTalon);
router.post('/manutencao', /*authenticateToken,*/ talonController.insertRepasseTalon);
router.post('/manutencao/solicitacao', /*authenticateToken,*/ talonController.insertSolicitacaoTalon);
module.exports = router;
