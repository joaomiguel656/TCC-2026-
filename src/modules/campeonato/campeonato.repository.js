
import { eq, and } from "drizzle-orm";

import { db } from "../../config/database.js";

import {
    campeonato,
    campeonatoParticipante
} from "../../db/schema/campeonato.schema.js";

import { usuario } from "../../db/schema/usuario.schema.js";
import { escalacao } from "../../db/schema/escalacao.schema.js";

class CampeonatoRepository {

    // Lista todos os campeonatos
    async findAll() {
        return await db
            .select()
            .from(campeonato);
    }

    // Busca campeonato pelo ID
    async findById(id) {
        const result = await db
            .select()
            .from(campeonato)
            .where(eq(campeonato.id, id));

        return result[0] || null;
    }

    // Busca campeonato pelo nome
    async findByNome(nome) {
        const result = await db
            .select()
            .from(campeonato)
            .where(eq(campeonato.nome, nome));

        return result[0] || null;
    }

    // Lista os participantes de um campeonato
    async findParticipantes(campeonatoId) {
        return await db
            .select({
                participante: campeonatoParticipante,
                usuario: {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email
                },
                escalacao: {
                    id: escalacao.id,
                    nome: escalacao.nome,
                    status: escalacao.status
                }
            })
            .from(campeonatoParticipante)
            .innerJoin(
                usuario,
                eq(campeonatoParticipante.usuarioId, usuario.id)
            )
            .innerJoin(
                escalacao,
                eq(campeonatoParticipante.escalacaoId, escalacao.id)
            )
            .where(
                eq(campeonatoParticipante.campeonatoId, campeonatoId)
            );
    }

    // Busca inscrição pelo campeonato e usuário
    async findByCampeonatoEUsuario(campeonatoId, usuarioId) {
        const result = await db
            .select()
            .from(campeonatoParticipante)
            .where(
                and(
                    eq(campeonatoParticipante.campeonatoId, campeonatoId),
                    eq(campeonatoParticipante.usuarioId, usuarioId)
                )
            );

        return result[0] || null;
    }

    // Busca inscrição pelo campeonato e escalação
    async findByCampeonatoEEscalacao(campeonatoId, escalacaoId) {
        const result = await db
            .select()
            .from(campeonatoParticipante)
            .where(
                and(
                    eq(campeonatoParticipante.campeonatoId, campeonatoId),
                    eq(campeonatoParticipante.escalacaoId, escalacaoId)
                )
            );

        return result[0] || null;
    }

    // Cadastra um campeonato
    async create(dados) {
        const result = await db
            .insert(campeonato)
            .values(dados)
            .returning();

        return result[0];
    }

    // Atualiza um campeonato
    async update(id, dados) {
        const result = await db
            .update(campeonato)
            .set(dados)
            .where(eq(campeonato.id, id))
            .returning();

        return result[0] || null;
    }

    // Inscreve um participante
    async createParticipante(dados) {
        const result = await db
            .insert(campeonatoParticipante)
            .values(dados)
            .returning();

        return result[0];
    }

    // Remove um participante
    async deleteParticipante(id) {
        const result = await db
            .delete(campeonatoParticipante)
            .where(eq(campeonatoParticipante.id, id))
            .returning();

        return result[0] || null;
    }

    // Exclui o campeonato e suas inscrições
    async delete(id) {
        await db.transaction(async (tx) => {

            await tx
                .delete(campeonatoParticipante)
                .where(
                    eq(campeonatoParticipante.campeonatoId, id)
                );

            await tx
                .delete(campeonato)
                .where(eq(campeonato.id, id));

        });

        return { id };
    }
    async findParticipanteById(id) {
        const result = await db
            .select()
            .from(campeonatoParticipante)
            .where(eq(campeonatoParticipante.id, id));

        return result[0] || null;
    }

}

export default new CampeonatoRepository();
