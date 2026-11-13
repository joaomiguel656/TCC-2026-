
import { jest, describe, test, expect, beforeEach } from "@jest/globals";
import express from "express";
import request from "supertest";

// Mock do service
const authServiceMock = {
  register: jest.fn(),
  login: jest.fn(),
  me: jest.fn()
};

// Substitui o service original pelo mock
jest.unstable_mockModule("./auth.service.js", () => ({
  default: authServiceMock
}));

// Importa as rotas depois do mock
const { default: authRoutes } = await import("./auth.routes.js");

// Importa o controller
const { default: authController } = await import("./auth.controller.js");

// Configuração do Express
const app = express();

app.use(express.json());

// Rotas de autenticação
app.use("/auth", authRoutes);

// Rota auxiliar para testar o método me
app.get("/auth/me", (req, res, next) => {
  req.usuario = { id: "1" };

  authController.me(req, res, next);
});

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    mensagem: error.message
  });
});

describe("Testes das rotas de Auth", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // POST /auth/register
  test("Deve registrar um usuário", async () => {
    const dados = {
      nome: "João",
      email: "joao@email.com",
      senha: "123456"
    };

    const resultado = {
      id: "1",
      nome: "João",
      email: "joao@email.com"
    };

    authServiceMock.register.mockResolvedValue(resultado);

    const response = await request(app)
      .post("/auth/register")
      .send(dados);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(resultado);
    expect(authServiceMock.register).toHaveBeenCalledWith(dados);
  });

  // POST /auth/login
  test("Deve realizar login de um usuário", async () => {
    const dados = {
      email: "joao@email.com",
      senha: "123456"
    };

    const resultado = {
      token: "token-ficticio",
      usuario: {
        id: "1",
        email: "joao@email.com"
      }
    };

    authServiceMock.login.mockResolvedValue(resultado);

    const response = await request(app)
      .post("/auth/login")
      .send(dados);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(resultado);
    expect(authServiceMock.login).toHaveBeenCalledWith(dados);
  });

  // GET /auth/me
  test("Deve retornar os dados do usuário autenticado", async () => {
    const usuario = {
      id: "1",
      nome: "João",
      email: "joao@email.com"
    };

    authServiceMock.me.mockResolvedValue(usuario);

    const response = await request(app)
      .get("/auth/me");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ usuario });
    expect(authServiceMock.me).toHaveBeenCalledWith("1");
  });

});
