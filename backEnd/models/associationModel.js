const pool = require('../config/dataBase');

// async function associateProfile(matricula, idPerfil) {
//     const query = `
//         INSERT INTO associacao_perfil_usuario (matricula, id_perfil)
//         VALUES ($1, $2)
//     `;
//     const values = [matricula, idPerfil];

//     try {
//         await pool.query(query, values);
//     } catch (error) {
//         console.error('Erro ao associar perfil ao usuário:', error.message);
//         throw error;
//     }
// }
async function associateProfile(matricula, idPerfil) {
    const query = `
        INSERT INTO associacao_perfil_usuario (matricula, id_perfil)
        VALUES ($1, $2)
    `;
    const values = [matricula, idPerfil];

    try {
        await pool.query(query, values);
        return { matricula, idPerfil }; // Retornando os dados associados
    } catch (error) {
        console.error('Erro ao associar perfil ao usuário:', error.message);
        throw error; // Lançando o erro para ser tratado no controller
    }
}
async function selectProfilesUsers() {
    try {
        const res = await pool.query('SELECT * FROM associacao_perfil_usuario')
        return res.rows;
    } catch (erro) {
        console.error('Não foi possível Selecionar perfis associados a usuários', erro.message)
    }
}
async function selectProfileUser(matricula) {
    const query = `
    SELECT * 
    FROM public.associacao_perfil_usuario 
    WHERE matricula = $1;`;
    const value = [matricula]
    try {
        const res = await pool.query(query, value);
        return res.rows[0];
    } catch (erro) {
        console.error('Erro ao tentar acessar associação', erro.message);
        throw erro;
    }
}
async function deleteProfileUser(matricula) {
    const query = `DELETE FROM associacao_perfil_usuario WHERE matricula = $1;`
    const value = [matricula]
    try {
        const res = await pool.query(query, value);
        return res.rowCount;
    } catch (erro) {
        console.error('Erro ao deletar associação', erro.message);
        throw erro;
    }
}
async function updatePerfilAssc(matricula, newIdPerfil) {
    const query = `
        UPDATE public.associacao_perfil_usuario
        SET id_perfil = $1
        WHERE matricula = $2
    `;
    const values = [newIdPerfil, matricula];

    try {
        const result = await pool.query(query, values); // Supondo que 'db' é a instância do seu cliente PostgreSQL
        return result.rowCount; // Retorna o número de linhas afetadas
    } catch (error) {
        console.error('Erro ao atualizar perfis do usuário associados:', error.message);
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

module.exports = { associateProfile, selectProfilesUsers, selectProfileUser, getProfilesForUser, getPermissionsForUser, deleteProfileUser, updatePerfilAssc };

