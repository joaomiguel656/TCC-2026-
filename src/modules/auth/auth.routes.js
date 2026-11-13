
import { Router } from "express";

import controller from "./auth.controller.js";

const router = Router();

// Registrar usuário
router.post("/register", controller.register);

// Realizar login
router.post("/login", controller.login);

export default router;
