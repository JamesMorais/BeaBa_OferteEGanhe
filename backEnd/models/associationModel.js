const pool = require('../config/dataBase');

async function associateProfile(matricula, idPerfil) {
    const query = `
        INSERT INTO associacao_perfil_usuario (matricula, id_perfil, data_associacao)
        VALUES ($1, $2, CURRENT_DATE)
    `;
    const values = [matricula, idPerfil];

    try {
        await pool.query(query, values);
    } catch (error) {
        console.error('Erro ao associar perfil ao usuário:', error.message);
        throw error;
    }
}

async function getProfilesForUser(matricula) {
    const query = `
        SELECT p.id_perfil, p.nome_perfil, p.descricao
        FROM associacao_perfil_usuario apu
        INNER JOIN perfil p ON apu.id_perfil = p.id_perfil
        WHERE apu.matricula = $1
    `;
    const values = [matricula];

    try {
        const res = await pool.query(query, values);
        return res.rows;
    } catch (error) {
        console.error('Erro ao buscar perfis do usuário:', error.message);
        throw error;
    }
}

async function getPermissionsForUser(matricula) {
    const query = `
        SELECT t.nome_transacao
        FROM associacao_perfil_usuario apu
        INNER JOIN permissao_perfil pp ON apu.id_perfil = pp.id_perfil
        INNER JOIN transacao t ON pp.id_transacao = t.id_transacao
        WHERE apu.matricula = $1 AND pp.acesso = true
    `;
    const values = [matricula];

    try {
        const res = await pool.query(query, values);
        return res.rows.map(row => row.nome_transacao);
    } catch (error) {
        console.error('Erro ao buscar permissões do usuário:', error.message);
        throw error;
    }
}

module.exports = { associateProfile, getProfilesForUser, getPermissionsForUser };

