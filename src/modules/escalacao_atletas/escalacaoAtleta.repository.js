
import { eq, and } from "drizzle-orm";

import { db } from "../../config/database.js";
import { escalacaoAtleta } from "../../db/schema/escalacaoAtleta.schema.js";

class EscalacaoAtletaRepository {

  async findAll() {
    return await db
      .select()
      .from(escalacaoAtleta);
  }

  async findById(id) {
    const result = await db
      .select()
      .from(escalacaoAtleta)
      .where(eq(escalacaoAtleta.id, id));

    return result[0] || null;
  }

  async findByEscalacao(escalacaoId) {
    return await db
      .select()
      .from(escalacaoAtleta)
      .where(eq(escalacaoAtleta.escalacaoId, escalacaoId));
  }

  async findByGiro(giroId) {
    const result = await db
      .select()
      .from(escalacaoAtleta)
      .where(eq(escalacaoAtleta.giroId, giroId));

    return result[0] || null;
  }

  
async findByEscalacaoEPosicao(escalacaoId, posicaoId) {
  return await db
    .select()
    .from(escalacaoAtleta)
    .where(
      and(
        eq(escalacaoAtleta.escalacaoId, escalacaoId),
        eq(escalacaoAtleta.posicaoId, posicaoId)
      )
    );
}


  async create(dados) {
    const result = await db
      .insert(escalacaoAtleta)
      .values(dados)
      .returning();

    return result[0];
  }

  async delete(id) {
    const result = await db
      .delete(escalacaoAtleta)
      .where(eq(escalacaoAtleta.id, id))
      .returning();

    return result[0] || null;
  }

}

export default new EscalacaoAtletaRepository();
