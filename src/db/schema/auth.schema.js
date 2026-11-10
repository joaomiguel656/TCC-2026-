const { z } = require('zod');

const registerSchema = z.object({
  nome: z.string().trim().min(2, 'O nome deve ter ao menos 2 caracteres').max(100),
  email: z.string().trim().toLowerCase().email('E-mail inválido'),
  senha: z
    .string()
    .min(8, 'A senha deve ter ao menos 8 caracteres')
    .max(72, 'A senha deve ter no máximo 72 caracteres'),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('E-mail inválido'),
  senha: z.string().min(1, 'Informe a senha'),
});

module.exports = { registerSchema, loginSchema };