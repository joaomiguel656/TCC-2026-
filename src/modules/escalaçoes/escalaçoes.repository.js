
import { eq } from "drizzle-orm";

import { db } from "../../config/database.js";
import { escalacao } from "../../db/schema/escalacao.schema.js";

class EscalacaoRepository {

  async findAll() {
    return await db
      .select()
      .from(escalacao);
  }

  async findById(id) {
    const result = await db
      .select()
      .from(escalacao)
      .where(eq(escalacao.id, id));

    return result[0] || null;
  }

  async findByUsuario(usuarioId) {
    return await db
      .select()
      .from(escalacao)
      .where(eq(escalacao.usuarioId, usuarioId));
  }

  async create(dados) {
    const result = await db
      .insert(escalacao)
      .values(dados)
      .returning();

    return result[0];
  }

  async update(id, dados) {
    const result = await db
      .update(escalacao)
      .set(dados)
      .where(eq(escalacao.id, id))
      .returning();

    return result[0] || null;
  }

  async delete(id) {
    const result = await db
      .delete(escalacao)
      .where(eq(escalacao.id, id))
      .returning();

    return result[0] || null;
  }

}

export default new EscalacaoRepository();
