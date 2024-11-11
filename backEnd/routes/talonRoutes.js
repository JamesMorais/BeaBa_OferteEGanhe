const express = require('express');
const router = express.Router();
const { selectTalons, selectTalon,/*, insertTalon, *//*updateTalon,*/ deleteTalon} = require('../services/talonService');
const {insertEnvioTalon, insertRecebimentoTalon, selectTalonsEnviados, selectTalonsRecebidos, updateTalonsEnviados } = require('../services/manageTalonsServices')


router.get('/', async(req, res)=>{
    res.send('Rota talão ativa')
})

router.get('/talons', async (req, res) => {
    try {
        const taloes = await selectTalons();
        res.json(taloes);
    } catch (erro) {
        res.status(500).json({ message: 'Não foi possível selecionar talões', error: erro.message })
    }
});

router.get('/talons/:id_talao', async (req, res) => {
    const id_talao = req.params.id_talao;
    try {
        const talao = await selectTalon(id_talao);
        res.json(talao);
    } catch (erro) {
        res.status(500).json({ message: 'Não foi possível selecionar talão', error: erro.message })
    }
});

router.put('/talons/edit/envio', async (req, res) => {
    const { id_envio, id_talao, id_loja, quantidade_enviada, data_envio } = req.body;

    if (!id_envio || !id_talao || !id_loja || !quantidade_enviada || !data_envio) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
        const updatedTalon = await updateTalonsEnviados(id_envio, id_talao, id_loja, quantidade_enviada, data_envio);
        res.status(200).json({ message: 'Talão enviado atualizado com sucesso.', updatedTalon });
    } catch (error) {
        console.error('Erro na atualização do talão enviado:', error);
        res.status(500).json({ error: 'Erro ao atualizar o talão enviado.' });
    }
});

router.delete('/delete/:id_talao', async (req, res) => {
    const id_talao = req.params.id_talao;
    try {
        const talaoDeletar = await deleteTalon(id_talao);
        if (talaoDeletar === 0) {
            return res.status(404).json({ message: 'Talão não encontrado!' });
        }
        res.status(204).send();
    } catch (erro) {
        res.status(500).json({ message: 'Não foi possível deteletar talão', error: erro.message })
    }
});
router.post('/envio', async (req, res) => {
    const { id_loja, quantidade_enviada, data_envio } = req.body;
    try {
        const result = await insertEnvioTalon(id_loja, quantidade_enviada, data_envio);
        res.status(201).json({ message: 'Envio registrado com sucesso', envio: result.envio, talon: result.talon });
    } catch (erro) {
        res.status(500).json({ message: 'Não foi possível registrar o envio', error: erro.message });
    }
});

router.post('/recebimento', async (req, res) => {
    const { id_talao, id_loja, quantidade_recebida, data_recebimento } = req.body;

    try {
        if (!id_talao || !id_loja || !quantidade_recebida || !data_recebimento) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        const result = await insertRecebimentoTalon(id_talao, id_loja, quantidade_recebida, data_recebimento);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao registrar recebimento de talão' });
    }
});


router.get('/talons/enviados', async (req, res) => {
    try {
        const talonsEnviados = await selectTalonsEnviados();
        res.json(talonsEnviados);
    } catch (erro) {
        res.status(500).json({ message: 'Não foi possível selecionar talões enviados', error: erro.message });
    }
});


router.get('/talons/recebidos', async (req, res) => {
    try {
        const talonsRecebidos = await selectTalonsRecebidos();
        res.json(talonsRecebidos);
    } catch (erro) {
        res.status(500).json({ message: 'Não foi possível selecionar talões recebidos', error: erro.message });
    }
});


module.exports = router;