
import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  foreignKey,
  pgEnum
} from "drizzle-orm/pg-core";

import { usuario } from "./usuario.schema.js";
import { formacao } from "./formacao.schema.js";

export const escalacaoStatusEnum = pgEnum(
  "escalacao_status",
  ["EM_ANDAMENTO", "FINALIZADA"]
);

export const escalacao = pgTable("escalacao", {
  id: uuid("id").defaultRandom().primaryKey(),

  usuarioId: uuid("usuario_id").notNull(),

  formacaoId: uuid("formacao_id").notNull(),

  nome: varchar("nome", { length: 100 }),

  status: escalacaoStatusEnum("status")
    .default("EM_ANDAMENTO")
    .notNull(),

  criadaEm: timestamp("criada_em", {
    withTimezone: true
  }).defaultNow().notNull()
}, (table) => [
  foreignKey({
    columns: [table.usuarioId],
    foreignColumns: [usuario.id],
    name: "escalacao_usuario_fk"
  }),

  foreignKey({
    columns: [table.formacaoId],
    foreignColumns: [formacao.id],
    name: "escalacao_formacao_fk"
  })
]);
