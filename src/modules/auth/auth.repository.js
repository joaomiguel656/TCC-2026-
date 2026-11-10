const db = require('../../config/database');

const COLUNAS_PUBLICAS = 'id, nome, email, criado_em';

async function criar({ nome, email, senhaHash }) {
  const { rows } = await db.query(
    `INSERT INTO usuarios (nome, email, senha_hash)
     VALUES ($1, $2, $3)
     RETURNING ${COLUNAS_PUBLICAS}`,
    [nome, email, senhaHash]
  );
  return rows[0];
}

// Retorna também o senha_hash: uso exclusivo do login
async function buscarPorEmail(email) {
  const { rows } = await db.query(
    `SELECT ${COLUNAS_PUBLICAS}, senha_hash
     FROM usuarios
     WHERE email = $1`,
    [email]
  );
  return rows[0] || null;
}

async function buscarPorId(id) {
  const { rows } = await db.query(
    `SELECT ${COLUNAS_PUBLICAS} FROM usuarios WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
}

module.exports = { criar, buscarPorEmail, buscarPorId };