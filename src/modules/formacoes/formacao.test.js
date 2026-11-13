
import { jest, describe, test, expect, beforeEach } from "@jest/globals";
import express from "express";
import request from "supertest";

// Mock do Service
const formacaoServiceMock = {
  getAll: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
};

// Substitui o Service real pelo mock
jest.unstable_mockModule("./formacao.service.js", () => ({
  default: formacaoServiceMock
}));

// Importa as rotas após configurar o mock
const { default: formacaoRoutes } = await import("./formacao.routes.js");

// Criação da aplicação Express para os testes
const app = express();

app.use(express.json());
app.use("/formacoes", formacaoRoutes);

// Middleware para tratamento de erros
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    mensagem: error.message
  });
});

describe("Testes do módulo Formação", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // GET /formacoes
  test("Deve listar todas as formações", async () => {

    const formacoes = [
      { id: "1", nome: "4-3-3" },
      { id: "2", nome: "4-4-2" },
      { id: "3", nome: "3-5-2" }
    ];

    formacaoServiceMock.getAll.mockResolvedValue(formacoes);

    const response = await request(app)
      .get("/formacoes");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(formacoes);
    expect(formacaoServiceMock.getAll).toHaveBeenCalledTimes(1);

  });

  // GET /formacoes/:id
  test("Deve buscar uma formação pelo ID", async () => {

    const formacao = {
      id: "1",
      nome: "4-3-3"
    };

    formacaoServiceMock.getById.mockResolvedValue(formacao);

    const response = await request(app)
      .get("/formacoes/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(formacao);
    expect(formacaoServiceMock.getById).toHaveBeenCalledWith("1");

  });

  // POST /formacoes
  test("Deve cadastrar uma nova formação com suas posições", async () => {

    const novaFormacao = {
      nome: "4-3-3",
      posicoes: [
        { posicaoId: "1" },
        { posicaoId: "2" },
        { posicaoId: "3" }
      ]
    };

    const formacaoCriada = {
      id: "1",
      nome: "4-3-3",
      posicoes: [
        { posicaoId: "1" },
        { posicaoId: "2" },
        { posicaoId: "3" }
      ]
    };

    formacaoServiceMock.create.mockResolvedValue(formacaoCriada);

    const response = await request(app)
      .post("/formacoes")
      .send(novaFormacao);

    expect(response.status).toBe(201);

    expect(response.body).toEqual({
      mensagem: "Formação cadastrada com sucesso!",
      formacao: formacaoCriada
    });

    expect(formacaoServiceMock.create).toHaveBeenCalledWith(novaFormacao);

  });

  // PUT /formacoes/:id
  test("Deve atualizar uma formação e suas posições", async () => {

    const dadosAtualizados = {
      nome: "4-2-3-1",
      posicoes: [
        { posicaoId: "1" },
        { posicaoId: "2" },
        { posicaoId: "3" }
      ]
    };

    const formacaoAtualizada = {
      id: "1",
      nome: "4-2-3-1",
      posicoes: [
        { posicaoId: "1" },
        { posicaoId: "2" },
        { posicaoId: "3" }
      ]
    };

    formacaoServiceMock.update.mockResolvedValue(formacaoAtualizada);

    const response = await request(app)
      .put("/formacoes/1")
      .send(dadosAtualizados);

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      mensagem: "Formação atualizada com sucesso!",
      formacao: formacaoAtualizada
    });

    expect(formacaoServiceMock.update).toHaveBeenCalledWith(
      "1",
      dadosAtualizados
    );

  });

  // DELETE /formacoes/:id
  test("Deve excluir uma formação existente", async () => {

    formacaoServiceMock.delete.mockResolvedValue(undefined);

    const response = await request(app)
      .delete("/formacoes/1");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      mensagem: "Formação excluída com sucesso!"
    });

    expect(formacaoServiceMock.delete).toHaveBeenCalledWith("1");

  });

});
