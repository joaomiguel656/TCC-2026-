
import posicaoService from "./posicao.service.js";

class PosicaoController {

  async getAll(req, res, next) {
    try {
      const posicoes = await posicaoService.getAll();

      return res.status(200).json(posicoes);

    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;

      const posicao = await posicaoService.getById(id);

      return res.status(200).json(posicao);

    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const novaPosicao = await posicaoService.create(req.body);

      return res.status(201).json({
        mensagem: "Posição cadastrada com sucesso!",
        posicao: novaPosicao
      });

    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;

      const posicaoAtualizada =
        await posicaoService.update(id, req.body);

      return res.status(200).json({
        mensagem: "Posição atualizada com sucesso!",
        posicao: posicaoAtualizada
      });

    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;

      await posicaoService.delete(id);

      return res.status(200).json({
        mensagem: "Posição excluída com sucesso!"
      });

    } catch (error) {
      next(error);
    }
  }

}

export default new PosicaoController();
