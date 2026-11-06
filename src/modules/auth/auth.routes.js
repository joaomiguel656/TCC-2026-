const { Router } = require('express');
const validate = require('../../shared/middlewares/validate');
const controller = require('./auth.controller');
const { registerSchema, loginSchema } = require('../../db/schema/auth.schema');

const router = Router();

router.post('/register', validate(registerSchema), controller.register);
router.post('/login', validate(loginSchema), controller.login);

module.exports = router;