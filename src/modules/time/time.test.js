
import { jest, describe, test, expect, beforeEach } from "@jest/globals";
import express from "express";
import request from "supertest";

// Mock do Service
const timeServiceMock = {
  getAll: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
};

// Substitui o Service real pelo mock
jest.unstable_mockModule("./time.service.js", () => ({
  default: timeServiceMock
}));

// Importa as rotas após configurar o mock
const { default: timeRoutes } = await import("./time.routes.js");

// Criação da aplicação Express para os testes
const app = express();

app.use(express.json());
app.use("/times", timeRoutes);

// Middleware para tratar erros durante os testes
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    mensagem: error.message
  });
});

describe("Testes do módulo Time", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // GET /times
  test("Deve listar todos os times", async () => {

    const times = [
      { id: "1", nome: "Palmeiras" },
      { id: "2", nome: "Flamengo" }
    ];

    timeServiceMock.getAll.mockResolvedValue(times);

    const response = await request(app)
      .get("/times");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(times);
    expect(timeServiceMock.getAll).toHaveBeenCalledTimes(1);

  });

  // GET /times/:id
  test("Deve buscar um time pelo ID", async () => {

    const time = {
      id: "1",
      nome: "Palmeiras"
    };

    timeServiceMock.getById.mockResolvedValue(time);

    const response = await request(app)
      .get("/times/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(time);
    expect(timeServiceMock.getById).toHaveBeenCalledWith("1");

  });

  // POST /times
  test("Deve cadastrar um novo time", async () => {

    const novoTime = {
      nome: "Palmeiras"
    };

    const timeCriado = {
      id: "1",
      nome: "Palmeiras"
    };

    timeServiceMock.create.mockResolvedValue(timeCriado);

    const response = await request(app)
      .post("/times")
      .send(novoTime);

    expect(response.status).toBe(201);

    expect(response.body).toEqual({
      mensagem: "Time cadastrado com sucesso!",
      time: timeCriado
    });

    expect(timeServiceMock.create).toHaveBeenCalledWith(novoTime);

  });

  // PUT /times/:id
  test("Deve atualizar um time existente", async () => {

    const dadosAtualizados = {
      nome: "Palmeiras Atualizado"
    };

    const timeAtualizado = {
      id: "1",
      nome: "Palmeiras Atualizado"
    };

    timeServiceMock.update.mockResolvedValue(timeAtualizado);

    const response = await request(app)
      .put("/times/1")
      .send(dadosAtualizados);

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      mensagem: "Time atualizado com sucesso!",
      time: timeAtualizado
    });

    expect(timeServiceMock.update).toHaveBeenCalledWith(
      "1",
      dadosAtualizados
    );

  });

  // DELETE /times/:id
  test("Deve excluir um time existente", async () => {

    timeServiceMock.delete.mockResolvedValue(undefined);

    const response = await request(app)
      .delete("/times/1");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      mensagem: "Time excluído com sucesso!"
    });

    expect(timeServiceMock.delete).toHaveBeenCalledWith("1");

  });

});
