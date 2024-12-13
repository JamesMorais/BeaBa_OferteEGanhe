const express = require('express');
const router = express.Router();
const StoreController = require('../controllers/storeController');
const authenticateToken = require('../middlewares/authMiddleware');


router.get('/', (req, res) => {
    res.send('Rota lojas ativa');
});


router.get('/stores', authenticateToken, StoreController.getStores);

router.get('/stores/:id', authenticateToken, StoreController.getStoreById);


router.post('/register/store', authenticateToken, StoreController.createStore);
router.put('/stores/edit/:id_loja', authenticateToken, StoreController.editStore);
router.delete('/delete/:id', authenticateToken, StoreController.deletingStore);

module.exports = router;
