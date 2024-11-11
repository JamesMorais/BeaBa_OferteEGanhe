const express = require('express');
const router = express.Router();
const { selectProfiles, selectProfile, insertProfile, updateProfile, deleteProfile } = require('../../backEnd/services/profileServices');

router.get('/', async(req, res)=>{
    res.send('Rota perfis ativa')
});

router.get('/profiles', async (req, res) => {
    try {
        const perfis = await selectProfiles();
        res.json(perfis);
    } catch (erro) {
        res.status(500).json({ message: 'Não foi possível selecionar perfis', error: erro.message });
    }
});
router.get('/profiles/:id_perfil', async (req, res) => {
    const id_perfil = req.params.id_perfil;
    try {
        const perfil = await selectProfile(id_perfil);
        if(perfil){
            res.json(perfil);
        }else{
            res.status(404).json({message: 'Perfil não encontrado'}); 
        }
    } catch (erro) {
        res.status(500).json({ message: 'Não foi possível selecionar perfil', error: erro.message });
    }
});
router.post('/register/profile', async (req, res) => {
    const { nome_perfil, descricao } = req.body;
    try {
        const novoPerfil = await insertProfile(nome_perfil, descricao);
        res.status(201).json({ message: 'Perfil cadastrado com sucesso!', profile: novoPerfil });
    } catch (erro) {
        res.status(500).json({ message: 'Não foi possível cadastrar perfil', error: erro.message });
    }
});
router.put('/edit/profile/:id_perfil', async (req, res) => {
    const id_perfil = req.params.id_perfil;
    const { nome_perfil, descricao } = req.body;

    try {
        const perfilAtualizado = await updateProfile(nome_perfil, descricao, id_perfil);
        if(perfilAtualizado){
            res.status(200).json({ message: 'Perfil atualizado com sucesso!', profile: perfilAtualizado });
        }else{
            res.status(404).json({message: 'Perfil não encontrado'});  
        }

    } catch (erro) {
        res.status(500).json({ message: 'Não foi possível atualizar perfil', error: erro.message });
    }
});

router.delete('/delete/:id_perfil', async (req, res) => {
    const id_perfil = req.params.id_perfil;

    try {
        const perfilDeletar = await deleteProfile(id_perfil);
        if(perfilDeletar === 0){
            return res.status(404).json({message: 'perfil não encontrado'});
        }
        res.status(204).send();
    } catch (erro) {
        res.status(500).json({ message: 'Não foi possível deletar perfil', error: erro.message });
    }
});

module.exports = router;