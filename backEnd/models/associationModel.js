const pool = require('../config/dataBase');

async function associateProfile(matricula, id_perfil) {
    const query = `
        INSERT INTO usuario_perfil (matricula, id_perfil)
        VALUES ($1, $2)
        RETURNING *;
    `;
    const values = [matricula, id_perfil];
    try {
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (error) {
        console.error('Erro enquanto associava perfil:', error.message);
        throw error;
    }
}

module.exports = { associateProfile };
