const talonModel = require('../models/talonModel');
const manageTalonsModel = require('../models/manageTalonsModel');

class TalonController {

    static async getHome(req, res) {
        res.send('Rota talão ativa');
    }

    static async getAllTalons(req, res) {
        try {
            const taloes = await talonModel.selectTalons();
            res.json(taloes);
        } catch (erro) {
            res.status(500).json({ message: 'Não foi possível selecionar talões', error: erro.message });
        }
    }

    static async getTalonById(req, res) {
        const id_talao = req.params.id_talao;
        try {
            const talao = await talonModel.selectTalon(id_talao);
            res.json(talao);
        } catch (erro) {
            res.status(500).json({ message: 'Não foi possível selecionar talão', error: erro.message });
        }
    }

    // static async updateTalonEnvio(req, res) {
    //     const id_talao = req.params.id_talao;
    //     const { id_envio, id_loja, quantidade_enviada, data_envio } = req.body;

    //     if (!id_envio || !id_talao || !id_loja || !quantidade_enviada || !data_envio) {
    //         return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    //     }

    //     try {
    //         const updatedTalon = await manageTalonsModel.updateTalonsEnviados(data_envio);
    //         res.status(200).json({ message: 'Talão enviado atualizado com sucesso.', updatedTalon });
    //     } catch (error) {
    //         console.error('Erro na atualização do talão enviado:', error);
    //         res.status(500).json({ error: 'Erro ao atualizar o talão enviado.' });
    //     }
    // }

    static async updateTalonEnvio(req, res) {
        const id_talao = req.params.id_talao;  // Agora pega o id_talao da URL
        const { data_envio } = req.body;  // Apenas data_envio é necessária
    
        if (!id_talao || !data_envio) {
            return res.status(400).json({ error: 'id_talao e data_envio são obrigatórios.' });
        }
    
        try {
            const updatedTalon = await manageTalonsModel.updateTalonsEnviados(id_talao, data_envio);  // Chama a função passando id_talao
            res.status(200).json({ message: 'Talão enviado atualizado com sucesso.', updatedTalon });
        } catch (error) {
            console.error('Erro na atualização do talão enviado:', error);
            res.status(500).json({ error: 'Erro ao atualizar o talão enviado.' });
        }
    }
    

    static async deleteTalon(req, res) {
        const id_talao = req.params.id_talao;
        try {
            const talaoDeletar = await talonModel.deleteTalon(id_talao);
            if (talaoDeletar === 0) {
                return res.status(404).json({ message: 'Talão não encontrado!' });
            }
            res.status(204).send();
        } catch (erro) {
            res.status(500).json({ message: 'Não foi possível deletar talão', error: erro.message });
        }
    }

    static async insertEnvioTalon(req, res) {
        const { id_loja, quantidade_enviada, data_envio } = req.body;
        try {
            const result = await manageTalonsModel.insertEnvioTalon(id_loja, quantidade_enviada, data_envio);
            res.status(201).json({ message: 'Envio registrado com sucesso', envio: result.envio, talon: result.talon });
        } catch (erro) {
            res.status(500).json({ message: 'Não foi possível registrar o envio', error: erro.message });
        }
    }

    static async insertRecebimentoTalon(req, res) {
        const { id_talao, id_loja, quantidade_recebida, data_recebimento } = req.body;
        try {
            if (!id_talao || !id_loja || !quantidade_recebida || !data_recebimento) {
                return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
            }

            const result = await manageTalonsModel.insertRecebimentoTalon(id_talao, id_loja, quantidade_recebida, data_recebimento);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao registrar recebimento de talão' });
        }
    }

    static async getTalonsEnviados(req, res) {
        try {
            const talonsEnviados = await manageTalonsModel.selectTalonsEnviados();
            res.json(talonsEnviados);
        } catch (erro) {
            res.status(500).json({ message: 'Não foi possível selecionar talões enviados', error: erro.message });
        }
    }
    static async getTalonsEnviadosById(req, res) {
        const id_talao = req.params.id_talao;
        try {
            const talonEnviado = await manageTalonsModel.selectTalonEnviadoById(id_talao);
            res.json(talonEnviado);
        } catch (erro) {
            res.status(500).json({ message: 'Não foi possível selecionar o talões enviado pelo id', error: erro.message });
        }
    }

    static async getTalonsRecebidos(req, res) {
        try {
            const talonsRecebidos = await manageTalonsModel.selectTalonsRecebidos();
            res.json(talonsRecebidos);
        } catch (erro) {
            res.status(500).json({ message: 'Não foi possível selecionar talões recebidos', error: erro.message });
        }
    }
}

module.exports = TalonController;
