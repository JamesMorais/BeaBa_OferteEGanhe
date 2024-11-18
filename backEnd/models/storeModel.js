const pool = require('../config/dataBase')

async function selectStores(){
    try{
        const res = await pool.query('SELECT * FROM loja');
        return res.rows;
    }catch(erro){
        console.error('Erro ao selecionar lojas', erro.message)
    }
}

async function selectStore(id_loja){
    const query = `SELECT * FROM loja WHERE id_loja = $1`;
    const value = [id_loja];

    try{
        const res = await pool.query(query, value);
        return res.rows[0];
    }catch(erro){
        console.error('Erro ao tentar selecionar loja', erro.message);
    }
}
async function insertStore( nome_loja, endereco, telefone){
    const query = `
    INSERT INTO loja(nome_loja, endereco, telefone)
    VALUES($1, $2, $3) 
    RETURNING *
    `
    const values = [nome_loja, endereco, telefone]
    try{
        const res = await pool.query(query, values);
        return res.rows[0];
    }catch(erro){
        console.error('Erro ao tentar cadastrar loja', erro.message);
    }
}

module.exports = {selectStores, selectStore, insertStore}