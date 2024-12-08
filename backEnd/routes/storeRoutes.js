const express = require('express');
const router = express.Router();
const StoreController = require('../controllers/storeController');
const authenticateToken = require('../middlewares/authMiddleware');

// Rota para verificar se a rota de lojas está ativa
router.get('/', (req, res) => {
    res.send('Rota lojas ativa');
});

// Rota para obter todas as lojas
router.get('/stores', authenticateToken, StoreController.getStores);

// Rota para obter uma loja específica pelo ID
router.get('/stores/:id', authenticateToken, StoreController.getStoreById);

// Rota para cadastrar uma nova loja
router.post('/register/store', authenticateToken, StoreController.createStore);
router.put('/stores/edit/:id_loja', authenticateToken, StoreController.editStore);
router.delete('/delete/:id', authenticateToken, StoreController.deletingStore);

module.exports = router;
