
import escalacaoRepository from "./escalacao.repository.js";

class EscalacaoService {

  async getAll() {
    return await escalacaoRepository.findAll();
  }

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

  async getByUsuario(usuarioId) {
    return await escalacaoRepository.findByUsuario(usuarioId);
  }

  async create(dados) {
    const { usuarioId, formacaoId, nome } = dados;

    if (!usuarioId || !formacaoId) {
      throw Object.assign(
        new Error("Usuário e formação são obrigatórios."),
        { status: 400 }
      );
    }

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

    return await escalacaoRepository.create({
      usuarioId,
      formacaoId,
      nome: nome?.trim() || null
    });
  }

  async update(id, dados) {
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

  async delete(id) {
    await this.getById(id);

    return await escalacaoRepository.delete(id);
  }

}

export default new EscalacaoService();
