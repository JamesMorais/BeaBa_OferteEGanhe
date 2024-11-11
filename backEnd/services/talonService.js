const pool = require('../config/dataBase');

async function selectTalons() {
    const query = `
        SELECT 
            t.id_talao, 
            t.data_envio, 
            t.data_recebimento, 
            t.status, 
            t.id_loja,
            l.nome_loja,  
            l.endereco    
        FROM 
            public.talao AS t
        JOIN 
            public.loja AS l ON t.id_loja = l.id_loja;
    `;
    
    try {
        const res = await pool.query(query);
        return res.rows;  
    } catch (error) {
        console.error('Erro ao buscar talões:', error);
        throw error;
    }
};

async function selectTalon(id_talao) {
    const query = `
        SELECT 
            t.id_talao, 
            t.data_envio, 
            t.data_recebimento, 
            t.status, 
            t.id_loja,
            l.nome_loja,
            l.endereco
        FROM 
            public.talao AS t
        JOIN 
            public.loja AS l ON t.id_loja = l.id_loja
        WHERE 
            t.id_talao = $1;
    `;
    const value = [id_talao];
    
    try {
        const res = await pool.query(query, value);
        return res.rows; 
    } catch (error) {
        console.error('Erro ao buscar talão por ID:', error);
        throw error;
    }
}


// async function insertTalon(data_envio, data_recebimento, status, id_loja) {
//     const query = `
//         INSERT INTO public.talao (data_envio, data_recebimento, status, id_loja)
//         VALUES (TO_DATE($1, 'DD/MM/YYYY'), TO_DATE($2, 'DD/MM/YYYY'), $3, $4)
//         RETURNING *;
//     `;
//     const values = [data_envio, data_recebimento, status, id_loja];
    
//     try {
//         const res = await pool.query(query, values);
//         return res.rows[0];
//     } catch (error) {
//         console.error('Erro ao inserir talão:', error);
//         throw error;
//     }
// };


// async function updateTalon(data_envio, data_recebimento, status, id_loja, id_talao) {
//     const query = `

//             UPDATE talao
//         SET data_envio = TO_DATE($1, 'DD/MM/YYYY'),
//             data_recebimento = TO_DATE($2, 'DD/MM/YYYY'),
//             status = $3,
//             id_loja = $4
//         WHERE id_talao = $5
//         RETURNING *;
//     `;
//     const values = [data_envio, data_recebimento, status, id_loja, id_talao];
    
//     try {
//         const res = await pool.query(query, values);
//         return res.rows[0];
//     } catch (error) {
//         console.error('Erro ao atualizar talão:', error);
//         throw error;
//     }
// };

async function deleteTalon(id_talao){
    const query = `DELETE FROM talao WHERE id_talao = $1;`;
    const value = [id_talao];

    try{
        const res = await pool.query(query, value);
        return res.rowCount;
    }catch(erro){
        console.error('Erro ao deletar talão', erro.message);
        throw erro;
    }
}




module.exports = {selectTalons, selectTalon, /*insertTalon,*/ /*updateTalon,*/ deleteTalon }; 
