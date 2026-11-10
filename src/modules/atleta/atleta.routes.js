
import { Router } from "express";

import atletaController from "./atleta.controller.js";

const router = Router();

// Listar todos os atletas
router.get("/", (req, res, next) =>
  atletaController.getAll(req, res, next)
);

// Buscar atletas de determinado time
router.get("/time/:timeId", (req, res, next) =>
  atletaController.getByTime(req, res, next)
);

// Buscar atleta pelo ID
router.get("/:id", (req, res, next) =>
  atletaController.getById(req, res, next)
);

// Cadastrar atleta
router.post("/", (req, res, next) =>
  atletaController.create(req, res, next)
);

// Atualizar atleta
router.put("/:id", (req, res, next) =>
  atletaController.update(req, res, next)
);

// Excluir atleta
router.delete("/:id", (req, res, next) =>
  atletaController.delete(req, res, next)
);

export default router;
