const express = require('express');
const router = express.Router();
const {selectUsers, selectUser, insertUser, updateUser, deleteUser} = require('../services/userServices');


router.get('/', async(req, res)=>{
    res.send('Rota usuário ativa')
})

router.get('/users', async(req, res) =>{
    try{
        const usuarios = await selectUsers();
        res.json(usuarios);
    }catch(erro){
        res.status(500).json({message: 'Erro ao selecionar usuários', error: erro.message})
    }
});
router.get('/users/:matricula', async(req, res) =>{
    const matricula = req.params.matricula
    try{
        const usuario = await selectUser(matricula)
        res.json(usuario);
    }catch(erro){
        res.status(500).json({ message: 'Erro ao selecionar usuários', error: erro.message });
    }
});
router.post('/register', async(req, res)=>{
    const {matricula, nome, email, senha, data_cadastro} = req.body
    try{
        const novoUsuario = await insertUser(matricula, nome, email, senha, data_cadastro)
        res.status(201).json({message: 'Usuário cadastrado com sucesso!', usuario: novoUsuario});
    }catch(erro){
        res.status(500).json({message: 'Erro ao cadastrar usuário', error: erro.message});
    }
});
router.put('/edit/:matricula', async(req, res)=>{
    const matricula = req.params.matricula;
    const {nome, email, senha, data_cadastro} = req.body
    try{
        const usuarioAtualizado = await updateUser(matricula, nome, email, senha, data_cadastro)
        if(usuarioAtualizado){
            res.status(200).json({message: 'Usuário atualizado com sucesso!', usuario: usuarioAtualizado});
        }else{
            res.status(404).json({message: 'Usuário não encontrado'});
        }
    }catch(erro){
        res.status(500).json({message: 'Erro ao tentar atualizar usuário', error: erro.message});
    }
});
router.delete('/delete/:matricula', async(req, res)=>{
    const matricula = req.params.matricula;
    try{
        const usuarioExcluir = await deleteUser(matricula);
        if(usuarioExcluir === 0){
            return res.status(404).json({message: 'usuário não encontrado'});
        }
        res.status(204).send();
    }catch(erro){
        res.status(500).json({message: 'Erro ao tentar excluir usuário', error: erro.message});
    }
})
module.exports = router;