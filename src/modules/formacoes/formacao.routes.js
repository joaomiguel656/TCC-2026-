
import { Router } from "express";

import formacaoController from "./formacao.controller.js";

const router = Router();

// Listar todas as formações
router.get("/", (req, res, next) =>
  formacaoController.getAll(req, res, next)
);

// Buscar formação pelo ID
router.get("/:id", (req, res, next) =>
  formacaoController.getById(req, res, next)
);

// Cadastrar formação com suas posições
router.post("/", (req, res, next) =>
  formacaoController.create(req, res, next)
);

// Atualizar formação e suas posições
router.put("/:id", (req, res, next) =>
  formacaoController.update(req, res, next)
);

// Excluir formação
router.delete("/:id", (req, res, next) =>
  formacaoController.delete(req, res, next)
);

export default router;
