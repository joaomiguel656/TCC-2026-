
import { jest, describe, test, expect, beforeEach } from "@jest/globals";
import express from "express";
import request from "supertest";

// Mock do Service
const usuarioServiceMock = {
  getAll: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
};

// Substitui o Service real pelo mock
jest.unstable_mockModule("./usuario.service.js", () => ({
  default: usuarioServiceMock
}));

// Importa as rotas após configurar o mock
const { default: usuarioRoutes } = await import("./usuario.routes.js");

// Criação da aplicação Express para os testes
const app = express();

app.use(express.json());
app.use("/usuarios", usuarioRoutes);

// Middleware para tratamento de erros
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    mensagem: error.message
  });
});

describe("Testes do módulo Usuário", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // GET /usuarios
  test("Deve listar todos os usuários", async () => {

    const usuarios = [
      { id: "1", nome: "João", email: "joao@email.com" },
      { id: "2", nome: "Pedro", email: "pedro@email.com" }
    ];

    usuarioServiceMock.getAll.mockResolvedValue(usuarios);

    const response = await request(app)
      .get("/usuarios");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(usuarios);
    expect(usuarioServiceMock.getAll).toHaveBeenCalledTimes(1);

  });

  // GET /usuarios/:id
  test("Deve buscar um usuário pelo ID", async () => {

    const usuario = {
      id: "1",
      nome: "João",
      email: "joao@email.com"
    };

    usuarioServiceMock.getById.mockResolvedValue(usuario);

    const response = await request(app)
      .get("/usuarios/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(usuario);
    expect(usuarioServiceMock.getById).toHaveBeenCalledWith("1");

  });

  // POST /usuarios
  test("Deve cadastrar um novo usuário", async () => {

    const novoUsuario = {
      nome: "João",
      email: "joao@email.com",
      senha: "senha123"
    };

    const usuarioCriado = {
      id: "1",
      nome: "João",
      email: "joao@email.com"
    };

    usuarioServiceMock.create.mockResolvedValue(usuarioCriado);

    const response = await request(app)
      .post("/usuarios")
      .send(novoUsuario);

    expect(response.status).toBe(201);

    expect(response.body).toEqual({
      mensagem: "Usuário cadastrado com sucesso!",
      usuario: usuarioCriado
    });

    expect(usuarioServiceMock.create).toHaveBeenCalledWith(novoUsuario);

  });

  // PUT /usuarios/:id
  test("Deve atualizar um usuário existente", async () => {

    const dadosAtualizados = {
      nome: "João Atualizado",
      email: "joaoatualizado@email.com"
    };

    const usuarioAtualizado = {
      id: "1",
      nome: "João Atualizado",
      email: "joaoatualizado@email.com"
    };

    usuarioServiceMock.update.mockResolvedValue(usuarioAtualizado);

    const response = await request(app)
      .put("/usuarios/1")
      .send(dadosAtualizados);

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      mensagem: "Usuário atualizado com sucesso!",
      usuario: usuarioAtualizado
    });

    expect(usuarioServiceMock.update).toHaveBeenCalledWith(
      "1",
      dadosAtualizados
    );

  });

  // DELETE /usuarios/:id
  test("Deve excluir um usuário existente", async () => {

    usuarioServiceMock.delete.mockResolvedValue(undefined);

    const response = await request(app)
      .delete("/usuarios/1");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      mensagem: "Usuário excluído com sucesso!"
    });

    expect(usuarioServiceMock.delete).toHaveBeenCalledWith("1");

  });

});
