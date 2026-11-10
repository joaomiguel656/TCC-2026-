
import escalacaoService from "./escalacao.service.js";

class EscalacaoController {

  async getAll(req, res, next) {
    try {
      const escalacoes = await escalacaoService.getAll();

      return res.status(200).json(escalacoes);

    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;

      const escalacao = await escalacaoService.getById(id);

      return res.status(200).json(escalacao);

    } catch (error) {
      next(error);
    }
  }

  async getByUsuario(req, res, next) {
    try {
      const { usuarioId } = req.params;

      const escalacoes = await escalacaoService.getByUsuario(
        usuarioId
      );

      return res.status(200).json(escalacoes);

    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const novaEscalacao = await escalacaoService.create(
        req.body
      );

      return res.status(201).json({
        mensagem: "Escalação criada com sucesso!",
        escalacao: novaEscalacao
      });

    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;

      const escalacaoAtualizada = await escalacaoService.update(
        id,
        req.body
      );

      return res.status(200).json({
        mensagem: "Escalação atualizada com sucesso!",
        escalacao: escalacaoAtualizada
      });

    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;

      await escalacaoService.delete(id);

      return res.status(200).json({
        mensagem: "Escalação excluída com sucesso!"
      });

    } catch (error) {
      next(error);
    }
  }

}

export default new EscalacaoController();
