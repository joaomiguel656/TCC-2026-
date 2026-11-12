import giroService from "./giro.service.js";

class GiroController {

  // Listar todos os giros
  async getAll(req, res, next) {
    try {
      const giros = await giroService.getAll();

      return res.status(200).json(giros);
    } catch (error) {
      next(error);
    }
  }

  // Buscar um giro pelo ID
  async getById(req, res, next) {
    try {
      const { id } = req.params;

      const giro = await giroService.getById(id);

      return res.status(200).json(giro);
    } catch (error) {
      next(error);
    }
  }

  // Listar os giros de uma escalação
  async getByEscalacao(req, res, next) {
    try {
      const { escalacaoId } = req.params;

      const giros = await giroService.getByEscalacao(escalacaoId);

      return res.status(200).json(giros);
    } catch (error) {
      next(error);
    }
  }

  // Registrar um novo giro
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

}

export default new GiroController();