const express = require('express');
const router = express.Router();
const StockController = require('../controllers/stockController');

router.get('/', (req, res) => {
    res.send('Rota estoque ativa');
});

router.get('/stocks', StockController.getStocks);

router.get('/stocks/:id_loja', StockController.getStockByStore);


router.post('/register/stock', StockController.registerStock);

router.put('/edit/stock/:id_loja', StockController.updateStock);

router.delete('/delete/stock/:id_loja', StockController.deleteStock);

module.exports = router;
