const { selectUsers, selectUser, selectUserByEmail, insertUser, updateUser, deleteUser } = require('../models/userModel');
const {associateProfile} = require('../models/associationModel')
 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = "sua-chave-secreta-aqui";


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

    // static async registerUser(req, res) {
    //     // const { matricula, nome, email, senha, data_cadastro } = req.body;
    //     // try {
    //     //     const novoUsuario = await insertUser(matricula, nome, email, senha, data_cadastro);
    //     //     res.status(201).json({ message: 'Usuário cadastrado com sucesso!', usuario: novoUsuario });
    //     // } catch (erro) {
    //     //     res.status(500).json({ message: 'Erro ao cadastrar usuário', error: erro.message });
    //     // }
    //     const { matricula, nome, email, senha, data_cadastro, perfis } = req.body;

    //     try {
    //         const novoUsuario = await insertUser(matricula, nome, email, senha, data_cadastro);
    
    //         if (perfis && perfis.length > 0) {
    //             for (const perfilId of perfis) {
    //                 await associateProfile(novoUsuario.matricula, perfilId);
    //             }
    //         }
    
    //         res.status(201).json({ message: 'Usuário cadastrado com sucesso!', usuario: novoUsuario });
    //     } catch (error) {
    //         res.status(500).json({ message: 'Erro ao cadastrar usuário', error: error.message });
    //     }
    // }

    static async registerUser(req, res) {
        const { matricula, nome, email, senha, data_cadastro, perfis } = req.body;
    
        try {
            // Criptografa a senha
            const senhaCriptografada = await bcrypt.hash(senha, 10);
    
            // Insere o usuário com a senha criptografada
            const novoUsuario = await insertUser(matricula, nome, email, senhaCriptografada, data_cadastro);
        
            // Associa perfis se forem fornecidos
            if (perfis && perfis.length > 0) {
                for (const perfilId of perfis) {
                    await associateProfile(novoUsuario.matricula, perfilId);
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
            // Busca o usuário pelo email
            const usuario = await selectUserByEmail(email);
            if (!usuario) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            // Verifica se a senha está correta
            const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
            if (!senhaCorreta) {
                return res.status(401).json({ message: 'Credenciais inválidas' });
            }

            // Gera o token JWT
            const token = jwt.sign({ id: usuario.matricula, email: usuario.email }, SECRET_KEY, { expiresIn: '1h' });

            res.status(200).json({ message: 'Login bem-sucedido', token });
        } catch (erro) {
            res.status(500).json({ message: 'Erro ao efetuar login', error: erro.message });
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
