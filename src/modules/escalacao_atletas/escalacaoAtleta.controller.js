
import escalacaoAtletaService from "./escalacaoAtleta.service.js";

class EscalacaoAtletaController {

  async getAll(req, res, next) {
    try {
      const registros = await escalacaoAtletaService.getAll();

      return res.status(200).json(registros);

    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;

      const registro = await escalacaoAtletaService.getById(id);

      return res.status(200).json(registro);

    } catch (error) {
      next(error);
    }
  }

  async getByEscalacao(req, res, next) {
    try {
      const { escalacaoId } = req.params;

      const registros =
        await escalacaoAtletaService.getByEscalacao(escalacaoId);

      return res.status(200).json(registros);

    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const novoRegistro =
        await escalacaoAtletaService.create(req.body);

      return res.status(201).json({
        mensagem: "Atleta adicionado à escalação com sucesso!",
        registro: novoRegistro
      });

    } catch (error) {
      next(error);
    }
  }

}

export default new EscalacaoAtletaController();
