
import { jest, describe, test, expect, beforeEach } from "@jest/globals";
import express from "express";
import request from "supertest";

// Mock do Service
const escalacaoServiceMock = {
  getAll: jest.fn(),
  getById: jest.fn(),
  getByUsuario: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  finalizar: jest.fn()
};

// Substitui o Service real pelo mock
jest.unstable_mockModule("./escalacao.service.js", () => ({
  default: escalacaoServiceMock
}));

// Importa as rotas após configurar o mock
const { default: escalacaoRoutes } = await import("./escalacao.routes.js");

// Criação da aplicação Express para os testes
const app = express();

app.use(express.json());
app.use("/escalacoes", escalacaoRoutes);

// Middleware para tratamento de erros
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    mensagem: error.message
  });
});

describe("Testes do módulo Escalação", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // GET /escalacoes
  test("Deve listar todas as escalações", async () => {

    const escalacoes = [
      { id: "1", usuarioId: "10", nome: "Meu time principal" },
      { id: "2", usuarioId: "11", nome: "Meu time reserva" }
    ];

    escalacaoServiceMock.getAll.mockResolvedValue(escalacoes);

    const response = await request(app)
      .get("/escalacoes");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(escalacoes);
    expect(escalacaoServiceMock.getAll).toHaveBeenCalledTimes(1);

  });

  // GET /escalacoes/:id
  test("Deve buscar uma escalação pelo ID", async () => {

    const escalacao = {
      id: "1",
      usuarioId: "10",
      nome: "Meu time principal"
    };

    escalacaoServiceMock.getById.mockResolvedValue(escalacao);

    const response = await request(app)
      .get("/escalacoes/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(escalacao);
    expect(escalacaoServiceMock.getById).toHaveBeenCalledWith("1");

  });

  // GET /escalacoes/usuario/:usuarioId
  test("Deve listar as escalações de um usuário", async () => {

    const usuarioId = "10";

    const escalacoes = [
      { id: "1", usuarioId: "10", nome: "Meu time principal" },
      { id: "2", usuarioId: "10", nome: "Meu time reserva" }
    ];

    escalacaoServiceMock.getByUsuario.mockResolvedValue(escalacoes);

    const response = await request(app)
      .get("/escalacoes/usuario/10");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(escalacoes);

    expect(escalacaoServiceMock.getByUsuario).toHaveBeenCalledWith(
      usuarioId
    );

  });

  // POST /escalacoes
  test("Deve criar uma nova escalação", async () => {

    const novaEscalacao = {
      usuarioId: "10",
      nome: "Meu time principal"
    };

    const escalacaoCriada = {
      id: "1",
      usuarioId: "10",
      nome: "Meu time principal"
    };

    escalacaoServiceMock.create.mockResolvedValue(escalacaoCriada);

    const response = await request(app)
      .post("/escalacoes")
      .send(novaEscalacao);

    expect(response.status).toBe(201);

    expect(response.body).toEqual({
      mensagem: "Escalação criada com sucesso!",
      escalacao: escalacaoCriada
    });

    expect(escalacaoServiceMock.create).toHaveBeenCalledWith(
      novaEscalacao
    );

  });

  // PUT /escalacoes/:id
  test("Deve atualizar uma escalação existente", async () => {

    const dadosAtualizados = {
      nome: "Meu time atualizado"
    };

    const escalacaoAtualizada = {
      id: "1",
      usuarioId: "10",
      nome: "Meu time atualizado"
    };

    escalacaoServiceMock.update.mockResolvedValue(escalacaoAtualizada);

    const response = await request(app)
      .put("/escalacoes/1")
      .send(dadosAtualizados);

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      mensagem: "Escalação atualizada com sucesso!",
      escalacao: escalacaoAtualizada
    });

    expect(escalacaoServiceMock.update).toHaveBeenCalledWith(
      "1",
      dadosAtualizados
    );

  });

  // PATCH /escalacoes/:id/finalizar
  test("Deve finalizar uma escalação", async () => {

    const escalacaoFinalizada = {
      id: "1",
      usuarioId: "10",
      nome: "Meu time principal",
      finalizada: true
    };

    escalacaoServiceMock.finalizar.mockResolvedValue(
      escalacaoFinalizada
    );

    const response = await request(app)
      .patch("/escalacoes/1/finalizar");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      mensagem: "Escalação finalizada com sucesso!",
      escalacao: escalacaoFinalizada
    });

    expect(escalacaoServiceMock.finalizar).toHaveBeenCalledWith("1");

  });

  // DELETE /escalacoes/:id
  test("Deve excluir uma escalação existente", async () => {

    escalacaoServiceMock.delete.mockResolvedValue(undefined);

    const response = await request(app)
      .delete("/escalacoes/1");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      mensagem: "Escalação excluída com sucesso!"
    });

    expect(escalacaoServiceMock.delete).toHaveBeenCalledWith("1");

  });

});
