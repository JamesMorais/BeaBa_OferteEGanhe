const { selectProfiles, selectProfile, insertProfile, updateProfile, deleteProfile, insertPermissoesPerfil, updatePermissoesPerfil } = require('../models/profileModel');
const { associateProfile, selectProfilesUsers, deleteProfileUser, selectProfileUser, updatePerfilAssc, selectTransacoes, selectTransacoesById } = require('../models/associationModel')

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

    static async getAssociatedProfilesUsers(req, res) {
        try {
            const perfisAssociadosUsers = await selectProfilesUsers();
            res.json(perfisAssociadosUsers);
        } catch (erro) {
            res.status(500).json({ message: 'Não foi possível selecionar perfis', error: erro.message });
        }
    }
    static async getAssociatedProfilesUsersById(req, res) {
        const matricula = req.params.matricula;
        try {
            const perfilUser = await selectProfileUser(matricula);
            if (perfilUser) {
                res.json(perfilUser);
            } else {
                res.status(404).json({ message: 'Perfil Assocido não encontrado' });
            }
        } catch (erro) {
            res.status(500).json({ message: 'Não foi possível selecionar perfil associado', error: erro.message });
        }
    }


    static async registerProfile(req, res) {
        const { nome_perfil, descricao, transacoes } = req.body;
        console.log(req.body);
        try {
            const novoPerfil = await insertProfile(nome_perfil, descricao);

            // Agora insira as transações associadas ao novo perfil
            if (transacoes && transacoes.length > 0) {
                await insertPermissoesPerfil(novoPerfil.id_perfil, transacoes); // Chamada correta
            }

            res.status(201).json({ message: 'Perfil cadastrado com sucesso!', profile: novoPerfil });
        } catch (erro) {
            console.error('Erro ao cadastrar perfil:', erro); // Adicione esta linha
            res.status(500).json({ message: 'Não foi possível cadastrar perfil', error: erro.message });
        }
    }




    static async updateProfile(req, res) {
        const id_perfil = req.params.id_perfil;
        const { nome_perfil, descricao, transacoes } = req.body;

        try {
            const perfilAtualizado = await updateProfile(nome_perfil, descricao, id_perfil);

            if (perfilAtualizado) {
                if (transacoes && transacoes.length > 0) {
                    await updatePermissoesPerfil(id_perfil, transacoes);
                }
                res.status(200).json({ message: 'Perfil atualizado com sucesso!', profile: perfilAtualizado });
            } else {
                res.status(404).json({ message: 'Perfil não encontrado' });
            }
        } catch (erro) {
            console.error(erro.message);
            res.status(500).json({ message: 'Não foi possível atualizar o perfil', error: erro.message });
        }
    }


    static async getProfileWithTransacoes(req, res) {
        const id_perfil = req.params.id_perfil;

        // Verifica se o id_perfil é válido
        if (!id_perfil || isNaN(id_perfil)) {
            return res.status(400).json({ message: "ID do perfil inválido" });
        }

        try {
            const perfil = await selectProfile(id_perfil); // Busca os dados do perfil
            if (!perfil) {
                return res.status(404).json({ message: "Perfil não encontrado" });
            }

            const transacoes = await selectTransacoesById(id_perfil) || []; // Busca as transações associadas
            res.json({ ...perfil, transacoes });
        } catch (erro) {
            console.error("Erro ao buscar perfil e transações:", erro.message);
            res.status(500).json({ message: "Erro ao buscar perfil e transações", error: erro.message });
        }
    }





    static async updateProfileAssociated(req, res) {
        const matricula = req.params.matricula;
        const { id_perfil } = req.body;

        // Validate input
        if (!id_perfil) {
            return res.status(400).json({ message: 'ID do perfil é obrigatório.' });
        }

        try {
            // Call the function that updates the associated profile in the database
            const perfilAtualizado = await updatePerfilAssc(matricula, id_perfil); // Ensure this function is defined

            if (perfilAtualizado) {
                res.status(200).json({ message: 'Perfil Associado atualizado com sucesso!', profile: perfilAtualizado });
            } else {
                res.status(404).json({ message: 'Perfil Associado não encontrado' });
            }
        } catch (erro) {
            console.error('Erro ao atualizar perfil associado:', erro); // Log the error for debugging
            res.status(500).json({ message: 'Não foi possível atualizar perfil associado', error: erro.message });
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
    // PARTE RELACIONADA A ASSOCIAÇÃO ENTRE PERFIL E USUARIO
    static async associateProfileUser(req, res) {
        const { matricula, id_perfil } = req.body; // Extraindo os dados do corpo da requisição

        // Verificando se matricula e id_perfil foram fornecidos
        if (!matricula || !id_perfil) {
            return res.status(400).json({ message: 'Matricula e id_perfil são obrigatórios' });
        }

        try {
            const associacaoPerfil = await associateProfile(matricula, id_perfil);

            // Se a associação for bem-sucedida, retornamos uma resposta de sucesso
            res.status(201).json({ message: 'Perfil associado com sucesso!', profile: { matricula, id_perfil } });
        } catch (erro) {
            // Se ocorrer um erro, retornamos uma mensagem de erro
            if (erro.code === '23503') { // Código de erro para violação de chave estrangeira
                return res.status(404).json({ message: 'Matricula ou perfil não encontrado' });
            }
            res.status(500).json({ message: 'Não foi possível associar perfil a usuário', error: erro.message });
        }
    }

    static async deleteAssociations(req, res) {
        const matricula = req.params.matricula;
        try {
            const perfilUserDeletado = await deleteProfileUser(matricula);
            if (perfilUserDeletado === 0) {
                return res.status(404).json({ message: 'Matricula ou perfil não encontrados' });
            }
            res.status(204).send();
        } catch (erro) {
            res.status(500).json({ message: 'Não foi possível deletar essa associação', error: erro.message });
        }
    }
    static async getTransacoes(req, res) {
        try {
            const transacoes = await selectTransacoes();
            res.json(transacoes);
        } catch (erro) {
            res.status(500).json({ message: 'Não foi possível selecionar transações', error: erro.message });
        }
    }
    static async getTransacoesByid(req, res) {
        const id_perfil = req.params.id_perfil;
        try {
            const transacao = await selectTransacoesById(id_perfil);
            if (transacao) {
                res.json(transacao);
            } else {
                res.status(404).json({ message: 'Perfil com transações não encontrado' });
            }
        } catch (erro) {
            res.status(500).json({ message: 'Não foi possível selecionar essa transação', error: erro.message });
        }
    }
}

module.exports = ProfileController;
