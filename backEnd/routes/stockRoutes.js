const express = require('express');
const router = express.Router();
const StockController = require('../controllers/stockController');
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/', (req, res) => {
    res.send('Rota estoque ativa');
});

router.get('/stocks', /*authenticateToken,*/ StockController.getStocks);

router.get('/stocks/:id_loja', /*authenticateToken,*/ StockController.getStockByStore);


router.post('/register/stock', /*authenticateToken,*/ StockController.registerStock);

router.put('/edit/stock/:id_loja',/* authenticateToken,*/ StockController.updateStock);

router.delete('/delete/stock/:id_loja', /*authenticateToken,*/ StockController.deleteStock);

module.exports = router;
