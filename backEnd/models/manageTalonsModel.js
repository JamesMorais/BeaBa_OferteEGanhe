const pool = require('../config/dataBase');

// Função para criar um novo talão com o status "Enviado"
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

// Função para registrar o envio de talões e atualizar a tabela `envio_talao`
async function insertEnvioTalon(id_loja, quantidade_enviada, data_envio) {
    try {
        const talon = await createTalon(id_loja, data_envio);  // Cria o talão

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

// Função para registrar o recebimento de talões e atualizar o estoque
async function insertRecebimentoTalon(id_talao, id_loja, quantidade_recebida, data_recebimento) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // Inicia a transação

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

        // Atualizar o estoque de talões da loja
        const updateEstoqueQuery = `
            UPDATE public.estoque_talao
            SET quantidade_atual = quantidade_atual + $1
            WHERE id_loja = $2;
        `;
        await client.query(updateEstoqueQuery, [quantidade_recebida, id_loja]);

        await client.query('COMMIT');

        return { recebimento: recebimentoResult.rows[0], updatedTalao: updatedTalaoResult.rows[0] };
    } catch (error) {
        await client.query('ROLLBACK'); // Reverte as mudanças em caso de erro
        console.error('Erro ao registrar recebimento de talão:', error);
        throw error;
    } finally {
        client.release();
    }
}

// Função para registrar o repasse de talões e atualizar o estoque
async function insertRepasseTalon(id_talao, id_loja, quantidade_repassada) {
    const client = await pool.connect(); // Conexão com o banco
    try {
        await client.query('BEGIN');  // Inicia a transação

        // Verifica se o talão existe e está associado à loja
        const talaoQuery = await client.query(
            'SELECT * FROM public.talao WHERE id_talao = $1 AND id_loja = $2 AND status = $3',
            [id_talao, id_loja, 'Recebido']
        );
        if (talaoQuery.rows.length === 0) {
            throw new Error('Talão não encontrado ou não está associado à loja.');
        }

        // Verifica a quantidade atual em estoque
        const estoqueQuery = await client.query(
            'SELECT quantidade_atual FROM public.estoque_talao WHERE id_loja = $1',
            [id_loja]
        );

        if (estoqueQuery.rows.length === 0 || estoqueQuery.rows[0].quantidade_atual < quantidade_repassada) {
            throw new Error('Quantidade a ser repassada excede a quantidade disponível em estoque.');
        }

        // Registrar o repasse na tabela repasse_talao
        const insertRepasseQuery = `
            INSERT INTO public.repasse_talao (id_talao, id_loja, quantidade_repassada)
            VALUES ($1, $2, $3) RETURNING id_repasse;
        `;
        const resRepasse = await client.query(insertRepasseQuery, [id_talao, id_loja, quantidade_repassada]);

        // Atualizar a quantidade atual no estoque_talao
        const updateEstoqueQuery = `
            UPDATE public.estoque_talao
            SET quantidade_atual = quantidade_atual - $1
            WHERE id_loja = $2;
        `;
        await client.query(updateEstoqueQuery, [quantidade_repassada, id_loja]);

        await client.query('COMMIT');
        return { id_repasse: resRepasse.rows[0].id_repasse };
    } catch (error) {
        await client.query('ROLLBACK'); // Reverte a transação em caso de erro
        throw error;
    } finally {
        client.release();
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
        l.nome_loja
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
async function selectTalonsEnviados() {
    const query = `
        SELECT 
            e.id_envio,
            t.id_talao,
            t.data_envio AS data_talao_envio,
            e.quantidade_enviada,
            e.data_envio AS data_envio_real,
            t.status, -- Coluna de status adicionada
            l.nome_loja
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
async function updateTalonsEnviados(id_talao, data_envio) {
    const updateQuery = `
        UPDATE public.envio_talao
        SET data_envio = $2
        WHERE id_talao = $1
        RETURNING *;
    `;
    const values = [id_talao, data_envio];

    try {
        const result = await pool.query(updateQuery, values);

        if (result.rows.length === 0) {
            throw new Error('Talão não encontrado para atualização.');
        }

        return result.rows[0]; // Retorna o talão atualizado
    } catch (error) {
        console.error('Erro ao atualizar talão enviado:', error);
        throw error;
    }
}
async function selectTalonsRepassados() {
    const query = `
        SELECT 
            r.id_repasse, 
            r.id_talao, 
            r.id_loja, 
            r.quantidade_repassada, 
            r.data_repasse
        FROM 
            public.repasse_talao r
        JOIN 
            public.talao t ON r.id_talao = t.id_talao
        WHERE 
            t.status = 'Recebido';
    `;
    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        throw new Error('Erro ao selecionar talões repassados: ' + error.message);
    }
}
async function selectTalonEnviadoById(id_talao){
    const query = `
        SELECT 
            e.id_envio,
            t.id_talao,
            t.data_envio AS data_talao_envio,
            e.quantidade_enviada,
            e.data_envio AS data_envio_real,
            t.status, -- Coluna de status adicionada
            l.nome_loja
        FROM 
            public.envio_talao AS e
        JOIN 
            public.talao AS t ON e.id_talao = t.id_talao
        JOIN 
            public.loja AS l ON e.id_loja = l.id_loja
        WHERE 
            t.id_talao = $1;
    `;
    const value = [id_talao]
    try{
        const res = await pool.query(query, value);
        return res.rows; 
    }catch(error){
        console.error('Erro ao buscar talões enviados:', error);
        throw error;
    }

}

module.exports = {
    insertEnvioTalon,
    insertRecebimentoTalon,
    insertRepasseTalon,
    selectTalonsRecebidos,
    selectTalonsEnviados,
    updateTalonsEnviados,
    selectTalonsRepassados,
    selectTalonEnviadoById
};
