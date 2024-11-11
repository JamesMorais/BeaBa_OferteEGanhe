const pool = require('../config/dataBase')


async function createTalon(id_loja, data_envio) {
    const createQuery = `
        INSERT INTO public.talao (id_loja, data_envio, status) 
        VALUES ($1, $2, 'Enviado') RETURNING *;
    `;
    const values = [id_loja, data_envio];
    
    try {
        const newTalon = await pool.query(createQuery, values);
        return newTalon.rows[0];  
    } catch (error) {
        console.error('Erro ao criar talão:', error);
        throw error;
    }
}

async function insertEnvioTalon(id_loja, quantidade_enviada, data_envio) {
    try {
        const talon = await createTalon(id_loja, data_envio);

        const queryEnvio = `
            INSERT INTO public.envio_talao (id_talao, id_loja, quantidade_enviada, data_envio)
            VALUES ($1, $2, $3, $4) RETURNING *;
        `;
        const values = [talon.id_talao, id_loja, quantidade_enviada, data_envio];
        const envio = await pool.query(queryEnvio, values);

        return { envio: envio.rows[0], talon };
    } catch (error) {
        console.error('Erro ao registrar envio de talão:', error);
        throw error;
    }
}

async function insertRecebimentoTalon(id_talao, id_loja, quantidade_recebida, data_recebimento) {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
    
        if (!id_talao || !id_loja || !quantidade_recebida || !data_recebimento) {
            throw new Error('Todos os campos são obrigatórios');
        }
        
        const insertRecebimentoQuery = `
            INSERT INTO public.recebimento_talao (id_talao, id_loja, quantidade_recebida, data_recebimento)
            VALUES ($1, $2, $3, $4) RETURNING *;
        `;
        const recebimentoResult = await client.query(insertRecebimentoQuery, [id_talao, id_loja, quantidade_recebida, data_recebimento]);
    
        const updateTalaoQuery = `
            UPDATE public.talao 
            SET data_recebimento = $2, status = 'Recebido' 
            WHERE id_talao = $1 RETURNING *;
        `;
        const updatedTalaoResult = await client.query(updateTalaoQuery, [id_talao, data_recebimento]);
        await client.query('COMMIT');
        
        return { recebimento: recebimentoResult.rows[0], updatedTalao: updatedTalaoResult.rows[0] };
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Erro ao registrar recebimento de talão:', error);
        throw error;
    } finally {
        client.release();
    }
}
async function updateTalonsEnviados(id_envio, id_talao, id_loja, quantidade_enviada, data_envio) {
    const updateQuery = `
        UPDATE public.envio_talao
        SET id_talao = $2, id_loja = $3, quantidade_enviada = $4, data_envio = $5
        WHERE id_envio = $1
        RETURNING *;
    `;
    const values = [id_envio, id_talao, id_loja, quantidade_enviada, data_envio];

    try {
        const result = await pool.query(updateQuery, values);

        if (result.rows.length === 0) {
            throw new Error('Envio de talão não encontrado para atualização.');
        }

        return result.rows[0]; // Retorna o talão atualizado
    } catch (error) {
        console.error('Erro ao atualizar talão enviado:', error);
        throw error;
    }
}


// const updateTalonQuery = `
//     UPDATE public.talao 
//     SET data_recebimento = TO_DATE($4, 'DD/MM/YYYY'), status = 'Recebido' 
//     WHERE id_talao = $1 RETURNING *;
// `;

// async function insertRecebimentoTalon(id_talao, id_loja, quantidade_recebida, data_recebimento) {
//     const queryRecebimento = `
//         INSERT INTO public.recebimento_talao (id_talao, id_loja, quantidade_recebida, data_recebimento)
//         VALUES ($1, $2, $3, TO_DATE($4, 'DD/MM/YYYY')) RETURNING *;
//     `;
    
//     const values = [id_talao, id_loja, quantidade_recebida, data_recebimento];

//     try {
//         await pool.query(queryRecebimento, values); // Registro de recebimento

//         // Atualizando o talão apenas se o recebimento for bem-sucedido
//         const talon = await pool.query(updateTalonQuery, values);

//         return talon.rows[0];
//     } catch (error) {
//         console.error('Erro ao registrar recebimento de talão:', error);
//         throw error;
//     }
// }





async function selectTalonsEnviados() {
    const query = `
        SELECT 
            e.id_envio,
            t.id_talao,
            t.data_envio AS data_talao_envio,
            e.quantidade_enviada,
            e.data_envio AS data_envio_real,
            t.status,
            l.nome_loja,
            l.endereco
        FROM 
            public.envio_talao AS e
        JOIN 
            public.talao AS t ON e.id_talao = t.id_talao
        JOIN 
            public.loja AS l ON e.id_loja = l.id_loja;
    `;
    
    try {
        const res = await pool.query(query);
        return res.rows;
    } catch (error) {
        console.error('Erro ao buscar talões enviados:', error);
        throw error;
    }
}
async function selectTalonsRecebidos() {
    const query = `
        SELECT 
            r.id_recebimento,
            t.id_talao,
            t.data_recebimento AS data_talao_recebimento,
            r.quantidade_recebida,
            r.data_recebimento AS data_recebimento_real,
            t.status,
            l.nome_loja,
            l.endereco
        FROM 
            public.recebimento_talao AS r
        JOIN 
            public.talao AS t ON r.id_talao = t.id_talao
        JOIN 
            public.loja AS l ON r.id_loja = l.id_loja;
    `;
    
    try {
        const res = await pool.query(query);
        return res.rows;
    } catch (error) {
        console.error('Erro ao buscar talões recebidos:', error);
        throw error;
    }
}


module.exports = {insertEnvioTalon, insertRecebimentoTalon, selectTalonsEnviados, selectTalonsRecebidos, updateTalonsEnviados }; 