import { Router } from "express";

import giroController from "./giro.controller.js";

const router = Router();

// Listar todos os giros
router.get("/", (req, res, next) =>
  giroController.getAll(req, res, next)
);

// Buscar um giro pelo ID
router.get("/:id", (req, res, next) =>
  giroController.getById(req, res, next)
);

// Listar os giros de uma escalação
router.get("/escalacao/:escalacaoId", (req, res, next) =>
  giroController.getByEscalacao(req, res, next)
);

// Criar um novo giro
router.post("/", (req, res, next) =>
  giroController.create(req, res, next)
);

export default router;