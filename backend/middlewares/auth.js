const jwt = require('jsonwebtoken');

const JWT_SECRET = 'barbearia_api_chave_secreta';

function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      erro: 'Token não informado'
    });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({
      erro: 'Token mal formatado'
    });
  }

  const [scheme, token] = parts;

  if (scheme !== 'Bearer') {
    return res.status(401).json({
      erro: 'Token mal formatado'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.usuario = decoded;

    return next();
  } catch (error) {
    return res.status(401).json({
      erro: 'Token inválido ou expirado'
    });
  }
}

module.exports = auth;