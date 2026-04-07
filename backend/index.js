const express = require('express');
const app = express();

const pool = require('./db');

// Middleware
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

app.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *',
      [nome, email, senha]
    );

    res.json({
      mensagem: 'Usuário cadastrado com sucesso',
      usuario: result.rows[0]
    });

  } catch (error) {
    console.error('Erro no /register:', error.message);
    res.status(500).json({
      erro: error.message
    });
  }
});

app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro no /users:', error.message);
    res.status(500).json({
      erro: error.message
    });
  }
});

app.get('/services', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM servicos');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro no /services:', error.message);
    res.status(500).json({
      erro: 'Erro ao buscar serviços'
    });
  }
});

app.post('/services', async (req, res) => {
  const { nome, preco, duracao } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO servicos (nome, preco, duracao) VALUES ($1, $2, $3) RETURNING *',
      [nome, preco, duracao]
    );

    res.json({
      mensagem: 'Serviço criado com sucesso',
      servico: result.rows[0]
    });

  } catch (error) {
    console.error('Erro no /services:', error.message);
    res.status(500).json({
      erro: 'Erro ao criar serviço'
    });
  }
});

app.get('/funcionarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM funcionarios');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro no /funcionarios:', error.message);
    res.status(500).json({
      erro: 'Erro ao buscar funcionários'
    });
  }
});

// Servidor
app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});