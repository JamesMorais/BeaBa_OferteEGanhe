const pool = require('../config/dataBase');

async function selectStores() {
    try {
        const res = await pool.query('SELECT * FROM loja');
        return res.rows;
    } catch (erro) {
        console.error('Erro ao selecionar lojas', erro.message);
    }
}

async function selectStore(id_loja) {
    const query = `SELECT * FROM loja WHERE id_loja = $1`;
    const value = [id_loja];

    try {
        const res = await pool.query(query, value);
        return res.rows[0];
    } catch (erro) {
        console.error('Erro ao tentar selecionar loja', erro.message);
    }
}

async function insertStore(id_loja, nome_loja) {
    const query = `
    INSERT INTO loja(id_loja, nome_loja)
    VALUES($1, $2) 
    RETURNING *
    `;
    const values = [id_loja, nome_loja];
    try {
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (erro) {
        console.error('Erro ao tentar cadastrar loja', erro.message);
    }
}

// Método para atualizar loja
async function updateStore(id_loja, nome_loja) {
    const query = `
    UPDATE loja
    SET nome_loja = $1
    WHERE id_loja = $2
    RETURNING *
    `;
    const values = [nome_loja, id_loja];

    try {
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (erro) {
        console.error('Erro ao tentar atualizar loja', erro.message);
    }
}

// Método para deletar loja
async function deleteStore(id_loja) {
    const query = `
    DELETE FROM loja
    WHERE id_loja = $1
    RETURNING *
    `;
    const values = [id_loja];

    try {
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (erro) {
        console.error('Erro ao tentar deletar loja', erro.message);
    }
}

module.exports = { selectStores, selectStore, insertStore, updateStore, deleteStore };
