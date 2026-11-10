
import {
  pgTable,
  uuid,
  integer,
  unique,
  foreignKey,
  check
} from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";

import { escalacao } from "./escalacao.schema.js";
import { posicao } from "./posicao.schema.js";
import { giro } from "./giro.schema.js";

export const escalacaoAtleta = pgTable(
  "escalacao_atleta",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    escalacaoId: uuid("escalacao_id").notNull(),

    posicaoId: uuid("posicao_id").notNull(),

    giroId: uuid("giro_id").notNull(),

    numeroVaga: integer("numero_vaga").notNull()
  },
  (table) => [
    unique("escalacao_atleta_giro_unique").on(
      table.giroId
    ),

    unique("escalacao_atleta_vaga_unique").on(
      table.escalacaoId,
      table.posicaoId,
      table.numeroVaga
    ),

    check(
      "escalacao_atleta_numero_vaga_check",
      sql`${table.numeroVaga} BETWEEN 1 AND 2`
    ),

    foreignKey({
      columns: [table.escalacaoId],
      foreignColumns: [escalacao.id],
      name: "escalacao_atleta_escalacao_fk"
    }),

    foreignKey({
      columns: [table.posicaoId],
      foreignColumns: [posicao.id],
      name: "escalacao_atleta_posicao_fk"
    }),

    foreignKey({
      columns: [table.giroId],
      foreignColumns: [giro.id],
      name: "escalacao_atleta_giro_fk"
    })
  ]
);
