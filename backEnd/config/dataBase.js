const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'oferte_e_ganhe',
    password: 'KATYqueen111',
    port: 5433,
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

