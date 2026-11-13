
import { jest, describe, test, expect, beforeEach } from "@jest/globals";
import express from "express";
import request from "supertest";

// Mock do service
const escalacaoAtletaServiceMock = {
  getAll: jest.fn(),
  getById: jest.fn(),
  getByEscalacao: jest.fn(),
  create: jest.fn()
};

// Substitui o service original pelo mock
jest.unstable_mockModule("./escalacaoAtleta.service.js", () => ({
  default: escalacaoAtletaServiceMock
}));

// Importa as rotas depois do mock
const { default: escalacaoAtletaRoutes } =
  await import("./escalacaoAtleta.routes.js");

// Configuração do Express para os testes
const app = express();

app.use(express.json());

app.use("/escalacao-atletas", escalacaoAtletaRoutes);

// Middleware para tratamento de erros
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    mensagem: error.message
  });
});

describe("Testes das rotas de EscalaçãoAtleta", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // GET /escalacao-atletas
  test("Deve listar todos os registros", async () => {
    const registros = [
      { id: "1", escalacaoId: "10", atletaId: "20" },
      { id: "2", escalacaoId: "10", atletaId: "21" }
    ];

    escalacaoAtletaServiceMock.getAll.mockResolvedValue(registros);

    const response = await request(app)
      .get("/escalacao-atletas");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(registros);
    expect(escalacaoAtletaServiceMock.getAll).toHaveBeenCalled();
  });

  // GET /escalacao-atletas/:id
  test("Deve buscar um registro pelo ID", async () => {
    const registro = {
      id: "1",
      escalacaoId: "10",
      atletaId: "20"
    };

    escalacaoAtletaServiceMock.getById.mockResolvedValue(registro);

    const response = await request(app)
      .get("/escalacao-atletas/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(registro);
    expect(escalacaoAtletaServiceMock.getById).toHaveBeenCalledWith("1");
  });

  // GET /escalacao-atletas/escalacao/:escalacaoId
  test("Deve listar os atletas de uma escalação", async () => {
    const registros = [
      { id: "1", escalacaoId: "10", atletaId: "20" },
      { id: "2", escalacaoId: "10", atletaId: "21" }
    ];

    escalacaoAtletaServiceMock.getByEscalacao.mockResolvedValue(registros);

    const response = await request(app)
      .get("/escalacao-atletas/escalacao/10");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(registros);
    expect(escalacaoAtletaServiceMock.getByEscalacao)
      .toHaveBeenCalledWith("10");
  });

  // POST /escalacao-atletas
  test("Deve adicionar um atleta à escalação", async () => {
    const novoRegistro = {
      id: "3",
      escalacaoId: "10",
      atletaId: "22"
    };

    const dados = {
      escalacaoId: "10",
      atletaId: "22"
    };

    escalacaoAtletaServiceMock.create.mockResolvedValue(novoRegistro);

    const response = await request(app)
      .post("/escalacao-atletas")
      .send(dados);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      mensagem: "Atleta adicionado à escalação com sucesso!",
      registro: novoRegistro
    });

    expect(escalacaoAtletaServiceMock.create).toHaveBeenCalledWith(dados);
  });

});
