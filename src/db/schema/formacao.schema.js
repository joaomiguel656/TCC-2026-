
import {
  pgTable,
  uuid,
  varchar,
  integer,
  unique,
  foreignKey,
  check
} from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";
import { posicao } from "./posicao.schema.js";

// Tabela principal de formações
export const formacao = pgTable("formacao", {
  id: uuid("id").defaultRandom().primaryKey(),

  nome: varchar("nome", { length: 20 })
    .notNull()
    .unique()
});

// Tabela que relaciona formações com posições
export const formacaoPosicao = pgTable(
  "formacao_posicao",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    formacaoId: uuid("formacao_id").notNull(),

    posicaoId: uuid("posicao_id").notNull(),

    quantidade: integer("quantidade").notNull()
  },
  (table) => [
    // Impede repetir a mesma posição na mesma formação
    unique("formacao_posicao_unique").on(
      table.formacaoId,
      table.posicaoId
    ),

    // Relacionamento com a tabela de formações
    foreignKey({
      columns: [table.formacaoId],
      foreignColumns: [formacao.id],
      name: "formacao_posicao_formacao_fk"
    }),

    // Relacionamento com a tabela de posições
    foreignKey({
      columns: [table.posicaoId],
      foreignColumns: [posicao.id],
      name: "formacao_posicao_posicao_fk"
    }),

    // Cada posição pode possuir no mínimo 1 e no máximo 2 vagas
    check(
      "formacao_posicao_quantidade_check",
      sql`${table.quantidade} BETWEEN 1 AND 2`
    )
  ]
);
