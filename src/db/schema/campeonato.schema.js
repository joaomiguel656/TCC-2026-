
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
  import { escalacao } from "./escalacao.schema.js";
  
  export const campeonatoStatusEnum = pgEnum(
    "campeonato_status",
    ["AGUARDANDO", "EM_ANDAMENTO", "FINALIZADO"]
  );
  
  export const campeonato = pgTable("campeonato", {
    id: uuid("id").defaultRandom().primaryKey(),
  
    nome: varchar("nome", { length: 100 }).notNull(),
  
    status: campeonatoStatusEnum("status")
      .default("AGUARDANDO")
      .notNull(),
  
    dataCriacao: timestamp("data_criacao", {
      withTimezone: true
    }).defaultNow().notNull()
  });
  
  export const campeonatoParticipante = pgTable(
    "campeonato_participante",
    {
      id: uuid("id").defaultRandom().primaryKey(),
  
      campeonatoId: uuid("campeonato_id").notNull(),
  
      usuarioId: uuid("usuario_id").notNull(),
  
      escalacaoId: uuid("escalacao_id").notNull()
    },
    (table) => [
      unique("campeonato_usuario_unique").on(
        table.campeonatoId,
        table.usuarioId
      ),
  
      unique("campeonato_escalacao_unique").on(
        table.campeonatoId,
        table.escalacaoId
      ),
  
      foreignKey({
        columns: [table.campeonatoId],
        foreignColumns: [campeonato.id],
        name: "campeonato_participante_campeonato_fk"
      }),
  
      foreignKey({
        columns: [table.usuarioId],
        foreignColumns: [usuario.id],
        name: "campeonato_participante_usuario_fk"
      }),
  
      foreignKey({
        columns: [table.escalacaoId],
        foreignColumns: [escalacao.id],
        name: "campeonato_participante_escalacao_fk"
      })
    ]
  );
  