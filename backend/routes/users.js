const express = require('express');
const router = express.Router();

const pool = require('../db');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    // validar campos obrigatórios
    if (!nome || !email || !senha) {
      return res.status(400).json({
        erro: 'nome, email e senha são obrigatórios'
      });
    }

    // verificar se email já existe
    const usuarioExistente = await pool.query(
      `SELECT id FROM usuarios WHERE email = $1`,
      [email]
    );

    if (usuarioExistente.rows.length > 0) {
      return res.status(409).json({
        erro: 'Email já cadastrado'
      });
    }

    // gerar hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // inserir usuário
    const result = await pool.query(
      `INSERT INTO usuarios (nome, email, senha)
       VALUES ($1, $2, $3)
       RETURNING id, nome, email`,
      [nome, email, senhaHash]
    );

    return res.status(201).json({
      mensagem: 'Usuário cadastrado com sucesso',
      usuario: result.rows[0]
    });
  } catch (error) {
  console.error('Erro no POST /register:', error);
  return res.status(500).json({
    erro: 'Erro ao cadastrar usuário',
    detalhe: error.message
  });
}

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    //validar campos
    if (!email || !senha) {
      return res.status(400).json({
        erro: 'email e senha são obrigatórios'
      });
    }

    //buscar usuarios
    const result = await pool.query(
      `SELECT id, nome, email, senha
       FROM usuarios
       WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        erro: 'Email ou senha inválidos'
      });
    }

    const usuario = result.rows[0];

    //comparar senhas
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({
        erro: 'Email ou senha inválidos'
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      mensagem: 'Login realizado com sucesso',
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
      }
    });
  } catch (error) {
  console.error('Erro no POST /login:', error);
  return res.status(500).json({
    erro: 'Erro ao realizar login',
    detalhe: error.message
  });
}

router.get('/users', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, nome, email
       FROM usuarios`
    );

    return res.json(result.rows);
  } catch (error) {
    console.error('Erro no GET /users:', error.message);
    return res.status(500).json({
      erro: 'Erro ao buscar usuários'
    });
  }
});

module.exports = router;