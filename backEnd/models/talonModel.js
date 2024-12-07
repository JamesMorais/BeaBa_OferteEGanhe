const pool = require('../config/dataBase');

async function selectTalons() {
    const query = `
        SELECT 
            t.id_talao, 
            t.data_envio, 
            t.data_recebimento, 
            t.status, 
            t.id_loja,
            l.nome_loja 
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
            l.nome_loja
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
