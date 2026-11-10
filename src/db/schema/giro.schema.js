
import { escalacao } from "./escalacao.schema.js";
import { time } from "./time.schema.js";

import {
  pgTable,
  uuid,
  integer,
  boolean,
  foreignKey,
  unique
} from "drizzle-orm/pg-core";

export const giro = pgTable(
  "giro",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    escalacaoId: uuid("escalacao_id").notNull(),

    timeId: uuid("time_id").notNull(),

    numero: integer("numero").notNull(),

    eRegiro: boolean("e_regiro").notNull().default(false)
  },
  (table) => [
    unique("giro_escalacao_numero_unique").on(
      table.escalacaoId,
      table.numero
    ),

    foreignKey({
      columns: [table.escalacaoId],
      foreignColumns: [escalacao.id],
      name: "giro_escalacao_fk"
    }),

    foreignKey({
      columns: [table.timeId],
      foreignColumns: [time.id],
      name: "giro_time_fk"
    })
  ]
);
