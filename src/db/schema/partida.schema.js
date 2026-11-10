
import {
    pgTable,
    uuid,
    integer,
    timestamp,
    foreignKey,
    check,
    pgEnum
  } from "drizzle-orm/pg-core";
  
  import { sql } from "drizzle-orm";
  
  import { campeonato } from "./campeonato.schema.js";
  import { campeonatoParticipante } from "./campeonato.schema.js";
  
  export const partidaStatusEnum = pgEnum(
    "partida_status",
    ["AGUARDANDO", "FINALIZADA"]
  );
  
  export const partida = pgTable("partida", {
    id: uuid("id").defaultRandom().primaryKey(),
  
    campeonatoId: uuid("campeonato_id").notNull(),
  
    participanteAId: uuid("participante_a_id").notNull(),
  
    participanteBId: uuid("participante_b_id").notNull(),
  
    vencedorId: uuid("vencedor_id"),
  
    placarA: integer("placar_a"),
  
    placarB: integer("placar_b"),
  
    rodada: integer("rodada").notNull(),
  
    status: partidaStatusEnum("status")
      .default("AGUARDANDO")
      .notNull(),
  
    criadaEm: timestamp("criada_em", {
      withTimezone: true
    }).defaultNow().notNull()
  }, (table) => [
    foreignKey({
      columns: [table.campeonatoId],
      foreignColumns: [campeonato.id],
      name: "partida_campeonato_fk"
    }),
  
    foreignKey({
      columns: [table.participanteAId],
      foreignColumns: [campeonatoParticipante.id],
      name: "partida_participante_a_fk"
    }),
  
    foreignKey({
      columns: [table.participanteBId],
      foreignColumns: [campeonatoParticipante.id],
      name: "partida_participante_b_fk"
    }),
  
    foreignKey({
      columns: [table.vencedorId],
      foreignColumns: [campeonatoParticipante.id],
      name: "partida_vencedor_fk"
    }),
  
    check(
      "partida_participantes_diferentes",
      sql`${table.participanteAId} <> ${table.participanteBId}`
    ),
  
    check(
      "partida_placar_a_check",
      sql`${table.placarA} IS NULL OR ${table.placarA} >= 0`
    ),
  
    check(
      "partida_placar_b_check",
      sql`${table.placarB} IS NULL OR ${table.placarB} >= 0`
    ),
  
    check(
      "partida_rodada_check",
      sql`${table.rodada} > 0`
    )
  ]);
  