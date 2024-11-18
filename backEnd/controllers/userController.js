const { selectUsers, selectUser, insertUser, updateUser, deleteUser } = require('../models/userModel');

class UserController {
    static async getAllUsers(req, res) {
        try {
            const usuarios = await selectUsers();
            res.json(usuarios);
        } catch (erro) {
            res.status(500).json({ message: 'Erro ao selecionar usuários', error: erro.message });
        }
    }

    static async getUserById(req, res) {
        const matricula = req.params.matricula;
        try {
            const usuario = await selectUser(matricula);
            if (usuario) {
                res.json(usuario);
            } else {
                res.status(404).json({ message: 'Usuário não encontrado' });
            }
        } catch (erro) {
            res.status(500).json({ message: 'Erro ao selecionar usuário', error: erro.message });
        }
    }

    static async registerUser(req, res) {
        const { matricula, nome, email, senha, data_cadastro } = req.body;
        try {
            const novoUsuario = await insertUser(matricula, nome, email, senha, data_cadastro);
            res.status(201).json({ message: 'Usuário cadastrado com sucesso!', usuario: novoUsuario });
        } catch (erro) {
            res.status(500).json({ message: 'Erro ao cadastrar usuário', error: erro.message });
        }
    }

    static async updateUser(req, res) {
        const matricula = req.params.matricula;
        const { nome, email, senha, data_cadastro } = req.body;
        try {
            const usuarioAtualizado = await updateUser(matricula, nome, email, senha, data_cadastro);
            if (usuarioAtualizado) {
                res.status(200).json({ message: 'Usuário atualizado com sucesso!', usuario: usuarioAtualizado });
            } else {
                res.status(404).json({ message: 'Usuário não encontrado' });
            }
        } catch (erro) {
            res.status(500).json({ message: 'Erro ao tentar atualizar usuário', error: erro.message });
        }
    }

    static async deleteUser(req, res) {
        const matricula = req.params.matricula;
        try {
            const usuarioExcluir = await deleteUser(matricula);
            if (usuarioExcluir === 0) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }
            res.status(204).send();
        } catch (erro) {
            res.status(500).json({ message: 'Erro ao tentar excluir usuário', error: erro.message });
        }
    }
}

module.exports = UserController;
