
import formacaoService from "./formacao.service.js";

class FormacaoController {

  async getAll(req, res, next) {
    try {
      const formacoes = await formacaoService.getAll();

      return res.status(200).json(formacoes);

    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;

      const formacao = await formacaoService.getById(id);

      return res.status(200).json(formacao);

    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const novaFormacao = await formacaoService.create(req.body);

      return res.status(201).json({
        mensagem: "Formação cadastrada com sucesso!",
        formacao: novaFormacao
      });

    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;

      const formacaoAtualizada = await formacaoService.update(
        id,
        req.body
      );

      return res.status(200).json({
        mensagem: "Formação atualizada com sucesso!",
        formacao: formacaoAtualizada
      });

    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;

      await formacaoService.delete(id);

      return res.status(200).json({
        mensagem: "Formação excluída com sucesso!"
      });

    } catch (error) {
      next(error);
    }
  }

}

export default new FormacaoController();
