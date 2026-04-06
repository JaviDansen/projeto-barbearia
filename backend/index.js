const express = require('express');
const app = express();

const pool = require('./db');

// Middleware (vem antes das rotas)
app.use(express.json());

// Teste de conexão com o banco
pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('Erro ao conectar no banco:', err);
  } else {
    console.log('Banco conectado:', result.rows[0]);
  }
});

// Rotas
app.get('/', (req, res) => {
  res.send('API Barbearia rodando 🚀');
});

app.post('/register', (req, res) => {
  const { nome, email, senha } = req.body;

  res.json({
    mensagem: 'Usuário cadastrado com sucesso',
    usuario: { nome, email }
  });
});

// Servidor
app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});