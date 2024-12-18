const { selectStocks, selectStockByStore, insertStock, updateStockByStore, deleteStockByStore } = require('../models/stockModel');

class StockController {

    static async getStocks(req, res) {
        try {
            const estoques = await selectStocks();
            res.json(estoques);
        } catch (erro) {
            res.status(500).json({ message: 'Não foi possível selecionar estoques', error: erro.message });
        }
    }

    static async getStockByStore(req, res) {
        const id_loja = req.params.id_loja;
        try {
            const estoquePorLoja = await selectStockByStore(id_loja);
            if (estoquePorLoja) {
                res.json(estoquePorLoja);
            } else {
                res.status(404).json({ message: 'Estoque não encontrado' });
            }
        } catch (erro) {
            res.status(500).json({ message: 'Não foi possível selecionar estoque por loja', error: erro.message });
        }
    }

    static async registerStock(req, res) {
        const { id_loja, quantidade_recomendada, quantidade_minima } = req.body;
        try {
            const novoEstoque = await insertStock(id_loja, quantidade_recomendada, quantidade_minima);
            if (novoEstoque) {
                res.status(201).json({ message: 'Estoque cadastrado com sucesso!', stock: novoEstoque });
            }
        } catch (erro) {
            if (erro.message === 'Loja não encontrada') {
                res.status(404).json({ message: erro.message });
            } else {
                res.status(500).json({ message: 'Não foi possível cadastrar estoque', error: erro.message });
            }
        }
    }

    static async updateStock(req, res) {
        const id_loja = req.params.id_loja;
        const { quantidade_recomendada, quantidade_minima } = req.body;
        try {
            const estoqueAtualizado = await updateStockByStore(id_loja, quantidade_recomendada, quantidade_minima);
            if (estoqueAtualizado) {
                res.status(200).json(estoqueAtualizado);
            } else {
                res.status(404).json({ message: 'Estoque não encontrado' });
            }
        } catch (erro) {
            res.status(500).json({ message: 'Não foi possível atualizar estoque por loja', error: erro.message });
        }
    }

    static async deleteStock(req, res) {
        const id_loja = req.params.id_loja;
        try {
            const estoqueDeletado = await deleteStockByStore(id_loja);
            if (estoqueDeletado === 0) {
                return res.status(404).json({ message: 'Estoque não encontrado!' });
            }
            res.status(204).send();
        } catch (erro) {
            res.status(500).json({ message: 'Não foi possível deletar estoque', error: erro.message });
        }
    }
}

module.exports = StockController;
