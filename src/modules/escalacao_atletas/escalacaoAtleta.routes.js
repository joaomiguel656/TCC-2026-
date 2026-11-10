
import { Router } from "express";

import escalacaoAtletaController from "./escalacaoAtleta.controller.js";

const router = Router();

// Listar todos os registros
router.get("/", (req, res, next) =>
  escalacaoAtletaController.getAll(req, res, next)
);

// Listar atletas de uma escalação
router.get("/escalacao/:escalacaoId", (req, res, next) =>
  escalacaoAtletaController.getByEscalacao(req, res, next)
);

// Buscar registro pelo ID
router.get("/:id", (req, res, next) =>
  escalacaoAtletaController.getById(req, res, next)
);

// Adicionar atleta à escalação
router.post("/", (req, res, next) =>
  escalacaoAtletaController.create(req, res, next)
);

// Remover atleta da escalação
router.delete("/:id", (req, res, next) =>
  escalacaoAtletaController.delete(req, res, next)
);

export default router;
