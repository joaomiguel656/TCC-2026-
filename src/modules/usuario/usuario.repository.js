
import { eq } from "drizzle-orm";

import { db } from "../../config/database.js";
import { usuario } from "../../db/schema/usuario.schema.js";

class UsuarioRepository {

  async findAll() {
    return await db
      .select()
      .from(usuario);
  }

  async findById(id) {
    const result = await db
      .select()
      .from(usuario)
      .where(eq(usuario.id, id));

    return result[0] || null;
  }

  async findByEmail(email) {
    const result = await db
      .select()
      .from(usuario)
      .where(eq(usuario.email, email));

    return result[0] || null;
  }

  async create(dados) {
    const result = await db
      .insert(usuario)
      .values(dados)
      .returning();

    return result[0];
  }

  async update(id, dados) {
    const result = await db
      .update(usuario)
      .set(dados)
      .where(eq(usuario.id, id))
      .returning();

    return result[0] || null;
  }

  async delete(id) {
    const result = await db
      .delete(usuario)
      .where(eq(usuario.id, id))
      .returning();

    return result[0] || null;
  }

}

export default new UsuarioRepository();
