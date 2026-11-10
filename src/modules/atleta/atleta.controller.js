
import atletaService from "./atleta.service.js";

class AtletaController {

  async getAll(req, res, next) {
    try {
      const atletas = await atletaService.getAll();

      return res.status(200).json(atletas);

    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;

      const atleta = await atletaService.getById(id);

      return res.status(200).json(atleta);

    } catch (error) {
      next(error);
    }
  }

  async getByTime(req, res, next) {
    try {
      const { timeId } = req.params;

      const atletas = await atletaService.getByTime(timeId);

      return res.status(200).json(atletas);

    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const novoAtleta = await atletaService.create(req.body);

      return res.status(201).json({
        mensagem: "Atleta cadastrado com sucesso!",
        atleta: novoAtleta
      });

    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;

      const atletaAtualizado = await atletaService.update(
        id,
        req.body
      );

      return res.status(200).json({
        mensagem: "Atleta atualizado com sucesso!",
        atleta: atletaAtualizado
      });

    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;

      await atletaService.delete(id);

      return res.status(200).json({
        mensagem: "Atleta excluído com sucesso!"
      });

    } catch (error) {
      next(error);
    }
  }

}

export default new AtletaController();
