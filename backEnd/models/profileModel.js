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

async function insertPermissoesPerfil(id_perfil, transacoes) {
    console.log('ID do Perfil:', id_perfil);
    console.log('Transações:', transacoes);

    const query = `
        INSERT INTO permissao_perfil (id_perfil, id_transacao, acesso)
        VALUES ($1, $2, $3);
    `;

    const promises = transacoes.map(transacao => {
        const values = [id_perfil, transacao, true]; // Define acesso como true
        return pool.query(query, values);
    });

    try {
        await Promise.all(promises); // Aguarda todas as inserções
    } catch (erro) {
        console.error('Não foi possível cadastrar permissões de perfil', erro.message);
        throw erro; // Lança o erro para ser tratado no controller
    }
}

async function updateProfile(nome_perfil, descricao, id_perfil) {
    const query = `UPDATE perfil SET nome_perfil = $1, descricao = $2 WHERE id_perfil = $3 RETURNING *`;
    const values = [nome_perfil, descricao, id_perfil];
    try {
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (erro) {
        console.error('Não foi possível atualizar o perfil', erro.message);
        throw erro;
    }
}

async function updatePermissoesPerfil(id_perfil, transacoes) {
    const deleteQuery = `DELETE FROM permissao_perfil WHERE id_perfil = $1;`;
    const insertQuery = `INSERT INTO permissao_perfil (id_perfil, id_transacao, acesso) VALUES ($1, $2, $3);`;

    try {
        await pool.query(deleteQuery, [id_perfil]);

        const promises = transacoes.map(transacao => {
            return pool.query(insertQuery, [id_perfil, transacao, true]);
        });

        await Promise.all(promises);
    } catch (erro) {
        console.error('Não foi possível atualizar permissões de perfil', erro.message);
        throw erro;
    }
}

async function deleteProfile(id_perfil) {
    const query = `DELETE FROM perfil WHERE id_perfil = $1;`
    const value = [id_perfil];

    try {
        const res = await pool.query(query, value);
        return res.rowCount;
    } catch (erro) {
        console.error('Erro ao deletar perfil', erro.message);
        throw erro;
    }
}

module.exports = { selectProfiles, selectProfile, insertProfile, updateProfile, deleteProfile, insertPermissoesPerfil, updatePermissoesPerfil }