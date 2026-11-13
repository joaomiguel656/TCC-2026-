
import { jest, describe, test, expect, beforeEach } from "@jest/globals";
import express from "express";
import request from "supertest";

// Mock do Service
const giroServiceMock = {
  getAll: jest.fn(),
  getById: jest.fn(),
  getByEscalacao: jest.fn(),
  create: jest.fn()
};

// Substitui o Service real pelo mock
jest.unstable_mockModule("./giro.service.js", () => ({
  default: giroServiceMock
}));

// Importa as rotas após configurar o mock
const { default: giroRoutes } = await import("./giro.routes.js");

// Criação da aplicação Express para os testes
const app = express();

app.use(express.json());
app.use("/giros", giroRoutes);

// Middleware para tratamento de erros
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    mensagem: error.message
  });
});

describe("Testes do módulo Giro", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // GET /giros
  test("Deve listar todos os giros", async () => {

    const giros = [
      { id: "1", escalacaoId: "10", atletaId: "100" },
      { id: "2", escalacaoId: "10", atletaId: "101" }
    ];

    giroServiceMock.getAll.mockResolvedValue(giros);

    const response = await request(app)
      .get("/giros");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(giros);
    expect(giroServiceMock.getAll).toHaveBeenCalledTimes(1);

  });

  // GET /giros/:id
  test("Deve buscar um giro pelo ID", async () => {

    const giro = {
      id: "1",
      escalacaoId: "10",
      atletaId: "100"
    };

    giroServiceMock.getById.mockResolvedValue(giro);

    const response = await request(app)
      .get("/giros/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(giro);
    expect(giroServiceMock.getById).toHaveBeenCalledWith("1");

  });

  // GET /giros/escalacao/:escalacaoId
  test("Deve listar os giros de uma escalação", async () => {

    const escalacaoId = "10";

    const giros = [
      { id: "1", escalacaoId: "10", atletaId: "100" },
      { id: "2", escalacaoId: "10", atletaId: "101" }
    ];

    giroServiceMock.getByEscalacao.mockResolvedValue(giros);

    const response = await request(app)
      .get("/giros/escalacao/10");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(giros);

    expect(giroServiceMock.getByEscalacao).toHaveBeenCalledWith(
      escalacaoId
    );

  });

  // POST /giros
  test("Deve registrar um novo giro", async () => {

    const novoGiro = {
      escalacaoId: "10",
      atletaId: "100"
    };

    const giroCriado = {
      id: "1",
      escalacaoId: "10",
      atletaId: "100"
    };

    giroServiceMock.create.mockResolvedValue(giroCriado);

    const response = await request(app)
      .post("/giros")
      .send(novoGiro);

    expect(response.status).toBe(201);

    expect(response.body).toEqual({
      mensagem: "Giro registrado com sucesso!",
      giro: giroCriado
    });

    expect(giroServiceMock.create).toHaveBeenCalledWith(novoGiro);

  });

});
