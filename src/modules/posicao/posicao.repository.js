
import { eq } from "drizzle-orm";

import { db } from "../../config/database.js";
import { posicao } from "../../db/schema/posicao.schema.js";

class PosicaoRepository {

  async findAll() {
    return await db
      .select()
      .from(posicao);
  }

  async findById(id) {
    const result = await db
      .select()
      .from(posicao)
      .where(eq(posicao.id, id));

    return result[0] || null;
  }

  async findByNome(nome) {
    const result = await db
      .select()
      .from(posicao)
      .where(eq(posicao.nome, nome));

    return result[0] || null;
  }

  async create(dados) {
    const result = await db
      .insert(posicao)
      .values(dados)
      .returning();

    return result[0];
  }

  async update(id, dados) {
    const result = await db
      .update(posicao)
      .set(dados)
      .where(eq(posicao.id, id))
      .returning();

    return result[0] || null;
  }

  async delete(id) {
    const result = await db
      .delete(posicao)
      .where(eq(posicao.id, id))
      .returning();

    return result[0] || null;
  }

}

export default new PosicaoRepository();
