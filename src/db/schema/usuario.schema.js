
import {
    pgTable,
    uuid,
    varchar,
    timestamp
  } from "drizzle-orm/pg-core";
  
  export const usuario = pgTable("usuario", {
    id: uuid("id").defaultRandom().primaryKey(),
  
    nome: varchar("nome", { length: 100 }).notNull(),
  
    email: varchar("email", { length: 255 }).notNull().unique(),
  
    senha: varchar("senha", { length: 255 }).notNull(),
  
    criadoEm: timestamp("criado_em", {
      withTimezone: true
    }).defaultNow().notNull()
  });
  