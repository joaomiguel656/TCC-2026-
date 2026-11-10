
import usuarioService from "./usuario.service.js";

class UsuarioController {

  async getAll(req, res, next) {
    try {
      const usuarios = await usuarioService.getAll();

      return res.status(200).json(usuarios);

    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;

      const usuario = await usuarioService.getById(id);

      return res.status(200).json(usuario);

    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const novoUsuario = await usuarioService.create(req.body);

      return res.status(201).json({
        mensagem: "Usuário cadastrado com sucesso!",
        usuario: novoUsuario
      });

    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;

      const usuarioAtualizado = await usuarioService.update(
        id,
        req.body
      );

      return res.status(200).json({
        mensagem: "Usuário atualizado com sucesso!",
        usuario: usuarioAtualizado
      });

    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;

      await usuarioService.delete(id);

      return res.status(200).json({
        mensagem: "Usuário excluído com sucesso!"
      });

    } catch (error) {
      next(error);
    }
  }

}

export default new UsuarioController();
