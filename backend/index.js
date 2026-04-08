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

app.put('/appointments/:id/cancel', async (req, res) => {
  const { id } = req.params;

  try {
    // 1. validar id
    if (isNaN(Number(id))) {
      return res.status(400).json({
        erro: 'ID inválido'
      });
    }

    // 2. verificar se o agendamento existe
    const agendamentoExistente = await pool.query(
      `SELECT id, status
       FROM agendamentos
       WHERE id = $1`,
      [id]
    );

    if (agendamentoExistente.rows.length === 0) {
      return res.status(404).json({
        erro: 'Agendamento não encontrado'
      });
    }

    // 3. verificar se já está cancelado
    if (agendamentoExistente.rows[0].status === 'cancelado') {
      return res.status(400).json({
        erro: 'Esse agendamento já está cancelado'
      });
    }

    // 4. cancelar
    const result = await pool.query(
      `UPDATE agendamentos
       SET status = 'cancelado'
       WHERE id = $1
       RETURNING
         id,
         status,
         TO_CHAR(
           data_hora AT TIME ZONE 'America/Sao_Paulo',
           'DD/MM/YYYY HH24:MI'
         ) AS data_hora,
         TO_CHAR(
           criado_em AT TIME ZONE 'America/Sao_Paulo',
           'DD/MM/YYYY HH24:MI'
         ) AS criado_em`,
      [id]
    );

    return res.status(200).json({
      mensagem: 'Agendamento cancelado com sucesso',
      agendamento: result.rows[0]
    });
  } catch (error) {
    console.error('Erro no PUT /appointments/:id/cancel:', error.message);
    return res.status(500).json({
      erro: 'Erro ao cancelar agendamento'
    });
  }
});

app.put('/appointments/:id', async (req, res) => {
  const { id } = req.params;
  const { usuario_id, servico_id, funcionario_id, data_hora } = req.body;

  try {
    // 1. validar campos obrigatórios
    if (!usuario_id || !servico_id || !funcionario_id || !data_hora) {
      return res.status(400).json({
        erro: 'usuario_id, servico_id, funcionario_id e data_hora são obrigatórios'
      });
    }

    // 2. verificar se o agendamento existe
    const agendamentoExistente = await pool.query(
      `SELECT id, status
       FROM agendamentos
       WHERE id = $1`,
      [id]
    );

    if (agendamentoExistente.rows.length === 0) {
      return res.status(404).json({
        erro: 'Agendamento não encontrado'
      });
    }

    // 3. impedir edição de cancelado
    if (agendamentoExistente.rows[0].status === 'cancelado') {
      return res.status(400).json({
        erro: 'Não é possível editar um agendamento cancelado'
      });
    }

    // 4. validar se usuário existe
    const usuarioExiste = await pool.query(
      `SELECT id FROM usuarios WHERE id = $1`,
      [usuario_id]
    );

    if (usuarioExiste.rows.length === 0) {
      return res.status(404).json({
        erro: 'Usuário não encontrado'
      });
    }

    // 5. validar se serviço existe
    const servicoExiste = await pool.query(
      `SELECT id FROM servicos WHERE id = $1`,
      [servico_id]
    );

    if (servicoExiste.rows.length === 0) {
      return res.status(404).json({
        erro: 'Serviço não encontrado'
      });
    }

    // 6. validar se funcionário existe
    const funcionarioExiste = await pool.query(
      `SELECT id FROM funcionarios WHERE id = $1`,
      [funcionario_id]
    );

    if (funcionarioExiste.rows.length === 0) {
      return res.status(404).json({
        erro: 'Funcionário não encontrado'
      });
    }

    // 7. verificar conflito de horário, ignorando o próprio agendamento
    const conflitoHorario = await pool.query(
      `SELECT id
       FROM agendamentos
       WHERE funcionario_id = $1
         AND data_hora = $2
         AND status != 'cancelado'
         AND id != $3`,
      [funcionario_id, data_hora, id]
    );

    if (conflitoHorario.rows.length > 0) {
      return res.status(409).json({
        erro: 'Já existe um agendamento para esse funcionário nesse horário'
      });
    }

    // 8. atualizar
    const result = await pool.query(
      `UPDATE agendamentos
       SET usuario_id = $1,
           servico_id = $2,
           funcionario_id = $3,
           data_hora = $4
       WHERE id = $5
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
      [usuario_id, servico_id, funcionario_id, data_hora, id]
    );

    return res.status(200).json({
      mensagem: 'Agendamento atualizado com sucesso',
      agendamento: result.rows[0]
    });
  } catch (error) {
    console.error('Erro no PUT /appointments/:id:', error.message);
    return res.status(500).json({
      erro: 'Erro ao atualizar agendamento'
    });
  }
});

// Servidor
app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});