
import service from "./auth.service.js";

async function register(req, res, next) {
  try {
    const resultado = await service.register(req.body);

    return res.status(201).json(resultado);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const resultado = await service.login(req.body);

    return res.status(200).json(resultado);
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const usuario = await service.me(req.usuario.id);

    return res.status(200).json({ usuario });
  } catch (err) {
    next(err);
  }
}

export default { register, login, me };
