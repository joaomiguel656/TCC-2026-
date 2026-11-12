import giroRepository from "./giro.repository.js";

import escalacaoRepository from "../escalacoes/escalacao.repository.js";
import timeRepository from "../times/time.repository.js";
import escalacaoAtletaRepository from "../escalacao-atletas/escalacaoAtleta.repository.js";

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
    const escalacao = await escalacaoRepository.findById(escalacaoId);

    if (!escalacao) {
      throw Object.assign(
        new Error("Escalação não encontrada."),
        { status: 404 }
      );
    }

    return await giroRepository.findByEscalacao(escalacaoId);
  }

  async create(dados) {

    if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
      throw Object.assign(
        new Error("Dados do giro inválidos."),
        { status: 400 }
      );
    }

    const {
      escalacaoId,
      timeId,
      numero,
      eRegiro,
      giroAnteriorId
    } = dados;

    // Verifica os campos obrigatórios
    if (!escalacaoId || !timeId) {
      throw Object.assign(
        new Error("Escalação e time são obrigatórios."),
        { status: 400 }
      );
    }

    // Valida o número do giro
    if (!Number.isInteger(numero) || numero < 1) {
      throw Object.assign(
        new Error("Número do giro inválido."),
        { status: 400 }
      );
    }

    // Valida o campo eRegiro
    if (eRegiro !== undefined && typeof eRegiro !== "boolean") {
      throw Object.assign(
        new Error("O campo eRegiro deve ser verdadeiro ou falso."),
        { status: 400 }
      );
    }

    // Verifica se a escalação existe
    const escalacaoExistente =
      await escalacaoRepository.findById(escalacaoId);

    if (!escalacaoExistente) {
      throw Object.assign(
        new Error("Escalação não encontrada."),
        { status: 404 }
      );
    }

    // Impede giros em escalações finalizadas
    if (escalacaoExistente.status !== "EM_ANDAMENTO") {
      throw Object.assign(
        new Error("Não é possível realizar giros em uma escalação finalizada."),
        { status: 400 }
      );
    }

    // Verifica se o time existe
    const timeExistente =
      await timeRepository.findById(timeId);

    if (!timeExistente) {
      throw Object.assign(
        new Error("Time não encontrado."),
        { status: 404 }
      );
    }

    // Impede a repetição do número do giro
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

    // Define se será um giro normal ou re-giro
    const seraRegiro = eRegiro ?? false;

    // Giro normal não pode possuir giro anterior
    if (!seraRegiro && giroAnteriorId) {
      throw Object.assign(
        new Error("Um giro normal não pode possuir um giro anterior."),
        { status: 400 }
      );
    }

    // Re-giro precisa informar o giro anterior
    if (seraRegiro && !giroAnteriorId) {
      throw Object.assign(
        new Error("É obrigatório informar o giro anterior para realizar um re-giro."),
        { status: 400 }
      );
    }

    if (seraRegiro) {

      // Conta os re-giros realizados
      const quantidadeRegiros =
        await giroRepository.countRegiros(escalacaoId);

      if (quantidadeRegiros >= 5) {
        throw Object.assign(
          new Error("Limite de cinco re-giros atingido."),
          { status: 400 }
        );
      }

      // Busca o giro que será substituído
      const giroAnterior =
        await giroRepository.findById(giroAnteriorId);

      if (!giroAnterior) {
        throw Object.assign(
          new Error("Giro anterior não encontrado."),
          { status: 404 }
        );
      }

      // Verifica se pertence à mesma escalação
      if (giroAnterior.escalacaoId !== escalacaoId) {
        throw Object.assign(
          new Error("O giro anterior pertence a outra escalação."),
          { status: 400 }
        );
      }

      // Impede substituir um giro já utilizado
      const giroAnteriorUtilizado =
        await escalacaoAtletaRepository.findByGiro(giroAnteriorId);

      if (giroAnteriorUtilizado) {
        throw Object.assign(
          new Error("Esse giro já foi utilizado para preencher uma posição e não pode ser substituído."),
          { status: 409 }
        );
      }

      // Impede substituir um giro que já foi substituído
      const giroJaSubstituido =
        await giroRepository.findByGiroAnterior(giroAnteriorId);

      if (giroJaSubstituido) {
        throw Object.assign(
          new Error("Esse giro já foi substituído por outro re-giro."),
          { status: 409 }
        );
      }

    }

    // Registra o novo giro
    return await giroRepository.create({
      escalacaoId,
      timeId,
      numero,
      eRegiro: seraRegiro,
      giroAnteriorId: seraRegiro ? giroAnteriorId : null
    });
  }

}

export default new GiroService();