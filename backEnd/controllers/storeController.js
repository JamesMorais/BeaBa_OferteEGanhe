const { selectStores, selectStore, insertStore, updateStore, deleteStore } = require('../models/storeModel');

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
        const {id_loja, nome_loja} = req.body;
        try {
            const novaLoja = await insertStore(id_loja, nome_loja);
            if (novaLoja) {
                res.status(201).json({ message: 'Loja cadastrada com sucesso', loja: novaLoja });
            }
        } catch (erro) {
            res.status(500).json({ message: 'Erro ao tentar cadastrar loja', error: erro.message });
        }
    }
    static async editStore(req, res){
        const id_loja = req.params.id_loja;
        const {nome_loja } = req.body;
        try {
            // Call the updateStore method with the new details
            const lojaAtualizada = await updateStore(id_loja, nome_loja);
    
            if (lojaAtualizada) {
                res.status(200).json({ message: 'Loja atualizada com sucesso', loja: lojaAtualizada });
            } else {
                res.status(404).json({ message: 'Loja não encontrada' });
            }
        } catch (erro) {
            res.status(500).json({ message: 'Erro ao tentar atualizar loja', error: erro.message });
        }
    }
    static async deletingStore(req, res) {
        const id_loja = req.params.id;
        try {
            const lojaDeletada = await deleteStore(id_loja);
            if (lojaDeletada) {
                res.status(200).json({ message: 'Loja deletada com sucesso' });
            } else {
                res.status(404).json({ message: 'Loja não encontrada' });
            }
        } catch (erro) {
            res.status(500).json({ message: 'Erro ao tentar deletar loja', error: erro.message });
        }
    }
}

module.exports = StoreController;
