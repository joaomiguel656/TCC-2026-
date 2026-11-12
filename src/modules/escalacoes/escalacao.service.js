
import escalacaoRepository from "./escalacao.repository.js";

import usuarioRepository from "../usuarios/usuario.repository.js";
import formacaoRepository from "../formacoes/formacao.repository.js";
import giroRepository from "../giros/giro.repository.js";
import escalacaoAtletaRepository from "../escalacao-atletas/escalacaoAtleta.repository.js";

class EscalacaoService {

  // Busca todas as escalações
  async getAll() {
    return await escalacaoRepository.findAll();
  }

  // Busca uma escalação pelo ID
  async getById(id) {
    const escalacao = await escalacaoRepository.findById(id);

    if (!escalacao) {
      throw Object.assign(
        new Error("Escalação não encontrada."),
        { status: 404 }
      );
    }

    return escalacao;
  }

  // Busca as escalações de um usuário
  async getByUsuario(usuarioId) {
    const usuario = await usuarioRepository.findById(usuarioId);

    if (!usuario) {
      throw Object.assign(
        new Error("Usuário não encontrado."),
        { status: 404 }
      );
    }

    return await escalacaoRepository.findByUsuario(usuarioId);
  }

  // Cria uma nova escalação
  async create(dados) {

    // Valida o objeto recebido
    if (
      !dados ||
      typeof dados !== "object" ||
      Array.isArray(dados)
    ) {
      throw Object.assign(
        new Error("Dados da escalação inválidos."),
        { status: 400 }
      );
    }

    const { usuarioId, formacaoId, nome } = dados;

    // Verifica os campos obrigatórios
    if (!usuarioId || !formacaoId) {
      throw Object.assign(
        new Error("Usuário e formação são obrigatórios."),
        { status: 400 }
      );
    }

    // Valida o nome
    if (nome !== undefined && nome !== null) {
      if (
        typeof nome !== "string" ||
        !nome.trim() ||
        nome.trim().length > 100
      ) {
        throw Object.assign(
          new Error("O nome deve possuir entre 1 e 100 caracteres."),
          { status: 400 }
        );
      }
    }

    // Verifica se o usuário existe
    const usuario = await usuarioRepository.findById(usuarioId);

    if (!usuario) {
      throw Object.assign(
        new Error("Usuário não encontrado."),
        { status: 404 }
      );
    }

    // Verifica se a formação existe
    const formacao = await formacaoRepository.findById(formacaoId);

    if (!formacao) {
      throw Object.assign(
        new Error("Formação não encontrada."),
        { status: 404 }
      );
    }

    return await escalacaoRepository.create({
      usuarioId,
      formacaoId,
      nome: nome?.trim() || null
    });
  }

  // Atualiza o nome de uma escalação
  async update(id, dados) {

    const escalacao = await this.getById(id);

    // Impede alterações em escalações finalizadas
    if (escalacao.status === "FINALIZADA") {
      throw Object.assign(
        new Error("Não é possível alterar uma escalação finalizada."),
        { status: 409 }
      );
    }

    // Valida o objeto recebido
    if (
      !dados ||
      typeof dados !== "object" ||
      Array.isArray(dados)
    ) {
      throw Object.assign(
        new Error("Dados de atualização inválidos."),
        { status: 400 }
      );
    }

    // Somente o nome pode ser atualizado por este método
    const camposPermitidos = ["nome"];

    const camposInvalidos = Object.keys(dados).some(
      campo => !camposPermitidos.includes(campo)
    );

    if (camposInvalidos) {
      throw Object.assign(
        new Error("Não é permitido atualizar esses campos."),
        { status: 400 }
      );
    }

    const dadosAtualizados = {};

    if (dados.nome !== undefined) {

      // Permite limpar o nome utilizando null
      if (dados.nome === null) {
        dadosAtualizados.nome = null;
      } else if (
        typeof dados.nome === "string" &&
        dados.nome.trim() &&
        dados.nome.trim().length <= 100
      ) {
        dadosAtualizados.nome = dados.nome.trim();
      } else {
        throw Object.assign(
          new Error("O nome informado é inválido."),
          { status: 400 }
        );
      }
    }

    if (Object.keys(dadosAtualizados).length === 0) {
      throw Object.assign(
        new Error("Informe algum campo para atualizar."),
        { status: 400 }
      );
    }

    return await escalacaoRepository.update(
      id,
      dadosAtualizados
    );
  }

  // Finaliza uma escalação
  async finalizar(id) {

    const escalacao = await this.getById(id);

    if (escalacao.status === "FINALIZADA") {
      throw Object.assign(
        new Error("Esta escalação já foi finalizada."),
        { status: 409 }
      );
    }

    // Busca os jogadores registrados na escalação
    const jogadores = await escalacaoAtletaRepository.findByEscalacao(id);

    // A escalação precisa possuir exatamente 11 jogadores
    if (jogadores.length !== 11) {
      throw Object.assign(
        new Error("A escalação precisa possuir exatamente 11 jogadores para ser finalizada."),
        { status: 400 }
      );
    }

    return await escalacaoRepository.update(id, {
      status: "FINALIZADA"
    });
  }

  // Exclui uma escalação
  async delete(id) {

    const escalacao = await this.getById(id);

    // Impede a exclusão de escalações finalizadas
    if (escalacao.status === "FINALIZADA") {
      throw Object.assign(
        new Error("Não é possível excluir uma escalação finalizada."),
        { status: 409 }
      );
    }

    // Verifica se existem giros registrados
    const giros = await giroRepository.findByEscalacao(id);

    if (giros.length > 0) {
      throw Object.assign(
        new Error("Não é possível excluir uma escalação que possui giros registrados."),
        { status: 409 }
      );
    }

    // Verifica se existem jogadores registrados
    const jogadores = await escalacaoAtletaRepository.findByEscalacao(id);

    if (jogadores.length > 0) {
      throw Object.assign(
        new Error("Não é possível excluir uma escalação que possui jogadores registrados."),
        { status: 409 }
      );
    }

    return await escalacaoRepository.delete(id);
  }

}

export default new EscalacaoService();
