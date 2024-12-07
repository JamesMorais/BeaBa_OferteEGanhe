const { selectUsers, selectUser, selectUserByEmail, insertUser, updateUser, deleteUser } = require('../models/userModel');
const {getProfilesForUser, getPermissionsForUser} = require('../models/associationModel')
const {associateProfile} = require('../models/associationModel')
 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;


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
        const { matricula, nome, email, senha, perfis } = req.body; 
        try {
            const senhaCriptografada = await bcrypt.hash(senha, 10);
            const novoUsuario = await insertUser(matricula, nome, email, senhaCriptografada);
    
            if (perfis && perfis.length > 0) {
                for (const perfilId of perfis) {
                    await associateProfile(matricula, perfilId);
                }
            }
    
            res.status(201).json({ message: 'Usuário cadastrado com sucesso!', usuario: novoUsuario });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao cadastrar usuário', error: error.message });
        }
    }
    
  
    static async loginUser(req, res) {
        const { email, senha } = req.body;
    
        try {
            const usuario = await selectUserByEmail(email);
            if (!usuario) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }
    
            const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
            if (!senhaCorreta) {
                return res.status(401).json({ message: 'Credenciais inválidas' });
            }
    
            const profiles = await getProfilesForUser(usuario.matricula);
            const permissions = await getPermissionsForUser(usuario.matricula);
    
            const token = jwt.sign(
                { id: usuario.matricula, email: usuario.email, profiles, permissions },
                SECRET_KEY,
                { expiresIn: '8h' }
            );
    
            res.status(200).json({ message: 'Login bem-sucedido', token });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao efetuar login', error: error.message });
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
    static async updateUser(req, res) {
        const matricula = req.params.matricula;  
        const { nome, email, senha } = req.body; 
    
        try {
           
            const usuarioExistente = await selectUser(matricula);
            if (!usuarioExistente) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }
    
            // Se a senha foi fornecida, criptografa a senha antes de atualizar
            let senhaAtualizada = senha;
            if (senha) {
                senhaAtualizada = await bcrypt.hash(senha, 10);
            }
    
            
            const usuarioAtualizado = await updateUser(matricula, nome, email, senhaAtualizada);
            
            if (usuarioAtualizado) {
                res.status(200).json({ message: 'Usuário atualizado com sucesso!', usuario: usuarioAtualizado });
            } else {
                res.status(400).json({ message: 'Erro ao atualizar o usuário' });
            }
        } catch (erro) {
            res.status(500).json({ message: 'Erro ao tentar atualizar usuário', error: erro.message });
        }
    }
    
}

module.exports = UserController;
