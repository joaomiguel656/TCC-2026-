
import escalacaoAtletaRepository from "./escalacaoAtleta.repository.js";

import escalacaoRepository from "../escalacoes/escalacao.repository.js";
import giroRepository from "../giros/giro.repository.js";
import posicaoRepository from "../posicao/posicao.repository.js";
import formacaoRepository from "../formacoes/formacao.repository.js";

class EscalacaoAtletaService {

  async getAll() {
    return await escalacaoAtletaRepository.findAll();
  }

  async getById(id) {
    const registro = await escalacaoAtletaRepository.findById(id);

    if (!registro) {
      throw Object.assign(
        new Error("Registro da escalação não encontrado."),
        { status: 404 }
      );
    }

    return registro;
  }

  async getByEscalacao(escalacaoId) {
    const escalacao = await escalacaoRepository.findById(escalacaoId);

    if (!escalacao) {
      throw Object.assign(
        new Error("Escalação não encontrada."),
        { status: 404 }
      );
    }

    return await escalacaoAtletaRepository.findByEscalacao(escalacaoId);
  }

  // Define automaticamente o número da vaga disponível
  definirNumeroVaga(posicaoFormacao, registrosExistentes) {
    const vagasOcupadas = new Set(
      registrosExistentes.map(registro => registro.numeroVaga)
    );

    for (let numero = 1; numero <= posicaoFormacao.quantidade; numero++) {
      if (!vagasOcupadas.has(numero)) {
        return numero;
      }
    }

    throw Object.assign(
      new Error("Todas as vagas dessa posição já foram preenchidas."),
      { status: 409 }
    );
  }

  async create(dados) {

    if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
      throw Object.assign(
        new Error("Dados inválidos para preencher a escalação."),
        { status: 400 }
      );
    }

    const { escalacaoId, posicaoId, giroId } = dados;

    if (!escalacaoId || !posicaoId || !giroId) {
      throw Object.assign(
        new Error("Escalação, posição e giro são obrigatórios."),
        { status: 400 }
      );
    }

    // Verifica se a escalação existe
    const escalacao = await escalacaoRepository.findById(escalacaoId);

    if (!escalacao) {
      throw Object.assign(
        new Error("Escalação não encontrada."),
        { status: 404 }
      );
    }

    // Verifica se a escalação está em andamento
    if (escalacao.status !== "EM_ANDAMENTO") {
      throw Object.assign(
        new Error("Essa escalação já foi finalizada."),
        { status: 400 }
      );
    }

    // Verifica se a posição existe
    const posicao = await posicaoRepository.findById(posicaoId);

    if (!posicao) {
      throw Object.assign(
        new Error("Posição não encontrada."),
        { status: 404 }
      );
    }

    // Verifica se o giro existe
    const giro = await giroRepository.findById(giroId);

    if (!giro) {
      throw Object.assign(
        new Error("Giro não encontrado."),
        { status: 404 }
      );
    }

    // Verifica se o giro pertence à escalação
    if (giro.escalacaoId !== escalacaoId) {
      throw Object.assign(
        new Error("Esse giro não pertence à escalação informada."),
        { status: 400 }
      );
    }

    // Verifica se o giro já foi utilizado
    const giroUtilizado = await escalacaoAtletaRepository.findByGiro(giroId);

    if (giroUtilizado) {
      throw Object.assign(
        new Error("Esse giro já foi utilizado."),
        { status: 409 }
      );
    }

    // Impede a utilização de um giro que já foi substituído
    const giroSubstituido = await giroRepository.findByGiroAnterior(giroId);

    if (giroSubstituido) {
      throw Object.assign(
        new Error("Esse giro já foi substituído por um re-giro."),
        { status: 409 }
      );
    }

    // Se for um re-giro, verifica se o giro anterior continua sem utilização
    if (giro.giroAnteriorId) {
      const giroAnteriorUtilizado =
        await escalacaoAtletaRepository.findByGiro(giro.giroAnteriorId);

      if (giroAnteriorUtilizado) {
        throw Object.assign(
          new Error("O giro anterior já foi utilizado. Não é possível substituí-lo."),
          { status: 409 }
        );
      }
    }

    // Busca a formação escolhida na escalação
    const formacao = await formacaoRepository.findById(
      escalacao.formacaoId
    );

    if (!formacao) {
      throw Object.assign(
        new Error("Formação da escalação não encontrada."),
        { status: 404 }
      );
    }

    // Verifica se a posição faz parte da formação
    const posicaoFormacao = formacao.posicoes.find(
      item => item.posicaoId === posicaoId
    );

    if (!posicaoFormacao) {
      throw Object.assign(
        new Error("Essa posição não faz parte da formação escolhida."),
        { status: 400 }
      );
    }

    // O schema atual permite no máximo duas vagas por posição
    if (posicaoFormacao.quantidade > 2) {
      throw Object.assign(
        new Error("A formação possui uma quantidade de vagas incompatível com o schema atual."),
        { status: 400 }
      );
    }

    // Verifica o limite total de 11 atletas
    const atletasNaEscalacao =
      await escalacaoAtletaRepository.findByEscalacao(escalacaoId);

    if (atletasNaEscalacao.length >= 11) {
      throw Object.assign(
        new Error("A escalação já possui os 11 atletas."),
        { status: 409 }
      );
    }

    // Busca as vagas já ocupadas nessa posição
    const registrosExistentes =
      await escalacaoAtletaRepository.findByEscalacaoEPosicao(
        escalacaoId,
        posicaoId
      );

    // Descobre automaticamente a próxima vaga disponível
    const numeroVaga = this.definirNumeroVaga(
      posicaoFormacao,
      registrosExistentes
    );

    // Registra o jogador na vaga
    return await escalacaoAtletaRepository.create({
      escalacaoId,
      posicaoId,
      giroId,
      numeroVaga
    });
  }

}

export default new EscalacaoAtletaService();
