
import campeonatoService from "./campeonato.service.js";

class CampeonatoController {

  async getAll(req, res, next) {
    try {
      const campeonatos = await campeonatoService.getAll();

      return res.status(200).json(campeonatos);

    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;

      const campeonato = await campeonatoService.getById(id);

      return res.status(200).json(campeonato);

    } catch (error) {
      next(error);
    }
  }

  async getParticipantes(req, res, next) {
    try {
      const { campeonatoId } = req.params;

      const participantes =
        await campeonatoService.getParticipantes(campeonatoId);

      return res.status(200).json(participantes);

    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const novoCampeonato =
        await campeonatoService.create(req.body);

      return res.status(201).json({
        mensagem: "Campeonato criado com sucesso!",
        campeonato: novoCampeonato
      });

    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;

      const campeonatoAtualizado =
        await campeonatoService.update(id, req.body);

      return res.status(200).json({
        mensagem: "Campeonato atualizado com sucesso!",
        campeonato: campeonatoAtualizado
      });

    } catch (error) {
      next(error);
    }
  }

  async adicionarParticipante(req, res, next) {
    try {
      const participante =
        await campeonatoService.adicionarParticipante(req.body);

      return res.status(201).json({
        mensagem: "Participante inscrito com sucesso!",
        participante
      });

    } catch (error) {
      next(error);
    }
  }

  async removerParticipante(req, res, next) {
    try {
      const { id } = req.params;

      await campeonatoService.removerParticipante(id);

      return res.status(200).json({
        mensagem: "Participante removido com sucesso!"
      });

    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;

      await campeonatoService.delete(id);

      return res.status(200).json({
        mensagem: "Campeonato excluído com sucesso!"
      });

    } catch (error) {
      next(error);
    }
  }

}

export default new CampeonatoController();
