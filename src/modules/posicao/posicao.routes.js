
import { Router } from "express";

import posicaoController from "./posicao.controller.js";

const router = Router();

// Listar todas as posições
router.get("/", (req, res, next) =>
  posicaoController.getAll(req, res, next)
);

// Buscar posição pelo ID
router.get("/:id", (req, res, next) =>
  posicaoController.getById(req, res, next)
);

// Cadastrar posição
router.post("/", (req, res, next) =>
  posicaoController.create(req, res, next)
);

// Atualizar posição
router.put("/:id", (req, res, next) =>
  posicaoController.update(req, res, next)
);

// Excluir posição
router.delete("/:id", (req, res, next) =>
  posicaoController.delete(req, res, next)
);

export default router;
