require('dotenv').config();

const app = require('./app');
const pool = require('./db');

pool.query(
  `SELECT TO_CHAR(NOW() AT TIME ZONE 'America/Sao_Paulo', 'DD/MM/YYYY HH24:MI') AS agora`,
  (err, result) => {
    if (err) {
      console.error('Erro ao conectar no banco:', err);
    } else {
      console.log('Banco conectado em:', result.rows[0].agora);
    }
  }
);

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});