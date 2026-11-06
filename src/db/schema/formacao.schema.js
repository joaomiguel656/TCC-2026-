
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
  
  export const formacao = pgTable("formacao", {
    id: uuid("id").defaultRandom().primaryKey(),
  
    nome: varchar("nome", { length: 20 })
      .notNull()
      .unique()
  });
  
  export const formacaoPosicao = pgTable(
    "formacao_posicao",
    {
      id: uuid("id").defaultRandom().primaryKey(),
  
      formacaoId: uuid("formacao_id").notNull(),
  
      posicaoId: uuid("posicao_id").notNull(),
  
      quantidade: integer("quantidade").notNull()
    },
    (table) => [
      unique("formacao_posicao_unique").on(
        table.formacaoId,
        table.posicaoId
      ),
  
      foreignKey({
        columns: [table.formacaoId],
        foreignColumns: [formacao.id],
        name: "formacao_posicao_formacao_fk"
      }),
  
      foreignKey({
        columns: [table.posicaoId],
        foreignColumns: [posicao.id],
        name: "formacao_posicao_posicao_fk"
      }),
  
      check(
        "formacao_posicao_quantidade_check",
        sql`${table.quantidade} > 0`
      )
    ]
  );
  