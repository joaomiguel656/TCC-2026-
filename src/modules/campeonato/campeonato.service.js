
import campeonatoRepository from "./campeonato.repository.js";

import usuarioRepository from "../usuarios/usuario.repository.js";
import escalacaoRepository from "../escalacoes/escalacao.repository.js";

class CampeonatoService {

  async getAll() {
    return await campeonatoRepository.findAll();
  }

  async getById(id) {
    const campeonato = await campeonatoRepository.findById(id);

    if (!campeonato) {
      throw Object.assign(
        new Error("Campeonato não encontrado."),
        { status: 404 }
      );
    }

    return campeonato;
  }

  // Busca os participantes de um campeonato
  async getParticipantes(campeonatoId) {
    await this.getById(campeonatoId);

    return await campeonatoRepository.findParticipantes(
      campeonatoId
    );
  }

  // Cadastra um campeonato
  async create(dados) {
    const { nome } = dados;

    if (typeof nome !== "string" || !nome.trim()) {
      throw Object.assign(
        new Error("O nome do campeonato é obrigatório."),
        { status: 400 }
      );
    }

    const nomeFormatado = nome.trim();

    if (nomeFormatado.length > 100) {
      throw Object.assign(
        new Error("O nome deve possuir no máximo 100 caracteres."),
        { status: 400 }
      );
    }

    const campeonatoExistente =
      await campeonatoRepository.findByNome(nomeFormatado);

    if (campeonatoExistente) {
      throw Object.assign(
        new Error("Já existe um campeonato com esse nome."),
        { status: 409 }
      );
    }

    // O status inicial será sempre AGUARDANDO
    return await campeonatoRepository.create({
      nome: nomeFormatado,
      status: "AGUARDANDO"
    });
  }

  // Atualiza o nome ou o status do campeonato
  async update(id, dados) {
    const campeonatoAtual = await this.getById(id);

    const dadosAtualizados = {};

    if (dados.nome !== undefined) {
      if (
        typeof dados.nome !== "string" ||
        !dados.nome.trim() ||
        dados.nome.trim().length > 100
      ) {
        throw Object.assign(
          new Error("Informe um nome válido de até 100 caracteres."),
          { status: 400 }
        );
      }

      const nomeFormatado = dados.nome.trim();

      const campeonatoExistente =
        await campeonatoRepository.findByNome(nomeFormatado);

      if (
        campeonatoExistente &&
        campeonatoExistente.id !== id
      ) {
        throw Object.assign(
          new Error("Já existe outro campeonato com esse nome."),
          { status: 409 }
        );
      }

      dadosAtualizados.nome = nomeFormatado;
    }

    if (dados.status !== undefined) {
      const statusPermitidos = [
        "AGUARDANDO",
        "EM_ANDAMENTO",
        "FINALIZADO"
      ];

      if (!statusPermitidos.includes(dados.status)) {
        throw Object.assign(
          new Error("Status do campeonato inválido."),
          { status: 400 }
        );
      }

      // Impede retornar para uma etapa anterior
      const transicoesPermitidas = {
        AGUARDANDO: ["EM_ANDAMENTO"],
        EM_ANDAMENTO: ["FINALIZADO"],
        FINALIZADO: []
      };

      if (
        dados.status !== campeonatoAtual.status &&
        !transicoesPermitidas[campeonatoAtual.status].includes(
          dados.status
        )
      ) {
        throw Object.assign(
          new Error("Essa mudança de status não é permitida."),
          { status: 400 }
        );
      }

      dadosAtualizados.status = dados.status;
    }

    if (Object.keys(dadosAtualizados).length === 0) {
      throw Object.assign(
        new Error("Informe algum dado para atualizar."),
        { status: 400 }
      );
    }

    return await campeonatoRepository.update(
      id,
      dadosAtualizados
    );
  }

  // Inscreve um usuário em um campeonato
  async adicionarParticipante(dados) {
    const { campeonatoId, usuarioId, escalacaoId } = dados;

    if (!campeonatoId || !usuarioId || !escalacaoId) {
      throw Object.assign(
        new Error(
          "Campeonato, usuário e escalação são obrigatórios."
        ),
        { status: 400 }
      );
    }

    // Verifica se o campeonato existe
    const campeonato = await this.getById(campeonatoId);

    // Só permite inscrições enquanto aguarda o início
    if (campeonato.status !== "AGUARDANDO") {
      throw Object.assign(
        new Error(
          "Não é possível participar de um campeonato que já começou."
        ),
        { status: 400 }
      );
    }

    // Verifica se o usuário existe
    const usuario = await usuarioRepository.findById(usuarioId);

    if (!usuario) {
      throw Object.assign(
        new Error("Usuário não encontrado."),
        { status: 404 }
      );
    }

    // Verifica se a escalação existe
    const escalacao = await escalacaoRepository.findById(
      escalacaoId
    );

    if (!escalacao) {
      throw Object.assign(
        new Error("Escalação não encontrada."),
        { status: 404 }
      );
    }

    // Verifica se a escalação pertence ao usuário
    if (escalacao.usuarioId !== usuarioId) {
      throw Object.assign(
        new Error(
          "Essa escalação não pertence ao usuário informado."
        ),
        { status: 403 }
      );
    }

    // Verifica se o usuário já está inscrito
    const usuarioInscrito =
      await campeonatoRepository.findByCampeonatoEUsuario(
        campeonatoId,
        usuarioId
      );

    if (usuarioInscrito) {
      throw Object.assign(
        new Error("Esse usuário já participa do campeonato."),
        { status: 409 }
      );
    }

    // Verifica se a escalação já foi utilizada
    const escalacaoUtilizada =
      await campeonatoRepository.findByCampeonatoEEscalacao(
        campeonatoId,
        escalacaoId
      );

    if (escalacaoUtilizada) {
      throw Object.assign(
        new Error("Essa escalação já está inscrita no campeonato."),
        { status: 409 }
      );
    }

    return await campeonatoRepository.createParticipante({
      campeonatoId,
      usuarioId,
      escalacaoId
    });
  }

  // Remove um participante
  async removerParticipante(id) {
    // Busca o campeonato associado à inscrição
    // A consulta específica será feita pelo ID do participante
    const participante = await campeonatoRepository.findParticipanteById(id);

    if (!participante) {
      throw Object.assign(
        new Error("Participante não encontrado."),
        { status: 404 }
      );
    }

    const campeonato = await this.getById(
      participante.campeonatoId
    );

    if (campeonato.status !== "AGUARDANDO") {
      throw Object.assign(
        new Error(
          "Não é possível remover participantes após o início do campeonato."
        ),
        { status: 400 }
      );
    }

    return await campeonatoRepository.deleteParticipante(id);
  }

  async delete(id) {
    const campeonato = await this.getById(id);

    if (campeonato.status !== "AGUARDANDO") {
      throw Object.assign(
        new Error(
          "Somente campeonatos que ainda não começaram podem ser excluídos."
        ),
        { status: 400 }
      );
    }

    return await campeonatoRepository.delete(id);
  }

}

export default new CampeonatoService();
