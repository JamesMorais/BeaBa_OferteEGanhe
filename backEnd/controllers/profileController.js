const { selectProfiles, selectProfile, insertProfile, updateProfile, deleteProfile } = require('../models/profileModel');

class ProfileController {

    static async getProfiles(req, res) {
        try {
            const perfis = await selectProfiles();
            res.json(perfis);
        } catch (erro) {
            res.status(500).json({ message: 'Não foi possível selecionar perfis', error: erro.message });
        }
    }

    static async getProfile(req, res) {
        const id_perfil = req.params.id_perfil;
        try {
            const perfil = await selectProfile(id_perfil);
            if (perfil) {
                res.json(perfil);
            } else {
                res.status(404).json({ message: 'Perfil não encontrado' });
            }
        } catch (erro) {
            res.status(500).json({ message: 'Não foi possível selecionar perfil', error: erro.message });
        }
    }

    static async registerProfile(req, res) {
        const { nome_perfil, descricao } = req.body;
        try {
            const novoPerfil = await insertProfile(nome_perfil, descricao);
            res.status(201).json({ message: 'Perfil cadastrado com sucesso!', profile: novoPerfil });
        } catch (erro) {
            res.status(500).json({ message: 'Não foi possível cadastrar perfil', error: erro.message });
        }
    }

    static async updateProfile(req, res) {
        const id_perfil = req.params.id_perfil;
        const { nome_perfil, descricao } = req.body;
        try {
            const perfilAtualizado = await updateProfile(nome_perfil, descricao, id_perfil);
            if (perfilAtualizado) {
                res.status(200).json({ message: 'Perfil atualizado com sucesso!', profile: perfilAtualizado });
            } else {
                res.status(404).json({ message: 'Perfil não encontrado' });
            }
        } catch (erro) {
            res.status(500).json({ message: 'Não foi possível atualizar perfil', error: erro.message });
        }
    }

    static async deleteProfile(req, res) {
        const id_perfil = req.params.id_perfil;
        try {
            const perfilDeletado = await deleteProfile(id_perfil);
            if (perfilDeletado === 0) {
                return res.status(404).json({ message: 'Perfil não encontrado' });
            }
            res.status(204).send();
        } catch (erro) {
            res.status(500).json({ message: 'Não foi possível deletar perfil', error: erro.message });
        }
    }
}

module.exports = ProfileController;
