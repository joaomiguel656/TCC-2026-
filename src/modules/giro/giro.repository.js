
import { eq, and, count } from "drizzle-orm";

import { db } from "../../config/database.js";
import { giro } from "../../db/schema/giro.schema.js";

class GiroRepository {

  async findAll() {
    return await db.select().from(giro);
  }

  async findById(id) {
    const result = await db
      .select()
      .from(giro)
      .where(eq(giro.id, id));

    return result[0] || null;
  }

  async findByEscalacao(escalacaoId) {
    return await db
      .select()
      .from(giro)
      .where(eq(giro.escalacaoId, escalacaoId));
  }

  async findByEscalacaoENumero(escalacaoId, numero) {
    const result = await db
      .select()
      .from(giro)
      .where(
        and(
          eq(giro.escalacaoId, escalacaoId),
          eq(giro.numero, numero)
        )
      );

    return result[0] || null;
  }

  async countRegiros(escalacaoId) {
    const result = await db
      .select({ total: count() })
      .from(giro)
      .where(
        and(
          eq(giro.escalacaoId, escalacaoId),
          eq(giro.eRegiro, true)
        )
      );

    return Number(result[0].total);
  }

  async create(dados) {
    const result = await db
      .insert(giro)
      .values(dados)
      .returning();

    return result[0];
  }

  async delete(id) {
    const result = await db
      .delete(giro)
      .where(eq(giro.id, id))
      .returning();

    return result[0] || null;
  }

}

export default new GiroRepository();
