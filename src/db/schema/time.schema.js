
import {
    pgTable,
    uuid,
    varchar,
    integer,
    unique
  } from "drizzle-orm/pg-core";
  
  export const time = pgTable("time", {
    id: uuid("id").defaultRandom().primaryKey(),
  
    nome: varchar("nome", { length: 100 }).notNull(),
  
    ano: integer("ano").notNull()
  }, (table) => [
    unique("time_nome_ano_unique").on(
      table.nome,
      table.ano
    )
  ]);
  