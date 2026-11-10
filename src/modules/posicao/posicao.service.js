
import posicaoRepository from "./posicao.repository.js";

class PosicaoService {

  async getAll() {
    return await posicaoRepository.findAll();
  }

  async getById(id) {
    const posicao = await posicaoRepository.findById(id);

    if (!posicao) {
      throw Object.assign(
        new Error("Posição não encontrada."),
        { status: 404 }
      );
    }

    return posicao;
  }

  async create(dados) {
    const { nome } = dados;

    if (typeof nome !== "string" || !nome.trim()) {
      throw Object.assign(
        new Error("O nome da posição é obrigatório."),
        { status: 400 }
      );
    }

    const nomeFormatado = nome.trim();

    if (nomeFormatado.length > 50) {
      throw Object.assign(
        new Error("O nome da posição deve possuir no máximo 50 caracteres."),
        { status: 400 }
      );
    }

    const posicaoExistente =
      await posicaoRepository.findByNome(nomeFormatado);

    if (posicaoExistente) {
      throw Object.assign(
        new Error("Essa posição já está cadastrada."),
        { status: 409 }
      );
    }

    return await posicaoRepository.create({
      nome: nomeFormatado
    });
  }

  async update(id, dados) {
    await this.getById(id);

    const { nome } = dados;

    if (typeof nome !== "string" || !nome.trim()) {
      throw Object.assign(
        new Error("O nome da posição é obrigatório."),
        { status: 400 }
      );
    }

    const nomeFormatado = nome.trim();

    if (nomeFormatado.length > 50) {
      throw Object.assign(
        new Error("O nome da posição deve possuir no máximo 50 caracteres."),
        { status: 400 }
      );
    }

    const posicaoExistente =
      await posicaoRepository.findByNome(nomeFormatado);

    if (posicaoExistente && posicaoExistente.id !== id) {
      throw Object.assign(
        new Error("Já existe outra posição com esse nome."),
        { status: 409 }
      );
    }

    return await posicaoRepository.update(id, {
      nome: nomeFormatado
    });
  }

  async delete(id) {
    await this.getById(id);

    return await posicaoRepository.delete(id);
  }

}

export default new PosicaoService();
