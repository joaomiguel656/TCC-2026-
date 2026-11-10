
import { Router } from "express";

import escalacaoController from "./escalacao.controller.js";

const router = Router();

// Listar todas as escalações
router.get("/", (req, res, next) =>
  escalacaoController.getAll(req, res, next)
);

// Buscar escalações de um usuário
router.get("/usuario/:usuarioId", (req, res, next) =>
  escalacaoController.getByUsuario(req, res, next)
);

// Buscar escalação pelo ID
router.get("/:id", (req, res, next) =>
  escalacaoController.getById(req, res, next)
);

// Criar escalação
router.post("/", (req, res, next) =>
  escalacaoController.create(req, res, next)
);

// Atualizar escalação
router.put("/:id", (req, res, next) =>
  escalacaoController.update(req, res, next)
);

// Excluir escalação
router.delete("/:id", (req, res, next) =>
  escalacaoController.delete(req, res, next)
);

export default router;
