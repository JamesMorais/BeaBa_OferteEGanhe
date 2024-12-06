const pool = require('../config/dataBase')

async function selectUsers(){
    try{
        const res = await pool.query('SELECT * FROM usuario');
        return res.rows;
    }catch(erro){
        console.error('Erro ao tentar acessar usuários', erro.message);
        throw erro;
    }
};
async function selectUser(matricula){
    const query = `SELECT * FROM usuario WHERE matricula = $1`;
    const value = [matricula]
    try{
        const res = await pool.query( query, value);
        return res.rows[0];
    }catch(erro){
        console.error('Erro ao tentar acessar usuário', erro.message);
        throw erro;
    }
}

async function selectUserByEmail(email) {
    const query = `SELECT * FROM usuario WHERE email = $1`;
    const values = [email];

    try {
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (erro) {
        console.error('Erro ao buscar usuário por email', erro.message);
        throw erro;
    }
}

// async function insertUser(matricula, nome, email, senha, data_cadastro){
//     const query = `
//      INSERT INTO usuario(matricula, nome, email, senha, data_cadastro) 
//      VALUES($1, $2, $3, $4, TO_DATE($5, 'DD/MM/YYYY'))
//      RETURNING *
//     `
//     const values = [matricula, nome, email, senha, data_cadastro]

//     try{
//         const res = await pool.query(query, values);
//         return res.rows[0];
//     }catch(erro){
//         console.error('Erro ao inserir usuário');
//         throw erro;
//     }
// }
async function insertUser(matricula, nome, email, senha) {
    const query = `
    INSERT INTO usuario(matricula, nome, email, senha) 
    VALUES($1, $2, $3, $4)
    RETURNING *;
    `;
    const values = [matricula, nome, email, senha];

    try {
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (erro) {
        console.error('Erro ao inserir usuário');
        throw erro;
    }
}

// async function updateUser(matricula, nome, email, senha, data_cadastro){
//     const query = `
//         UPDATE usuario
//         SET nome = $1,
//             email = $2,
//             senha = $3,
//             data_cadastro = TO_DATE($4, 'DD/MM/YYYY')
//         WHERE matricula = $5
//         RETURNING *;
//     `;
//     const values = [nome, email, senha, data_cadastro, matricula];
//     try{
//         const res = await pool.query(query, values);
//         return res.rows[0];
//     }catch(erro){
//         console.error('Erro ao tentar atualizar usuário', erro.message);
//         throw erro;
//     }
// }
async function updateUser(matricula, nome, email, senha) {
    const query = `
        UPDATE usuario
        SET nome = $1,
            email = $2,
            senha = $3
        WHERE matricula = $4
        RETURNING *;
    `;
    const values = [nome, email, senha, matricula];
    try {
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (erro) {
        console.error('Erro ao tentar atualizar usuário', erro.message);
        throw erro;
    }
}

async function deleteUser(matricula){
    const query = `DELETE FROM usuario WHERE matricula = $1;`;
    const value = [matricula];

    try{
        const res = await pool.query(query, value);
        return res.rowCount;
    }catch(erro){
        console.error('Erro ao deletar usuário', erro.message);
        throw erro;
    }
}
module.exports = {selectUsers, selectUser, selectUserByEmail, insertUser, updateUser, deleteUser};