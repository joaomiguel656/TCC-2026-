
import {
    pgTable,
    uuid,
    varchar,
  } from "drizzle-orm/pg-core";
  
  export const posicao = pgTable("posicao", {
    id: uuid("id").defaultRandom().primaryKey(),
  
    nome: varchar("nome", { length: 50 })
      .notNull()
      .unique()
  });
  