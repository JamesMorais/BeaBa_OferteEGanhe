const { Pool } = require('pg');
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
pool.connect((err, client, release) =>{
    if(err){
        return console.log(`Erro ao conectar com o banco de dados: ${err.stack}`)
    }else{
        console.log('Conexão estabelecida com sucesso');
        release();
    }
}); 
module.exports = pool;

