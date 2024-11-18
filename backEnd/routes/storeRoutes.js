const express = require('express');
const router = express.Router();
const StoreController = require('../controllers/storeController');

// Rota para verificar se a rota de lojas está ativa
router.get('/', (req, res) => {
    res.send('Rota lojas ativa');
});

// Rota para obter todas as lojas
router.get('/stores', StoreController.getAllStores);

// Rota para obter uma loja específica pelo ID
router.get('/stores/:id', StoreController.getStoreById);

// Rota para cadastrar uma nova loja
router.post('/register/store', StoreController.createStore);

module.exports = router;
