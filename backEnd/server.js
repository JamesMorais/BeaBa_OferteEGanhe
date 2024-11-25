require('dotenv').config();
const app = require('./app');
const PORT = process.env.PORT || 3000;

const cors = require('cors');
app.use(cors());


app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
