
import {
    pgTable,
    uuid,
    varchar,
    integer,
    foreignKey,
    check
  } from "drizzle-orm/pg-core";
  
  import { sql } from "drizzle-orm";
  import { time } from "./time.schema.js";
  
  export const atleta = pgTable("atleta", {
    id: uuid("id").defaultRandom().primaryKey(),
  
    timeId: uuid("time_id").notNull(),
  
    nome: varchar("nome", { length: 100 }).notNull(),
  
    nota: integer("nota").notNull()
  }, (table) => [
    foreignKey({
      columns: [table.timeId],
      foreignColumns: [time.id],
      name: "atleta_time_fk"
    }),
  
    check(
      "atleta_nota_check",
      sql`${table.nota} BETWEEN 1 AND 99`
    )
  ]);
  