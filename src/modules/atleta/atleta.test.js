
import { jest, describe, test, expect, beforeEach } from "@jest/globals";
import express from "express";
import request from "supertest";

// Mock do service
const atletaServiceMock = {
  getAll: jest.fn(),
  getById: jest.fn(),
  getByTime: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
};

// Substitui o service original pelo mock
jest.unstable_mockModule("./atleta.service.js", () => ({
  default: atletaServiceMock
}));

// Importa as rotas depois do mock
const { default: atletaRoutes } = await import("./atleta.routes.js");

// Configuração do Express
const app = express();

app.use(express.json());

app.use("/atletas", atletaRoutes);

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    mensagem: error.message
  });
});

describe("Testes das rotas de Atleta", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // GET /atletas
  test("Deve listar todos os atletas", async () => {
    const atletas = [
      { id: "1", nome: "Atleta 1", timeId: "10" },
      { id: "2", nome: "Atleta 2", timeId: "10" }
    ];

    atletaServiceMock.getAll.mockResolvedValue(atletas);

    const response = await request(app)
      .get("/atletas");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(atletas);
    expect(atletaServiceMock.getAll).toHaveBeenCalled();
  });

  // GET /atletas/time/:timeId
  test("Deve listar os atletas de um time", async () => {
    const atletas = [
      { id: "1", nome: "Atleta 1", timeId: "10" },
      { id: "2", nome: "Atleta 2", timeId: "10" }
    ];

    atletaServiceMock.getByTime.mockResolvedValue(atletas);

    const response = await request(app)
      .get("/atletas/time/10");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(atletas);
    expect(atletaServiceMock.getByTime).toHaveBeenCalledWith("10");
  });

  // GET /atletas/:id
  test("Deve buscar um atleta pelo ID", async () => {
    const atleta = {
      id: "1",
      nome: "Atleta 1",
      timeId: "10"
    };

    atletaServiceMock.getById.mockResolvedValue(atleta);

    const response = await request(app)
      .get("/atletas/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(atleta);
    expect(atletaServiceMock.getById).toHaveBeenCalledWith("1");
  });

  // POST /atletas
  test("Deve cadastrar um atleta", async () => {
    const dados = {
      nome: "Atleta 1",
      timeId: "10"
    };

    const novoAtleta = {
      id: "1",
      ...dados
    };

    atletaServiceMock.create.mockResolvedValue(novoAtleta);

    const response = await request(app)
      .post("/atletas")
      .send(dados);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      mensagem: "Atleta cadastrado com sucesso!",
      atleta: novoAtleta
    });

    expect(atletaServiceMock.create).toHaveBeenCalledWith(dados);
  });

  // PUT /atletas/:id
  test("Deve atualizar um atleta", async () => {
    const dados = {
      nome: "Atleta Atualizado"
    };

    const atletaAtualizado = {
      id: "1",
      nome: "Atleta Atualizado",
      timeId: "10"
    };

    atletaServiceMock.update.mockResolvedValue(atletaAtualizado);

    const response = await request(app)
      .put("/atletas/1")
      .send(dados);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      mensagem: "Atleta atualizado com sucesso!",
      atleta: atletaAtualizado
    });

    expect(atletaServiceMock.update)
      .toHaveBeenCalledWith("1", dados);
  });

  // DELETE /atletas/:id
  test("Deve excluir um atleta", async () => {
    atletaServiceMock.delete.mockResolvedValue(undefined);

    const response = await request(app)
      .delete("/atletas/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      mensagem: "Atleta excluído com sucesso!"
    });

    expect(atletaServiceMock.delete).toHaveBeenCalledWith("1");
  });

});
