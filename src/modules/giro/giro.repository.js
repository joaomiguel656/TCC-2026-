import { eq, and, count } from "drizzle-orm";

import { db } from "../../config/database.js";
import { giro } from "../../db/schema/giro.schema.js";

class GiroRepository {

  // Buscar todos os giros
  async findAll() {
    return await db.select().from(giro);
  }

  // Buscar um giro pelo ID
  async findById(id) {
    const result = await db
      .select()
      .from(giro)
      .where(eq(giro.id, id));

    return result[0] || null;
  }

  // Buscar os giros de uma escalação
  async findByEscalacao(escalacaoId) {
    return await db
      .select()
      .from(giro)
      .where(eq(giro.escalacaoId, escalacaoId));
  }

  // Buscar giro pelo número dentro de uma escalação
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

  // Contar a quantidade de re-giros de uma escalação
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

  // Verificar se um giro já foi substituído por um re-giro
  async findByGiroAnterior(giroAnteriorId) {
    const result = await db
      .select()
      .from(giro)
      .where(eq(giro.giroAnteriorId, giroAnteriorId));

    return result[0] || null;
  }

  // Registrar um novo giro
  async create(dados) {
    const result = await db
      .insert(giro)
      .values(dados)
      .returning();

    return result[0];
  }

}

export default new GiroRepository();