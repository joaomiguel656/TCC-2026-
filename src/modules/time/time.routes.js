
import { Router } from "express";
import timeController from "./time.controller.js";

const router = Router();

// Listar todos os times
router.get("/", (req, res, next) =>
  timeController.getAll(req, res, next)
);

// Buscar time pelo ID
router.get("/:id", (req, res, next) =>
  timeController.getById(req, res, next)
);

// Cadastrar novo time
router.post("/", (req, res, next) =>
  timeController.create(req, res, next)
);

// Atualizar time
router.put("/:id", (req, res, next) =>
  timeController.update(req, res, next)
);

// Excluir time
router.delete("/:id", (req, res, next) =>
  timeController.delete(req, res, next)
);

export default router;
