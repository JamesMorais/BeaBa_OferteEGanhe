const { selectStores, selectStore, insertStore } = require('../models/storeModel');

class StoreController {
    static async getStores(req, res) {
        try {
            const lojas = await selectStores();
            res.json(lojas);
        } catch (erro) {
            res.status(500).json({ message: 'Não foi possível selecionar lojas', error: erro.message });
        }
    }

    static async getStoreById(req, res) {
        const id = req.params.id;
        try {
            const loja = await selectStore(id);
            res.json(loja);
        } catch (erro) {
            res.status(500).json({ message: 'Não foi possível selecionar loja', error: erro.message });
        }
    }

    static async createStore(req, res) {
        const { nome_loja, endereco, telefone } = req.body;
        try {
            const novaLoja = await insertStore(nome_loja, endereco, telefone);
            if (novaLoja) {
                res.status(201).json({ message: 'Loja cadastrada com sucesso', loja: novaLoja });
            }
        } catch (erro) {
            res.status(500).json({ message: 'Erro ao tentar cadastrar loja', error: erro.message });
        }
    }
}

module.exports = StoreController;
