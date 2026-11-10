const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../../config/env');
const { ConflitoError, NaoAutorizadoError, NaoEncontradoError } = require('../../shared/errors');
const repository = require('./auth.repository');

function gerarToken(usuario) {
  return jwt.sign({ sub: String(usuario.id) }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

async function register({ nome, email, senha }) {
  const existente = await repository.buscarPorEmail(email);
  if (existente) {
    throw new ConflitoError('E-mail já cadastrado');
  }

  const senhaHash = await bcrypt.hash(senha, env.bcryptRounds);

  try {
    const usuario = await repository.criar({ nome, email, senhaHash });
    return { usuario, token: gerarToken(usuario) };
  } catch (err) {
    // 23505 = unique_violation (corrida entre dois cadastros simultâneos)
    if (err.code === '23505') {
      throw new ConflitoError('E-mail já cadastrado');
    }
    throw err;
  }
}

async function login({ email, senha }) {
  const registro = await repository.buscarPorEmail(email);

  // Mesma mensagem para e-mail inexistente e senha errada: não revela quais e-mails existem
  const credenciaisInvalidas = new NaoAutorizadoError('E-mail ou senha inválidos');

  if (!registro) {
    throw credenciaisInvalidas;
  }

  const senhaCorreta = await bcrypt.compare(senha, registro.senha_hash);
  if (!senhaCorreta) {
    throw credenciaisInvalidas;
  }

  const { senha_hash: _omitido, ...usuario } = registro;
  return { usuario, token: gerarToken(usuario) };
}

async function me(usuarioId) {
  const usuario = await repository.buscarPorId(usuarioId);
  if (!usuario) {
    throw new NaoEncontradoError('Usuário não encontrado');
  }
  return usuario;
}

function verificarToken(token) {
  try {
    return jwt.verify(token, env.jwtSecret);
  } catch {
    throw new NaoAutorizadoError('Token inválido ou expirado');
  }
}

module.exports = { register, login, me, verificarToken };