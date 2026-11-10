
import { eq } from "drizzle-orm";

import { db } from "../../config/database.js";
import { atleta } from "../../db/schema/atleta.schema.js";

class AtletaRepository {

  async findAll() {
    return await db
      .select()
      .from(atleta);
  }

  async findById(id) {
    const result = await db
      .select()
      .from(atleta)
      .where(eq(atleta.id, id));

    return result[0] || null;
  }

  async findByTime(timeId) {
    return await db
      .select()
      .from(atleta)
      .where(eq(atleta.timeId, timeId));
  }

  async create(dados) {
    const result = await db
      .insert(atleta)
      .values(dados)
      .returning();

    return result[0];
  }

  async update(id, dados) {
    const result = await db
      .update(atleta)
      .set(dados)
      .where(eq(atleta.id, id))
      .returning();

    return result[0] || null;
  }

  async delete(id) {
    const result = await db
      .delete(atleta)
      .where(eq(atleta.id, id))
      .returning();

    return result[0] || null;
  }

}

export default new AtletaRepository();
