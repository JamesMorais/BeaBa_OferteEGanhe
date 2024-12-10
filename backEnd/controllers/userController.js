// const { selectUsers, selectUser, selectUserByEmail, salvarTokenRedefinicao, insertUser, updateUser, deleteUser } = require('../models/userModel');
// const { getProfilesForUser, getPermissionsForUser } = require('../models/associationModel')
// const { associateProfile } = require('../models/associationModel')

// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const crypto = require('crypto');
// const nodemailer = require('nodemailer')

// const SECRET_KEY = process.env.SECRET_KEY;
// const configureTransporter = () => {
//     return nodemailer.createTransport({
//         host: process.env.EMAIL_HOST || 'smtp.gmail.com',
//         port: parseInt(process.env.EMAIL_PORT, 10) || 587,
//         secure: JSON.parse(process.env.EMAIL_SECURE || 'false'),
//         auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASSWORD,
//         },
//     });
// };


// class UserController {
//     static async getAllUsers(req, res) {
//         try {
//             const usuarios = await selectUsers();
//             res.json(usuarios);
//         } catch (erro) {
//             res.status(500).json({ message: 'Erro ao selecionar usuários', error: erro.message });
//         }
//     }

//     static async getUserById(req, res) {
//         const matricula = req.params.matricula;
//         try {
//             const usuario = await selectUser(matricula);
//             if (usuario) {
//                 res.json(usuario);
//             } else {
//                 res.status(404).json({ message: 'Usuário não encontrado' });
//             }
//         } catch (erro) {
//             res.status(500).json({ message: 'Erro ao selecionar usuário', error: erro.message });
//         }
//     }

//     static async registerUser(req, res) {
//         const { matricula, nome, email, senha } = req.body; // Removido perfis
//         try {
//             const senhaCriptografada = await bcrypt.hash(senha, 10);
//             const novoUsuario = await insertUser(matricula, nome, email, senhaCriptografada);

//             res.status(201).json({ message: 'Usuário cadastrado com sucesso!', usuario: novoUsuario });
//         } catch (error) {
//             res.status(500).json({ message: 'Erro ao cadastrar usuário', error: error.message });
//         }
//     }

//     static async loginUser(req, res) {
//         const { email, senha } = req.body;

//         try {
//             const usuario = await selectUserByEmail(email);
//             if (!usuario) {
//                 return res.status(404).json({ message: 'Usuário não encontrado' });
//             }

//             const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
//             if (!senhaCorreta) {
//                 return res.status(401).json({ message: 'Credenciais inválidas' });
//             }

//             // Buscando perfis e permissões
//             const profiles = await getProfilesForUser(usuario.matricula);
//             const permissions = await getPermissionsForUser(usuario.matricula);

//             // Verifique se as funções estão retornando os dados corretamente
//             console.log('Perfis:', profiles);
//             console.log('Permissões:', permissions);

//             const token = jwt.sign(
//                 { id: usuario.matricula, email: usuario.email, profiles, permissions },
//                 SECRET_KEY,
//                 { expiresIn: '8h' }
//             );

//             res.cookie('token', token, {
//                 httpOnly: true,
//                 secure: process.env.NODE_ENV === 'production',
//                 maxAge: 8 * 60 * 60 * 1000,
//                 sameSite: 'Strict'
//             });

//             res.status(200).json({ message: 'Login bem-sucedido' });
//         } catch (error) {
//             res.status(500).json({ message: 'Erro ao efetuar login', error: error.message });
//         }
//     }



//     static async doLogout(req, res) {
//         try {
//             // Limpa o cookie do token
//             res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });

//             res.status(200).json({ message: 'Você foi desconectado com sucesso!' });
//         } catch (err) {
//             console.error('Error during logout:', err);
//             res.status(500).json({ status: 'error', message: 'Erro interno do servidor' });
//         }
//     }

//     static async deleteUser(req, res) {
//         const matricula = req.params.matricula;
//         try {
//             const usuarioExcluir = await deleteUser(matricula);
//             if (usuarioExcluir === 0) {
//                 return res.status(404).json({ message: 'Usuário não encontrado' });
//             }
//             res.status(204).send();
//         } catch (erro) {
//             res.status(500).json({ message: 'Erro ao tentar excluir usuário', error: erro.message });
//         }
//     }
//     static async updateUser(req, res) {
//         const matricula = req.params.matricula;
//         const { nome, email, senha } = req.body;

//         try {

//             const usuarioExistente = await selectUser(matricula);
//             if (!usuarioExistente) {
//                 return res.status(404).json({ message: 'Usuário não encontrado' });
//             }

//             // Se a senha foi fornecida, criptografa a senha antes de atualizar
//             let senhaAtualizada = senha;
//             if (senha) {
//                 senhaAtualizada = await bcrypt.hash(senha, 10);
//             }


//             const usuarioAtualizado = await updateUser(matricula, nome, email, senhaAtualizada);

//             if (usuarioAtualizado) {
//                 res.status(200).json({ message: 'Usuário atualizado com sucesso!', usuario: usuarioAtualizado });
//             } else {
//                 res.status(400).json({ message: 'Erro ao atualizar o usuário' });
//             }
//         } catch (erro) {
//             res.status(500).json({ message: 'Erro ao tentar atualizar usuário', error: erro.message });
//         }
//     }
//     // static async redefinicaoSenha(req, res) {
//     //     const { email } = req.body;

//     //     try {
//     //         const usuario = await selectUserByEmail(email);
//     //         if (!usuario) {
//     //             return res.status(404).json({ message: 'Usuário não encontrado' });
//     //         }

//     //         const token = crypto.randomBytes(32).toString('hex');
//     //         const expiry = new Date(Date.now() + 3600000); // Token válido por 1 hora

//     //         await salvarTokenRedefinicao(email, token, expiry);

//     //         const link = `http://localhost:3000/api/user/reset-password/${token}`;
//     //         // const transporter = nodemailer.createTransport({
//     //         //     service: 'Gmail',
//     //         //     auth: {
//     //         //         user: process.env.EMAIL_USER,
//     //         //         pass: process.env.EMAIL_PASSWORD,
//     //         //     },
//     //         // });
//     //         // const transporter = nodemailer.createTransport({
//     //         //     host: process.env.EMAIL_HOST,    // Exemplo: smtp.gmail.com
//     //         //     port: process.env.EMAIL_PORT,    // Exemplo: 587 para TLS
//     //         //     secure: process.env.EMAIL_SECURE === 'true', // true para SSL, false para TLS
//     //         //     auth: {
//     //         //         user: process.env.EMAIL_USER,        // Email de envio
//     //         //         pass: process.env.EMAIL_PASSWORD,    // Senha ou App Password
//     //         //     },
//     //         // });
//     //         const transporter = nodemailer.createTransport({
//     //             host: process.env.EMAIL_HOST,    // smtp.gmail.com
//     //             port: process.env.EMAIL_PORT,    // 587 para TLS
//     //             secure: process.env.EMAIL_SECURE === 'true', // false para TLS
//     //             auth: {
//     //                 user: process.env.EMAIL_USER,        // Seu email
//     //                 pass: process.env.EMAIL_PASSWORD,    // Senha ou App Password
//     //             },
//     //         });
//     //         transporter.verify((error, success) => {
//     //             if (error) {
//     //                 console.error('Erro na configuração do transporte:', error);
//     //             } else {
//     //                 console.log('Transporte configurado corretamente:', success);
//     //             }
//     //         });



//     //         await transporter.sendMail({
//     //             to: email,
//     //             subject: 'Redefinição de Senha',
//     //             html: `<p>Clique no link para redefinir sua senha: <a href="${link}">${link}</a></p>`,
//     //         });

//     //         res.status(200).json({ message: 'Email de redefinição enviado com sucesso.' });
//     //     } catch (erro) {
//     //         console.error('Erro ao enviar email de redefinição de senha', erro.message);
//     //         res.status(500).json({ message: 'Erro interno do servidor' });
//     //     }
//     // }

//     // Controlador de redefinição de senha
//     static async redefinicaoSenha(req, res) {
//         const { email } = req.body;

//         try {
//             // Verifica se o usuário existe
//             const usuario = await selectUserByEmail(email);
//             if (!usuario) {
//                 return res.status(404).json({ message: 'Usuário não encontrado' });
//             }

//             // Gera o token e salva no banco
//             const token = crypto.randomBytes(32).toString('hex');
//             const expiry = new Date(Date.now() + 3600000); // 1 hora
//             await salvarTokenRedefinicao(email, token, expiry);

//             // Configura o link de redefinição
//             const link = `http://localhost:3000/api/user/reset-password/${token}`;

//             // Configura o transporte e envia o e-mail
//             const transporter = configureTransporter();

//             // Verifica o transporte
//             await transporter.verify();

//             // Envia o e-mail
//             await transporter.sendMail({
//                 to: email,
//                 subject: 'Redefinição de Senha',
//                 html: `<p>Clique no link para redefinir sua senha: <a href="${link}">${link}</a></p>`,
//             });

//             return res.status(200).json({ message: 'Email de redefinição enviado com sucesso.' });
//         } catch (erro) {
//             console.error('Erro ao enviar email de redefinição de senha:', erro.message);
//             return res.status(500).json({ message: 'Erro interno do servidor' });
//         }
//     }
//     static async redefinirSenhaToken(req, res) {
//         const { token } = req.params;
//         const { novaSenha } = req.body;

//         try {
//             const tokenInfo = await obterTokenRedefinicao(token);
//             if (!tokenInfo) {
//                 return res.status(400).json({ message: 'Token inválido ou expirado' });
//             }

//             const senhaCriptografada = await bcrypt.hash(novaSenha, 10);
//             await atualizarSenha(tokenInfo.email, senhaCriptografada);

//             res.status(200).json({ message: 'Senha redefinida com sucesso.' });
//         } catch (erro) {
//             console.error('Erro ao redefinir senha', erro.message);
//             res.status(500).json({ message: 'Erro interno do servidor' });
//         }
//     }

// }

// module.exports = UserController;
const {
    selectUsers,
    selectUser,
    selectUserByEmail,
    salvarTokenRedefinicao,
    insertUser,
    updateUser,
    deleteUser,
    obterTokenRedefinicao,
    atualizarSenha,
} = require('../models/userModel');
const { getProfilesForUser, getPermissionsForUser, associateProfile } = require('../models/associationModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const SECRET_KEY = process.env.SECRET_KEY;



// const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: 587,
//     secure: false, // true para 465, false para outros
//     auth: {
//         user: process.env.EMAIL_USER, // Seu e-mail do Outlook
//         pass: process.env.EMAIL_PASSWORD, // Sua senha ou senha de aplicativo
//     },
//     tls: {
//         ciphers: 'SSLv3'
//     } 
// });
// transporter.verify((error, success) => {
//     if (error) {
//         console.error('Erro na configuração do transporte SMTP:', error);
//     } else {
//         console.log('Servidor SMTP configurado corretamente:', success);
//     }
// });

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'james.rmorais@gmail.com', // Substitua pelo seu e-mail
//         pass: 'ojkg gzhd llht kspl' // Substitua pela senha de aplicativo (não a senha normal)
//     }
// });

// // Definição do e-mail
// const mailOptions = {
//     from: 'james.rmorais@gmail.com', // Remetente
//     to: 'jamesmorais222@hotmail.com', // Destinatário(s)
//     subject: 'Teste de envio de e-mail com Node.js', // Assunto
//     text: 'Olá! Este é um e-mail enviado usando o Node.js e o Nodemailer!' // Conteúdo em texto
//     // Se quiser enviar em HTML, use a propriedade `html`:
//     // html: '<h1>Olá!</h1><p>Este é um e-mail enviado usando o Node.js e o Nodemailer!</p>'
// };

// // Enviar o e-mail
// transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//         return console.log('Erro ao enviar e-mail:', error);
//     }
//     console.log('E-mail enviado com sucesso! ID:', info.messageId);
// });


class UserController {
    // Retorna todos os usuários
    static async getAllUsers(req, res) {
        try {
            const usuarios = await selectUsers();
            res.json(usuarios);
        } catch (erro) {
            res.status(500).json({ message: 'Erro ao selecionar usuários', error: erro.message });
        }
    }

    // Retorna um usuário por ID
    static async getUserById(req, res) {
        const { matricula } = req.params;
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

    // Registra um novo usuário
    static async registerUser(req, res) {
        const { matricula, nome, email, senha } = req.body;
        try {
            const senhaCriptografada = await bcrypt.hash(senha, 10);
            const novoUsuario = await insertUser(matricula, nome, email, senhaCriptografada);

            res.status(201).json({ message: 'Usuário cadastrado com sucesso!', usuario: novoUsuario });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao cadastrar usuário', error: error.message });
        }
    }

    // Realiza o login
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

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 8 * 60 * 60 * 1000,
                sameSite: 'Strict',
            });

            res.status(200).json({ message: 'Login bem-sucedido' });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao efetuar login', error: error.message });
        }
    }

    // Desconecta o usuário
    static async doLogout(req, res) {
        try {
            res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });
            res.status(200).json({ message: 'Você foi desconectado com sucesso!' });
        } catch (err) {
            res.status(500).json({ message: 'Erro interno do servidor', error: err.message });
        }
    }

    // Atualiza um usuário
    static async updateUser(req, res) {
        const { matricula } = req.params;
        const { nome, email, senha } = req.body;

        try {
            const usuarioExistente = await selectUser(matricula);
            if (!usuarioExistente) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            const senhaAtualizada = senha ? await bcrypt.hash(senha, 10) : usuarioExistente.senha;
            const usuarioAtualizado = await updateUser(matricula, nome, email, senhaAtualizada);

            res.status(200).json({ message: 'Usuário atualizado com sucesso!', usuario: usuarioAtualizado });
        } catch (erro) {
            res.status(500).json({ message: 'Erro ao tentar atualizar usuário', error: erro.message });
        }
    }

    // Exclui um usuário
    static async deleteUser(req, res) {
        const { matricula } = req.params;
        try {
            const usuarioExcluir = await deleteUser(matricula);
            if (!usuarioExcluir) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }
            res.status(204).send();
        } catch (erro) {
            res.status(500).json({ message: 'Erro ao tentar excluir usuário', error: erro.message });
        }
    }

    // Redefinição de senha por e-mail
    static async redefinicaoSenha(req, res) {
        const { email } = req.body;

        try {
            const usuario = await selectUserByEmail(email);
            if (!usuario) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            const token = crypto.randomBytes(32).toString('hex');
            const expiry = new Date(Date.now() + 3600000);
            await salvarTokenRedefinicao(email, token, expiry);

            // const link = `http://localhost:3000/api/user/reset-password/${token}`;
            const link = `http://localhost:3000/reset-password/${token}`;
            const transporter = nodemailer.createTransport({
                service: process.env.EMAIL_SERVICE,
                auth: {
                    user: process.env.EMAIL_USER, // Substitua pelo seu e-mail
                    pass: process.env.EMAIL_PASSWORD // Substitua pela senha de aplicativo (não a senha normal)
                }
            });
            // Definição do e-mail
            const mailOptions = {
                from: process.env.EMAIL_USER, // Remetente
                to: email, // Destinatário(s)
                subject: 'Redefinição de Senha', 
                html: `<p>Clique no link para redefinir sua senha: <a href="${link}">${link}</a></p>`,
                // text: 'Olá! Este é um e-mail enviado usando o Node.js e o Nodemailer!' // Conteúdo em texto
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  return console.log('Erro ao enviar e-mail:', error);
                }
                console.log('E-mail enviado com sucesso! ID:', info.messageId);
              });


            res.status(200).json({ message: 'Email de redefinição enviado com sucesso.' });
        } catch (erro) {
            res.status(500).json({ message: 'Erro ao enviar email de redefinição de senha', error: erro.message });
        }
    }

    // Redefine senha com o token
    static async redefinirSenhaToken(req, res) {
        const { token } = req.params;
        const { novaSenha } = req.body;

        try {
            const tokenInfo = await obterTokenRedefinicao(token);
            if (!tokenInfo) {
                return res.status(400).json({ message: 'Token inválido ou expirado' });
            }

            const senhaCriptografada = await bcrypt.hash(novaSenha, 10);
            await atualizarSenha(tokenInfo.email, senhaCriptografada);

            res.status(200).json({ message: 'Senha redefinida com sucesso.' });
        } catch (erro) {
            res.status(500).json({ message: 'Erro ao redefinir senha', error: erro.message });
        }
    }
}

module.exports = UserController;
