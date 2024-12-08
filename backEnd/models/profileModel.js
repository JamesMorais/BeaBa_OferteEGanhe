const pool = require('../config/dataBase')

async function selectProfiles() {
    try {
        const res = await pool.query('SELECT * FROM perfil')
        return res.rows;
    } catch (erro) {
        console.error('Não foi possível Selecionar perfis', erro.message)
    }
};
async function selectProfile(id_perfil) {
    const query = `SELECT * FROM perfil WHERE id_perfil = $1`
    const value = [id_perfil];
    try {
        const res = await pool.query(query, value);
        return res.rows[0];
    } catch (erro) {
        console.error('Não foi possível selecionar perfil', erro.message);
    }
}
async function insertProfile(nome_perfil, descricao) {
    const query = `
    INSERT INTO perfil(nome_perfil, descricao)
    VALUES($1, $2)
    RETURNING *;
    `
    const values = [nome_perfil, descricao];

    try {
        const res = await pool.query(query, values);
        return res.rows[0];

    } catch (erro) {
        console.error('Não foi possível cadastrar perfil', erro.message);
    }
}

async function updateProfile( nome_perfil, descricao, id_perfil) {
    const query = `
    UPDATE perfil 
    SET nome_perfil = $1,
        descricao = $2
    WHERE id_perfil = $3
    RETURNING *;
    `
    const values =[nome_perfil, descricao, id_perfil]

    try{
        const res = await pool.query(query, values);
        return res.rows[0];
    }catch(erro){
        console.error('Não foi possível atualizar perfil', erro.message);  
    }
}
async function deleteProfile(id_perfil){
    const query = `DELETE FROM perfil WHERE id_perfil = $1;`
    const value = [id_perfil];

    try{
        const res = await pool.query(query, value);
        return res.rowCount;
    }catch(erro){
        console.error('Erro ao deletar perfil', erro.message);
        throw erro;
    }
}

module.exports = { selectProfiles, selectProfile, insertProfile, updateProfile, deleteProfile }