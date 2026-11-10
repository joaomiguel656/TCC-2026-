
import { eq } from "drizzle-orm";

import { db } from "../../config/database.js";

import {
  formacao,
  formacaoPosicao
} from "../../db/schema/formacao.schema.js";

import { posicao } from "../../db/schema/posicao.schema.js";

class FormacaoRepository {

  // Organiza os resultados das consultas em formações completas
  organizarFormacoes(registros) {
    const formacoes = new Map();

    for (const registro of registros) {
      const id = registro.formacao.id;

      if (!formacoes.has(id)) {
        formacoes.set(id, {
          ...registro.formacao,
          posicoes: []
        });
      }

      if (registro.formacaoPosicao) {
        formacoes.get(id).posicoes.push({
          id: registro.formacaoPosicao.id,
          posicaoId: registro.posicao.id,
          nome: registro.posicao.nome,
          quantidade: registro.formacaoPosicao.quantidade
        });
      }
    }

    return Array.from(formacoes.values());
  }

  async findAll() {
    const registros = await db
      .select({
        formacao,
        formacaoPosicao,
        posicao
      })
      .from(formacao)
      .leftJoin(
        formacaoPosicao,
        eq(formacao.id, formacaoPosicao.formacaoId)
      )
      .leftJoin(
        posicao,
        eq(formacaoPosicao.posicaoId, posicao.id)
      );

    return this.organizarFormacoes(registros);
  }

  async findById(id) {
    const registros = await db
      .select({
        formacao,
        formacaoPosicao,
        posicao
      })
      .from(formacao)
      .leftJoin(
        formacaoPosicao,
        eq(formacao.id, formacaoPosicao.formacaoId)
      )
      .leftJoin(
        posicao,
        eq(formacaoPosicao.posicaoId, posicao.id)
      )
      .where(eq(formacao.id, id));

    return this.organizarFormacoes(registros)[0] || null;
  }

  async findByNome(nome) {
    const result = await db
      .select()
      .from(formacao)
      .where(eq(formacao.nome, nome));

    return result[0] || null;
  }

  async create(dados, posicoes) {
    const novaFormacao = await db.transaction(async (tx) => {

      const [formacaoCriada] = await tx
        .insert(formacao)
        .values({
          nome: dados.nome
        })
        .returning();

      await tx
        .insert(formacaoPosicao)
        .values(
          posicoes.map((item) => ({
            formacaoId: formacaoCriada.id,
            posicaoId: item.posicaoId,
            quantidade: item.quantidade
          }))
        );

      return formacaoCriada;
    });

    return await this.findById(novaFormacao.id);
  }

  async update(id, dados, posicoes) {
    await db.transaction(async (tx) => {

      if (dados.nome !== undefined) {
        await tx
          .update(formacao)
          .set({
            nome: dados.nome
          })
          .where(eq(formacao.id, id));
      }

      if (posicoes !== undefined) {
        await tx
          .delete(formacaoPosicao)
          .where(eq(formacaoPosicao.formacaoId, id));

        await tx
          .insert(formacaoPosicao)
          .values(
            posicoes.map((item) => ({
              formacaoId: id,
              posicaoId: item.posicaoId,
              quantidade: item.quantidade
            }))
          );
      }

    });

    return await this.findById(id);
  }

  async delete(id) {
  await db.transaction(async (tx) => {

    await tx
      .delete(formacaoPosicao)
      .where(eq(formacaoPosicao.formacaoId, id));

    await tx
      .delete(formacao)
      .where(eq(formacao.id, id));

  });

  return { id };
}

}

export default new FormacaoRepository();
