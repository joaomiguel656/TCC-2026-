
import { Router } from "express";

import usuarioController from "./usuario.controller.js";

const router = Router();

// Listar todos os usuários
router.get("/", (req, res, next) =>
  usuarioController.getAll(req, res, next)
);

// Buscar usuário pelo ID
router.get("/:id", (req, res, next) =>
  usuarioController.getById(req, res, next)
);

// Cadastrar usuário
router.post("/", (req, res, next) =>
  usuarioController.create(req, res, next)
);

// Atualizar usuário
router.put("/:id", (req, res, next) =>
  usuarioController.update(req, res, next)
);

// Excluir usuário
router.delete("/:id", (req, res, next) =>
  usuarioController.delete(req, res, next)
);

export default router;
