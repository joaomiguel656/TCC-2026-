import { escalacao } from "./escalacao.schema.js";
import { time } from "./time.schema.js";

import {
  pgTable,
  uuid,
  integer,
  boolean,
  foreignKey,
  unique,
  check
} from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";

export const giro = pgTable(
  "giro",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    escalacaoId: uuid("escalacao_id").notNull(),

    timeId: uuid("time_id").notNull(),

    numero: integer("numero").notNull(),

    eRegiro: boolean("e_regiro").notNull().default(false),

    // Identifica o giro anterior quando houver um re-giro
    giroAnteriorId: uuid("giro_anterior_id")
  },
  (table) => [
    unique("giro_escalacao_numero_unique").on(
      table.escalacaoId,
      table.numero
    ),

    unique("giro_anterior_unique").on(table.giroAnteriorId),

    foreignKey({
      columns: [table.escalacaoId],
      foreignColumns: [escalacao.id],
      name: "giro_escalacao_fk"
    }),

    foreignKey({
      columns: [table.timeId],
      foreignColumns: [time.id],
      name: "giro_time_fk"
    }),

    // Relacionamento de um giro com seu giro anterior
    foreignKey({
      columns: [table.giroAnteriorId],
      foreignColumns: [table.id],
      name: "giro_anterior_fk"
    }),

    // Re-giro precisa ter um giro anterior
    check(
      "giro_regiro_check",
      sql`${table.eRegiro} = (${table.giroAnteriorId} IS NOT NULL)`
    )
  ]
);