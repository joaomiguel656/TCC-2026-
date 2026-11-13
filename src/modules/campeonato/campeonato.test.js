
import { jest, describe, test, expect, beforeEach } from "@jest/globals";
import express from "express";
import request from "supertest";

// Mock do service
const campeonatoServiceMock = {
  getAll: jest.fn(),
  getById: jest.fn(),
  getParticipantes: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  adicionarParticipante: jest.fn(),
  removerParticipante: jest.fn(),
  delete: jest.fn()
};

// Substitui o service original pelo mock
jest.unstable_mockModule("./campeonato.service.js", () => ({
  default: campeonatoServiceMock
}));

// Importa as rotas depois do mock
const { default: campeonatoRoutes } =
  await import("./campeonato.routes.js");

// Configuração do Express para os testes
const app = express();

app.use(express.json());

app.use("/campeonatos", campeonatoRoutes);

// Middleware para tratamento de erros
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    mensagem: error.message
  });
});

describe("Testes das rotas de Campeonato", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // GET /campeonatos
  test("Deve listar todos os campeonatos", async () => {
    const campeonatos = [
      { id: "1", nome: "Campeonato Brasileiro" },
      { id: "2", nome: "Copa do Brasil" }
    ];

    campeonatoServiceMock.getAll.mockResolvedValue(campeonatos);

    const response = await request(app)
      .get("/campeonatos");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(campeonatos);
    expect(campeonatoServiceMock.getAll).toHaveBeenCalled();
  });

  // GET /campeonatos/:campeonatoId/participantes
  test("Deve listar os participantes de um campeonato", async () => {
    const participantes = [
      { id: "1", campeonatoId: "10", escalacaoId: "20" },
      { id: "2", campeonatoId: "10", escalacaoId: "21" }
    ];

    campeonatoServiceMock.getParticipantes.mockResolvedValue(participantes);

    const response = await request(app)
      .get("/campeonatos/10/participantes");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(participantes);
    expect(campeonatoServiceMock.getParticipantes)
      .toHaveBeenCalledWith("10");
  });

  // GET /campeonatos/:id
  test("Deve buscar um campeonato pelo ID", async () => {
    const campeonato = {
      id: "1",
      nome: "Campeonato Brasileiro"
    };

    campeonatoServiceMock.getById.mockResolvedValue(campeonato);

    const response = await request(app)
      .get("/campeonatos/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(campeonato);
    expect(campeonatoServiceMock.getById).toHaveBeenCalledWith("1");
  });

  // POST /campeonatos
  test("Deve criar um campeonato", async () => {
    const dados = {
      nome: "Campeonato Brasileiro"
    };

    const novoCampeonato = {
      id: "1",
      ...dados
    };

    campeonatoServiceMock.create.mockResolvedValue(novoCampeonato);

    const response = await request(app)
      .post("/campeonatos")
      .send(dados);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      mensagem: "Campeonato criado com sucesso!",
      campeonato: novoCampeonato
    });

    expect(campeonatoServiceMock.create).toHaveBeenCalledWith(dados);
  });

  // POST /campeonatos/participantes
  test("Deve inscrever um participante no campeonato", async () => {
    const dados = {
      campeonatoId: "10",
      escalacaoId: "20"
    };

    const participante = {
      id: "1",
      ...dados
    };

    campeonatoServiceMock.adicionarParticipante.mockResolvedValue(participante);

    const response = await request(app)
      .post("/campeonatos/participantes")
      .send(dados);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      mensagem: "Participante inscrito com sucesso!",
      participante
    });

    expect(campeonatoServiceMock.adicionarParticipante)
      .toHaveBeenCalledWith(dados);
  });

  // PUT /campeonatos/:id
  test("Deve atualizar um campeonato", async () => {
    const dados = {
      nome: "Campeonato Brasileiro Atualizado"
    };

    const campeonatoAtualizado = {
      id: "1",
      ...dados
    };

    campeonatoServiceMock.update.mockResolvedValue(campeonatoAtualizado);

    const response = await request(app)
      .put("/campeonatos/1")
      .send(dados);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      mensagem: "Campeonato atualizado com sucesso!",
      campeonato: campeonatoAtualizado
    });

    expect(campeonatoServiceMock.update)
      .toHaveBeenCalledWith("1", dados);
  });

  // DELETE /campeonatos/participantes/:id
  test("Deve remover um participante do campeonato", async () => {
    campeonatoServiceMock.removerParticipante.mockResolvedValue(undefined);

    const response = await request(app)
      .delete("/campeonatos/participantes/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      mensagem: "Participante removido com sucesso!"
    });

    expect(campeonatoServiceMock.removerParticipante)
      .toHaveBeenCalledWith("1");
  });

  // DELETE /campeonatos/:id
  test("Deve excluir um campeonato", async () => {
    campeonatoServiceMock.delete.mockResolvedValue(undefined);

    const response = await request(app)
      .delete("/campeonatos/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      mensagem: "Campeonato excluído com sucesso!"
    });

    expect(campeonatoServiceMock.delete)
      .toHaveBeenCalledWith("1");
  });

});
