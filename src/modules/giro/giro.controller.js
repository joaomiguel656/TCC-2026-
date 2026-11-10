
import giroService from "./giro.service.js";

class GiroController {

  async getAll(req, res, next) {
    try {
      const giros = await giroService.getAll();

      return res.status(200).json(giros);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;

      const giro = await giroService.getById(id);

      return res.status(200).json(giro);
    } catch (error) {
      next(error);
    }
  }

  async getByEscalacao(req, res, next) {
    try {
      const { escalacaoId } = req.params;

      const giros = await giroService.getByEscalacao(
        escalacaoId
      );

      return res.status(200).json(giros);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const novoGiro = await giroService.create(req.body);

      return res.status(201).json({
        mensagem: "Giro registrado com sucesso!",
        giro: novoGiro
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;

      await giroService.delete(id);

      return res.status(200).json({
        mensagem: "Giro excluído com sucesso!"
      });
    } catch (error) {
      next(error);
    }
  }

}

export default new GiroController();
