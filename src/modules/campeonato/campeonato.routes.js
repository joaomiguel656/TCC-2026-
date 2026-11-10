
import { Router } from "express";

import campeonatoController from "./campeonato.controller.js";

const router = Router();

// Listar todos os campeonatos
router.get("/", (req, res, next) =>
  campeonatoController.getAll(req, res, next)
);

// Listar participantes de um campeonato
router.get("/:campeonatoId/participantes", (req, res, next) =>
  campeonatoController.getParticipantes(req, res, next)
);

// Buscar campeonato pelo ID
router.get("/:id", (req, res, next) =>
  campeonatoController.getById(req, res, next)
);

// Criar campeonato
router.post("/", (req, res, next) =>
  campeonatoController.create(req, res, next)
);

// Inscrever participante
router.post("/participantes", (req, res, next) =>
  campeonatoController.adicionarParticipante(req, res, next)
);

// Atualizar campeonato
router.put("/:id", (req, res, next) =>
  campeonatoController.update(req, res, next)
);

// Remover participante
router.delete("/participantes/:id", (req, res, next) =>
  campeonatoController.removerParticipante(req, res, next)
);

// Excluir campeonato
router.delete("/:id", (req, res, next) =>
  campeonatoController.delete(req, res, next)
);

export default router;
