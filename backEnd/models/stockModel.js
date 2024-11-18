const pool = require('../config/dataBase');

async function selectStocks(){
    try {
        const res = await pool.query('SELECT * FROM vw_estoque_talao');
        return res.rows;
    } catch (erro) {
        console.error('Erro ao selecionar estoque', erro.message);
    }
}

async function selectStockByStore(id_loja){
    const query = 'SELECT * FROM vw_estoque_talao WHERE id_loja = $1';
    const values = [id_loja];
    try {
        const res = await pool.query(query, values);
        return res.rows;
    } catch (erro) {
        console.error('Erro ao selecionar estoque por loja', erro.message);
    } 
}

async function insertStock(id_loja, quantidade_recomendada, quantidade_minima) {
    const lojaQuery = 'SELECT 1 FROM loja WHERE id_loja = $1';
    const lojaValues = [id_loja];

    try {
        const lojaRes = await pool.query(lojaQuery, lojaValues);

        if (lojaRes.rowCount === 0) {
            console.log('Loja não encontrada, id: ', id_loja);  
            throw new Error('Loja não encontrada');
        }

        const query = `
            INSERT INTO estoque_talao (id_loja, quantidade_recomendada, quantidade_minima)
            VALUES ($1, $2, $3)
            RETURNING *`;
        const values = [id_loja, quantidade_recomendada, quantidade_minima];

        const res = await pool.query(query, values);
        return res.rows[0]; 
    } catch (erro) {
        console.error('Erro ao inserir estoque', erro.message);
        throw erro; 
    }
}


async function updateStockByStore(id_loja, quantidade_recomendada, quantidade_minima){
    const query = `
        UPDATE estoque_talao
        SET 
            quantidade_recomendada = $1, 
            quantidade_minima = $2
        WHERE id_loja = $3
        RETURNING *`;
    const values = [quantidade_recomendada, quantidade_minima, id_loja];
    try {
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (erro) {
        console.error('Erro ao atualizar estoque por loja', erro.message);
    }
}



async function deleteStockByStore(id_loja){
    const query = 'DELETE FROM estoque_talao WHERE id_loja = $1 RETURNING *';
    const values = [id_loja];
    try {
        const res = await pool.query(query, values);
        return res.rowCount;
    } catch (erro) {
        console.error('Erro ao deletar estoque por loja', erro.message);
    }
}


module.exports = {selectStocks, selectStockByStore, insertStock, updateStockByStore, deleteStockByStore
};
