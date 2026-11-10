
import giroRepository from "./giro.repository.js";

import escalacaoRepository from "../escalacoes/escalacao.repository.js";
import timeRepository from "../times/time.repository.js";

class GiroService {

  async getAll() {
    return await giroRepository.findAll();
  }

  async getById(id) {
    const giro = await giroRepository.findById(id);

    if (!giro) {
      throw Object.assign(
        new Error("Giro não encontrado."),
        { status: 404 }
      );
    }

    return giro;
  }

  async getByEscalacao(escalacaoId) {
    return await giroRepository.findByEscalacao(escalacaoId);
  }

  async create(dados) {
    const { escalacaoId, timeId, numero, eRegiro } = dados;

    if (!escalacaoId || !timeId) {
      throw Object.assign(
        new Error("Escalação e time são obrigatórios."),
        { status: 400 }
      );
    }

    if (!Number.isInteger(numero) || numero < 1) {
      throw Object.assign(
        new Error("Número do giro inválido."),
        { status: 400 }
      );
    }

    const escalacaoExistente =
      await escalacaoRepository.findById(escalacaoId);

    if (!escalacaoExistente) {
      throw Object.assign(
        new Error("Escalação não encontrada."),
        { status: 404 }
      );
    }

    const timeExistente =
      await timeRepository.findById(timeId);

    if (!timeExistente) {
      throw Object.assign(
        new Error("Time não encontrado."),
        { status: 404 }
      );
    }

    const giroExistente =
      await giroRepository.findByEscalacaoENumero(
        escalacaoId,
        numero
      );

    if (giroExistente) {
      throw Object.assign(
        new Error("Esse número de giro já foi utilizado."),
        { status: 409 }
      );
    }

    const quantidadeRegiros =
      await giroRepository.countRegiros(escalacaoId);

    if (eRegiro && quantidadeRegiros >= 5) {
      throw Object.assign(
        new Error("Limite de cinco re giros atingido."),
        { status: 400 }
      );
    }

    return await giroRepository.create({
      escalacaoId,
      timeId,
      numero,
      eRegiro: eRegiro ?? false
    });
  }

  async delete(id) {
    await this.getById(id);

    return await giroRepository.delete(id);
  }

}

export default new GiroService();
