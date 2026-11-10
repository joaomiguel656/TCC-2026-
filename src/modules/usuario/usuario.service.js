
import bcrypt from "bcryptjs";

import usuarioRepository from "./usuario.repository.js";

class UsuarioService {

  // Remove a senha antes de enviar os dados ao frontend
  removerSenha(usuario) {
    if (!usuario) return null;

    const { senha, ...dadosPublicos } = usuario;

    return dadosPublicos;
  }

  async getAll() {
    const usuarios = await usuarioRepository.findAll();

    return usuarios.map((usuario) =>
      this.removerSenha(usuario)
    );
  }

  async getById(id) {
    const usuario = await usuarioRepository.findById(id);

    if (!usuario) {
      throw Object.assign(
        new Error("Usuário não encontrado."),
        { status: 404 }
      );
    }

    return this.removerSenha(usuario);
  }

  async create(dados) {
    const { nome, email, senha } = dados;

    // Validação do nome
    if (typeof nome !== "string" || !nome.trim()) {
      throw Object.assign(
        new Error("O nome do usuário é obrigatório."),
        { status: 400 }
      );
    }

    if (nome.trim().length > 100) {
      throw Object.assign(
        new Error("O nome deve possuir no máximo 100 caracteres."),
        { status: 400 }
      );
    }

    // Validação do email
    if (typeof email !== "string" || !email.trim()) {
      throw Object.assign(
        new Error("O e-mail é obrigatório."),
        { status: 400 }
      );
    }

    const emailFormatado = email.trim().toLowerCase();

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      emailFormatado
    );

    if (!emailValido || emailFormatado.length > 255) {
      throw Object.assign(
        new Error("Informe um e-mail válido."),
        { status: 400 }
      );
    }

    // Validação da senha
    if (typeof senha !== "string" || senha.length < 8) {
      throw Object.assign(
        new Error("A senha deve possuir pelo menos 8 caracteres."),
        { status: 400 }
      );
    }

    // Verifica se o email já está cadastrado
    const usuarioExistente =
      await usuarioRepository.findByEmail(emailFormatado);

    if (usuarioExistente) {
      throw Object.assign(
        new Error("Esse e-mail já está cadastrado."),
        { status: 409 }
      );
    }

    // Criptografa a senha
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const novoUsuario = await usuarioRepository.create({
      nome: nome.trim(),
      email: emailFormatado,
      senha: senhaCriptografada
    });

    return this.removerSenha(novoUsuario);
  }

  async update(id, dados) {
    const usuarioAtual = await usuarioRepository.findById(id);

    if (!usuarioAtual) {
      throw Object.assign(
        new Error("Usuário não encontrado."),
        { status: 404 }
      );
    }

    const dadosAtualizados = {};

    // Atualização do nome
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

      dadosAtualizados.nome = dados.nome.trim();
    }

    // Atualização do email
    if (dados.email !== undefined) {
      if (typeof dados.email !== "string" || !dados.email.trim()) {
        throw Object.assign(
          new Error("Informe um e-mail válido."),
          { status: 400 }
        );
      }

      const emailFormatado = dados.email.trim().toLowerCase();

      const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        emailFormatado
      );

      if (!emailValido || emailFormatado.length > 255) {
        throw Object.assign(
          new Error("Informe um e-mail válido."),
          { status: 400 }
        );
      }

      const emailExistente =
        await usuarioRepository.findByEmail(emailFormatado);

      if (emailExistente && emailExistente.id !== id) {
        throw Object.assign(
          new Error("Esse e-mail já está sendo utilizado."),
          { status: 409 }
        );
      }

      dadosAtualizados.email = emailFormatado;
    }

    // Atualização da senha
    if (dados.senha !== undefined) {
      if (
        typeof dados.senha !== "string" ||
        dados.senha.length < 8
      ) {
        throw Object.assign(
          new Error("A senha deve possuir pelo menos 8 caracteres."),
          { status: 400 }
        );
      }

      dadosAtualizados.senha = await bcrypt.hash(dados.senha, 10);
    }

    if (Object.keys(dadosAtualizados).length === 0) {
      throw Object.assign(
        new Error("Informe pelo menos um dado para atualizar."),
        { status: 400 }
      );
    }

    const usuarioAtualizado = await usuarioRepository.update(
      id,
      dadosAtualizados
    );

    return this.removerSenha(usuarioAtualizado);
  }

  async delete(id) {
    await this.getById(id);

    const usuarioExcluido = await usuarioRepository.delete(id);

    return this.removerSenha(usuarioExcluido);
  }

}

export default new UsuarioService();
