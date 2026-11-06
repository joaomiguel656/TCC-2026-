
import {
    pgTable,
    uuid,
    varchar,
    timestamp,
    unique,
    foreignKey,
    pgEnum
  } from "drizzle-orm/pg-core";
  
  import { usuario } from "./usuario.schema.js";
  import { formacao } from "./formacao.schema.js";
  import { posicao } from "./posicao.schema.js";
  
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
  
  export const escalacaoAtleta = pgTable(
    "escalacao_atleta",
    {
      id: uuid("id").defaultRandom().primaryKey(),
  
      escalacaoId: uuid("escalacao_id").notNull(),
  
      posicaoId: uuid("posicao_id").notNull(),
  
      giroId: uuid("giro_id").notNull()
    },
    (table) => [
      unique("escalacao_atleta_giro_unique").on(
        table.giroId
      ),
  
      unique("escalacao_atleta_posicao_unique").on(
        table.escalacaoId,
        table.posicaoId
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
      })
    ]
  );
  