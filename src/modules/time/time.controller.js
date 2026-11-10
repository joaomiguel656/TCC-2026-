
import timeService from "./time.service.js";

class TimeController {

  async getAll(req, res, next) {
    try {
      const times = await timeService.getAll();

      return res.status(200).json(times);

    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;

      const time = await timeService.getById(id);

      return res.status(200).json(time);

    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const novoTime = await timeService.create(req.body);

      return res.status(201).json({
        mensagem: "Time cadastrado com sucesso!",
        time: novoTime
      });

    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;

      const timeAtualizado = await timeService.update(
        id,
        req.body
      );

      return res.status(200).json({
        mensagem: "Time atualizado com sucesso!",
        time: timeAtualizado
      });

    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;

      await timeService.delete(id);

      return res.status(200).json({
        mensagem: "Time excluído com sucesso!"
      });

    } catch (error) {
      next(error);
    }
  }

}

export default new TimeController();
