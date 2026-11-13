
import { jest, describe, test, expect, beforeEach } from "@jest/globals";
import express from "express";
import request from "supertest";

// Mock do Service
const posicaoServiceMock = {
  getAll: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
};

// Substitui o Service real pelo mock
jest.unstable_mockModule("./posicao.service.js", () => ({
  default: posicaoServiceMock
}));

// Importa as rotas após configurar o mock
const { default: posicaoRoutes } = await import("./posicao.routes.js");

// Criação da aplicação Express para os testes
const app = express();

app.use(express.json());
app.use("/posicoes", posicaoRoutes);

// Middleware para tratamento de erros
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    mensagem: error.message
  });
});

describe("Testes do módulo Posição", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // GET /posicoes
  test("Deve listar todas as posições", async () => {

    const posicoes = [
      { id: "1", nome: "Atacante" },
      { id: "2", nome: "Meio-campista" },
      { id: "3", nome: "Zagueiro" }
    ];

    posicaoServiceMock.getAll.mockResolvedValue(posicoes);

    const response = await request(app)
      .get("/posicoes");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(posicoes);
    expect(posicaoServiceMock.getAll).toHaveBeenCalledTimes(1);

  });

  // GET /posicoes/:id
  test("Deve buscar uma posição pelo ID", async () => {

    const posicao = {
      id: "1",
      nome: "Atacante"
    };

    posicaoServiceMock.getById.mockResolvedValue(posicao);

    const response = await request(app)
      .get("/posicoes/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(posicao);
    expect(posicaoServiceMock.getById).toHaveBeenCalledWith("1");

  });

  // POST /posicoes
  test("Deve cadastrar uma nova posição", async () => {

    const novaPosicao = {
      nome: "Atacante"
    };

    const posicaoCriada = {
      id: "1",
      nome: "Atacante"
    };

    posicaoServiceMock.create.mockResolvedValue(posicaoCriada);

    const response = await request(app)
      .post("/posicoes")
      .send(novaPosicao);

    expect(response.status).toBe(201);

    expect(response.body).toEqual({
      mensagem: "Posição cadastrada com sucesso!",
      posicao: posicaoCriada
    });

    expect(posicaoServiceMock.create).toHaveBeenCalledWith(novaPosicao);

  });

  // PUT /posicoes/:id
  test("Deve atualizar uma posição existente", async () => {

    const dadosAtualizados = {
      nome: "Ponta-direita"
    };

    const posicaoAtualizada = {
      id: "1",
      nome: "Ponta-direita"
    };

    posicaoServiceMock.update.mockResolvedValue(posicaoAtualizada);

    const response = await request(app)
      .put("/posicoes/1")
      .send(dadosAtualizados);

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      mensagem: "Posição atualizada com sucesso!",
      posicao: posicaoAtualizada
    });

    expect(posicaoServiceMock.update).toHaveBeenCalledWith(
      "1",
      dadosAtualizados
    );

  });

  // DELETE /posicoes/:id
  test("Deve excluir uma posição existente", async () => {

    posicaoServiceMock.delete.mockResolvedValue(undefined);

    const response = await request(app)
      .delete("/posicoes/1");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      mensagem: "Posição excluída com sucesso!"
    });

    expect(posicaoServiceMock.delete).toHaveBeenCalledWith("1");

  });

});
