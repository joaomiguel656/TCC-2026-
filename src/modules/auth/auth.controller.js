const service = require('./auth.service');

async function register(req, res, next) {
  try {
    const resultado = await service.register(req.body);
    res.status(201).json(resultado);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const resultado = await service.login(req.body);
    res.status(200).json(resultado);
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const usuario = await service.me(req.usuario.id);
    res.status(200).json({ usuario });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, me };