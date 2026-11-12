
import formacaoRepository from "./formacao.repository.js";
import posicaoRepository from "../posicoes/posicao.repository.js";

class FormacaoService {

  // Busca todas as formações
  async getAll() {
    return await formacaoRepository.findAll();
  }

  // Busca uma formação pelo ID
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

  // Valida o objeto recebido
  validarDados(dados) {
    if (
      !dados ||
      typeof dados !== "object" ||
      Array.isArray(dados)
    ) {
      throw Object.assign(
        new Error("Dados da formação inválidos."),
        { status: 400 }
      );
    }
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

      // Verifica se o item é válido
      if (
        !item ||
        typeof item !== "object" ||
        Array.isArray(item)
      ) {
        throw Object.assign(
          new Error("Uma das posições informadas é inválida."),
          { status: 400 }
        );
      }

      // Verifica se possui um ID
      if (!item.posicaoId) {
        throw Object.assign(
          new Error("Toda posição precisa possuir um posicaoId."),
          { status: 400 }
        );
      }

      // Verifica a quantidade de vagas
      if (
        !Number.isInteger(item.quantidade) ||
        item.quantidade < 1 ||
        item.quantidade > 2
      ) {
        throw Object.assign(
          new Error("Cada posição deve possuir entre 1 e 2 vagas."),
          { status: 400 }
        );
      }

      // Impede repetir a mesma posição
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

    // Toda formação precisa possuir exatamente 11 jogadores
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

  // Cria uma formação
  async create(dados) {

    this.validarDados(dados);

    const nome = this.validarNome(dados.nome);

    // Verifica se o nome já está cadastrado
    const formacaoExistente =
      await formacaoRepository.findByNome(nome);

    if (formacaoExistente) {
      throw Object.assign(
        new Error("Essa formação já está cadastrada."),
        { status: 409 }
      );
    }

    // Valida as posições
    const posicoes = await this.validarPosicoes(dados.posicoes);

    // Cria a formação e suas posições
    return await formacaoRepository.create(
      { nome },
      posicoes
    );
  }

  // Atualiza uma formação
  async update(id, dados) {

    await this.getById(id);

    this.validarDados(dados);

    const dadosAtualizados = {};

    let posicoes = undefined;

    // Verifica se o nome foi informado
    if (dados.nome !== undefined) {

      const nome = this.validarNome(dados.nome);

      // Verifica se outra formação utiliza o mesmo nome
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

    // Verifica se as posições foram informadas
    if (dados.posicoes !== undefined) {
      posicoes = await this.validarPosicoes(dados.posicoes);
    }

    // Verifica se existe algo para atualizar
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

  // Exclui uma formação
  async delete(id) {

    await this.getById(id);

    return await formacaoRepository.delete(id);
  }

}

export default new FormacaoService();
