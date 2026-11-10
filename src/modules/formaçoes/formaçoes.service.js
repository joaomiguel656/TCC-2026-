
import formacaoRepository from "./formacao.repository.js";
import posicaoRepository from "../posicoes/posicao.repository.js";

class FormacaoService {

  async getAll() {
    return await formacaoRepository.findAll();
  }

  async getById(id) {
    const formacao = await formacaoRepository.findById(id);

    if (!formacao) {
      throw Object.assign(
        new Error("Formação não encontrada."),
        { status: 404 }
      );
    }

    return formacao;
  }

  // Valida o nome da formação
  validarNome(nome) {
    if (typeof nome !== "string" || !nome.trim()) {
      throw Object.assign(
        new Error("O nome da formação é obrigatório."),
        { status: 400 }
      );
    }

    const nomeFormatado = nome.trim();

    if (nomeFormatado.length > 20) {
      throw Object.assign(
        new Error("O nome da formação deve possuir no máximo 20 caracteres."),
        { status: 400 }
      );
    }

    return nomeFormatado;
  }

  // Valida as posições e suas quantidades
  async validarPosicoes(posicoes) {
    if (!Array.isArray(posicoes) || posicoes.length === 0) {
      throw Object.assign(
        new Error("Informe as posições da formação."),
        { status: 400 }
      );
    }

    let totalVagas = 0;

    const posicoesUtilizadas = new Set();

    for (const item of posicoes) {

      if (!item.posicaoId) {
        throw Object.assign(
          new Error("Toda posição precisa possuir um posicaoId."),
          { status: 400 }
        );
      }

      if (
        !Number.isInteger(item.quantidade) ||
        item.quantidade <= 0
      ) {
        throw Object.assign(
          new Error("A quantidade de cada posição deve ser um inteiro positivo."),
          { status: 400 }
        );
      }

      // Impede repetir a mesma categoria
      if (posicoesUtilizadas.has(item.posicaoId)) {
        throw Object.assign(
          new Error("Uma posição não pode ser repetida na mesma formação."),
          { status: 409 }
        );
      }

      posicoesUtilizadas.add(item.posicaoId);

      // Verifica se a posição existe
      const posicaoExistente =
        await posicaoRepository.findById(item.posicaoId);

      if (!posicaoExistente) {
        throw Object.assign(
          new Error(`A posição ${item.posicaoId} não foi encontrada.`),
          { status: 404 }
        );
      }

      totalVagas += item.quantidade;
    }

    // Toda formação precisa possuir 11 jogadores
    if (totalVagas !== 11) {
      throw Object.assign(
        new Error(
          `A formação deve possuir exatamente 11 vagas. Atualmente possui ${totalVagas}.`
        ),
        { status: 400 }
      );
    }

    return posicoes;
  }

  async create(dados) {
    const nome = this.validarNome(dados.nome);

    const formacaoExistente =
      await formacaoRepository.findByNome(nome);

    if (formacaoExistente) {
      throw Object.assign(
        new Error("Essa formação já está cadastrada."),
        { status: 409 }
      );
    }

    const posicoes = await this.validarPosicoes(dados.posicoes);

    return await formacaoRepository.create(
      { nome },
      posicoes
    );
  }

  async update(id, dados) {
    await this.getById(id);

    const dadosAtualizados = {};
    let posicoes = undefined;

    if (dados.nome !== undefined) {
      const nome = this.validarNome(dados.nome);

      const formacaoExistente =
        await formacaoRepository.findByNome(nome);

      if (formacaoExistente && formacaoExistente.id !== id) {
        throw Object.assign(
          new Error("Já existe outra formação com esse nome."),
          { status: 409 }
        );
      }

      dadosAtualizados.nome = nome;
    }

    if (dados.posicoes !== undefined) {
      posicoes = await this.validarPosicoes(dados.posicoes);
    }

    if (
      Object.keys(dadosAtualizados).length === 0 &&
      posicoes === undefined
    ) {
      throw Object.assign(
        new Error("Informe algum dado para atualizar."),
        { status: 400 }
      );
    }

    return await formacaoRepository.update(
      id,
      dadosAtualizados,
      posicoes
    );
  }

  async delete(id) {
    await this.getById(id);

    return await formacaoRepository.delete(id);
  }

}

export default new FormacaoService();
