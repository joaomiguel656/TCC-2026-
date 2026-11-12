
import atletaRepository from "./atleta.repository.js";
import timeRepository from "../times/time.repository.js";

class AtletaService {

  async getAll() {
    return await atletaRepository.findAll();
  }

  async getById(id) {
    const atleta = await atletaRepository.findById(id);

    if (!atleta) {
      throw Object.assign(
        new Error("Atleta não encontrado."),
        { status: 404 }
      );
    }

    return atleta;
  }

  async getByTime(timeId) {
    const timeExistente = await timeRepository.findById(timeId);

    if (!timeExistente) {
      throw Object.assign(
        new Error("Time não encontrado."),
        { status: 404 }
      );
    }

    return await atletaRepository.findByTime(timeId);
  }

  async create(dados) {

    // Valida os dados antes de acessar suas propriedades
    if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
      throw Object.assign(
        new Error("Os dados enviados são inválidos."),
        { status: 400 }
      );
    }

    const { timeId, nome, nota } = dados;

    if (
      !timeId ||
      typeof nome !== "string" ||
      !nome.trim()
    ) {
      throw Object.assign(
        new Error("Time e nome do atleta são obrigatórios."),
        { status: 400 }
      );
    }

    if (nome.trim().length > 100) {
      throw Object.assign(
        new Error("O nome deve possuir no máximo 100 caracteres."),
        { status: 400 }
      );
    }

    if (!Number.isInteger(nota) || nota < 1 || nota > 99) {
      throw Object.assign(
        new Error("A nota deve ser um número inteiro entre 1 e 99."),
        { status: 400 }
      );
    }

    const timeExistente = await timeRepository.findById(timeId);

    if (!timeExistente) {
      throw Object.assign(
        new Error("Time não encontrado."),
        { status: 404 }
      );
    }

    return await atletaRepository.create({
      timeId,
      nome: nome.trim(),
      nota
    });
  }

  async update(id, dados) {

    // Valida os dados antes de acessar suas propriedades
    if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
      throw Object.assign(
        new Error("Os dados enviados são inválidos."),
        { status: 400 }
      );
    }

    await this.getById(id);

    const dadosAtualizados = {};

    if (dados.nome !== undefined) {
      if (
        typeof dados.nome !== "string" ||
        !dados.nome.trim() ||
        dados.nome.trim().length > 100
      ) {
        throw Object.assign(
          new Error("O nome informado é inválido."),
          { status: 400 }
        );
      }

      dadosAtualizados.nome = dados.nome.trim();
    }

    if (dados.nota !== undefined) {
      if (
        !Number.isInteger(dados.nota) ||
        dados.nota < 1 ||
        dados.nota > 99
      ) {
        throw Object.assign(
          new Error("A nota deve ser um número inteiro entre 1 e 99."),
          { status: 400 }
        );
      }

      dadosAtualizados.nota = dados.nota;
    }

    if (dados.timeId !== undefined) {
      const timeExistente = await timeRepository.findById(
        dados.timeId
      );

      if (!timeExistente) {
        throw Object.assign(
          new Error("Time não encontrado."),
          { status: 404 }
        );
      }

      dadosAtualizados.timeId = dados.timeId;
    }

    if (Object.keys(dadosAtualizados).length === 0) {
      throw Object.assign(
        new Error("Informe algum campo para atualizar."),
        { status: 400 }
      );
    }

    return await atletaRepository.update(id, dadosAtualizados);
  }

  async delete(id) {
    await this.getById(id);

    return await atletaRepository.delete(id);
  }

}

export default new AtletaService();
