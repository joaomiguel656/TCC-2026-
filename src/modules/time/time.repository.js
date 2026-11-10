
import { eq, and } from "drizzle-orm";
import { db } from "../../config/database.js";
import { time } from "../../db/schema/time.js";

class TimeRepository {

  async findAll() {
    return await db.select().from(time);
  }

  async findById(id) {
    const result = await db
      .select()
      .from(time)
      .where(eq(time.id, id));

    return result[0] || null;
  }

  async findByNomeAno(nome, ano) {
    const result = await db
      .select()
      .from(time)
      .where(
        and(
          eq(time.nome, nome),
          eq(time.ano, ano)
        )
      );

    return result[0] || null;
  }

  async create(dados) {
    const result = await db
      .insert(time)
      .values(dados)
      .returning();

    return result[0];
  }

  async update(id, dados) {
    const result = await db
      .update(time)
      .set(dados)
      .where(eq(time.id, id))
      .returning();

    return result[0] || null;
  }

  async delete(id) {
    const result = await db
      .delete(time)
      .where(eq(time.id, id))
      .returning();

    return result[0] || null;
  }

}

export default new TimeRepository();
