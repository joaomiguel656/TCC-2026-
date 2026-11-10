
import timeRepository from "./time.repository.js";

class TimeService {

  async getAll() {
    return await timeRepository.findAll();
  }

  async getById(id) {
    const time = await timeRepository.findById(id);

    if (!time) {
      throw Object.assign(
        new Error("Time não encontrado."),
        { status: 404 }
      );
    }

    return time;
  }

  async create(dados) {
    const { nome, ano } = dados;

    if (!nome || typeof nome !== "string" || !nome.trim()) {
      throw Object.assign(
        new Error("O nome do time é obrigatório."),
        { status: 400 }
      );
    }

    if (ano === undefined || ano === null || !Number.isInteger(ano)) {
      throw Object.assign(
        new Error("O ano deve ser um número inteiro."),
        { status: 400 }
      );
    }

    const nomeFormatado = nome.trim();

    const timeExistente = await timeRepository.findByNomeAno(
      nomeFormatado,
      ano
    );

    if (timeExistente) {
      throw Object.assign(
        new Error("Esse time já está cadastrado nesse ano."),
        { status: 409 }
      );
    }

    return await timeRepository.create({
      nome: nomeFormatado,
      ano
    });
  }

  async update(id, dados) {
    await this.getById(id);

    const dadosAtualizados = {};

    if (dados.nome !== undefined) {
      if (
        typeof dados.nome !== "string" ||
        !dados.nome.trim()
      ) {
        throw Object.assign(
          new Error("O nome informado é inválido."),
          { status: 400 }
        );
      }

      dadosAtualizados.nome = dados.nome.trim();
    }

    if (dados.ano !== undefined) {
      if (!Number.isInteger(dados.ano)) {
        throw Object.assign(
          new Error("O ano deve ser um número inteiro."),
          { status: 400 }
        );
      }

      dadosAtualizados.ano = dados.ano;
    }

    if (Object.keys(dadosAtualizados).length === 0) {
      throw Object.assign(
        new Error("Informe pelo menos um campo para atualizar."),
        { status: 400 }
      );
    }

    const nomeFinal = dadosAtualizados.nome ?? (await this.getById(id)).nome;
    const anoFinal = dadosAtualizados.ano ?? (await this.getById(id)).ano;

    const timeExistente = await timeRepository.findByNomeAno(
      nomeFinal,
      anoFinal
    );

    if (timeExistente && timeExistente.id !== id) {
      throw Object.assign(
        new Error("Já existe um time com esse nome e ano."),
        { status: 409 }
      );
    }

    return await timeRepository.update(id, dadosAtualizados);
  }

  async delete(id) {
    await this.getById(id);

    return await timeRepository.delete(id);
  }

}

export default new TimeService();
