const express = require('express');
const app = express();

const pool = require('./db');

// Middleware
app.use(express.json());

// Teste de conexão com o banco
pool.query(`SELECT TO_CHAR(NOW() AT TIME ZONE 'America/Sao_Paulo', 'DD/MM/YYYY HH24:MI') AS agora`, (err, result) => {
  if (err) {
    console.error('Erro ao conectar no banco:', err);
  } else {
    console.log('Banco conectado em:', result.rows[0].agora);
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
      `INSERT INTO usuarios (nome, email, senha)
       VALUES ($1, $2, $3)
       RETURNING id, nome, email`,
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
    const result = await pool.query(
      `SELECT id, nome, email
       FROM usuarios`
    );

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
    const result = await pool.query(
      `SELECT id, nome, preco, duracao
       FROM servicos`
    );

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
      `INSERT INTO servicos (nome, preco, duracao)
       VALUES ($1, $2, $3)
       RETURNING id, nome, preco, duracao`,
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

app.get('/employees', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        nome,
        especialidade,
        telefone,
        TO_CHAR(
          criado_em AT TIME ZONE 'America/Sao_Paulo',
          'DD/MM/YYYY HH24:MI'
        ) AS criado_em
      FROM funcionarios
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Erro no /funcionarios:', error.message);
    res.status(500).json({
      erro: 'Erro ao buscar funcionários'
    });
  }
});

app.post('/employees', async (req, res) => {
  const { nome, especialidade, telefone } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO funcionarios (nome, especialidade, telefone)
       VALUES ($1, $2, $3)
       RETURNING 
         id,
         nome,
         especialidade,
         telefone,
         TO_CHAR(
           criado_em AT TIME ZONE 'America/Sao_Paulo',
           'DD/MM/YYYY HH24:MI'
         ) AS criado_em`,
      [nome, especialidade, telefone]
    );

    res.json({
      mensagem: 'Funcionário criado com sucesso',
      funcionario: result.rows[0]
    });

  } catch (error) {
    console.error('Erro no /funcionarios:', error.message);
    res.status(500).json({
      erro: 'Erro ao criar funcionário'
    });
  }
});

app.post('/appointments', async (req, res) => {
  const { usuario_id, servico_id, funcionario_id, data_hora } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO agendamentos (usuario_id, servico_id, funcionario_id, data_hora)
       VALUES ($1, $2, $3, $4)
       RETURNING
         id,
         usuario_id,
         servico_id,
         funcionario_id,
         TO_CHAR(
           data_hora AT TIME ZONE 'America/Sao_Paulo',
           'DD/MM/YYYY HH24:MI'
         ) AS data_hora,
         status,
         TO_CHAR(
           criado_em AT TIME ZONE 'America/Sao_Paulo',
           'DD/MM/YYYY HH24:MI'
         ) AS criado_em`,
      [usuario_id, servico_id, funcionario_id, data_hora]
    );

    res.json({
      mensagem: 'Agendamento criado com sucesso',
      agendamento: result.rows[0]
    });

  } catch (error) {
    console.error('Erro no /agendamentos:', error.message);
    res.status(500).json({
      erro: 'Erro ao criar agendamento'
    });
  }
});

app.get('/appointments', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        a.id,
        u.nome AS usuario,
        s.nome AS servico,
        f.nome AS funcionario,
        TO_CHAR(
          a.data_hora AT TIME ZONE 'America/Sao_Paulo',
          'DD/MM/YYYY HH24:MI'
        ) AS data_hora,
        a.status,
        TO_CHAR(
          a.criado_em AT TIME ZONE 'America/Sao_Paulo',
          'DD/MM/YYYY HH24:MI'
        ) AS criado_em
      FROM agendamentos a
      INNER JOIN usuarios u ON a.usuario_id = u.id
      INNER JOIN servicos s ON a.servico_id = s.id
      INNER JOIN funcionarios f ON a.funcionario_id = f.id
      ORDER BY a.data_hora ASC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Erro no /agendamentos:', error.message);
    res.status(500).json({
      erro: 'Erro ao buscar agendamentos'
    });
  }
});

app.put('/appointments/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE agendamentos
       SET status = 'cancelado'
       WHERE id = $1
       RETURNING
         id,
         status,
         TO_CHAR(
           criado_em AT TIME ZONE 'America/Sao_Paulo',
           'DD/MM/YYYY HH24:MI'
         ) AS criado_em`,
      [id]
    );

    res.json({
      mensagem: 'Agendamento cancelado com sucesso',
      agendamento: result.rows[0]
    });

  } catch (error) {
    console.error('Erro no cancelamento:', error.message);
    res.status(500).json({
      erro: 'Erro ao cancelar agendamento'
    });
  }
});

// Servidor
app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});