
import { Router } from "express";

import giroController from "./giro.controller.js";

const router = Router();

router.get("/", (req, res, next) =>
  giroController.getAll(req, res, next)
);

router.get("/:id", (req, res, next) =>
  giroController.getById(req, res, next)
);

router.get("/escalacao/:escalacaoId", (req, res, next) =>
  giroController.getByEscalacao(req, res, next)
);

router.post("/", (req, res, next) =>
  giroController.create(req, res, next)
);

router.delete("/:id", (req, res, next) =>
  giroController.delete(req, res, next)
);

export default router;
