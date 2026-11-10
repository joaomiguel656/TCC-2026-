
import escalacaoAtletaRepository from "./escalacaoAtleta.repository.js";

import escalacaoRepository from "../escalacoes/escalacao.repository.js";
import giroRepository from "../giros/giro.repository.js";
import posicaoRepository from "../posicoes/posicao.repository.js";

class EscalacaoAtletaService {

    async getAll() {
        return await escalacaoAtletaRepository.findAll();
    }

    async getById(id) {
        const registro = await escalacaoAtletaRepository.findById(id);

        if (!registro) {
            throw Object.assign(
                new Error("Registro da escalação não encontrado."),
                { status: 404 }
            );
        }

        return registro;
    }

    async getByEscalacao(escalacaoId) {
        return await escalacaoAtletaRepository.findByEscalacao(
            escalacaoId
        );
    }

    async create(dados) {
        
    // Busca todas as vagas já ocupadas nessa posição
    const registrosExistentes =
      await escalacaoAtletaRepository.findByEscalacaoEPosicao(
        escalacaoId,
        posicaoId
      );

    // Descobre automaticamente qual vaga está disponível
    const numeroVaga = this.definirNumeroVaga(
      posicao,
      registrosExistentes
    );

    // Cadastra o atleta na vaga disponível
    return await escalacaoAtletaRepository.create({
      escalacaoId,
      posicaoId,
      giroId,
      numeroVaga
    });


        // Verifica se a escalação existe
        const escalacao = await escalacaoRepository.findById(
            escalacaoId
        );

        if (!escalacao) {
            throw Object.assign(
                new Error("Escalação não encontrada."),
                { status: 404 }
            );
        }

        // Verifica se a escalação ainda está em andamento
        if (escalacao.status !== "EM_ANDAMENTO") {
            throw Object.assign(
                new Error("Essa escalação já foi finalizada."),
                { status: 400 }
            );
        }

        // Verifica se a posição existe
        const posicao = await posicaoRepository.findById(
            posicaoId
        );

        if (!posicao) {
            throw Object.assign(
                new Error("Posição não encontrada."),
                { status: 404 }
            );
        }

        // Verifica se o giro existe
        const giro = await giroRepository.findById(giroId);

        if (!giro) {
            throw Object.assign(
                new Error("Giro não encontrado."),
                { status: 404 }
            );
        }

        // Verifica se o giro pertence à escalação
        if (giro.escalacaoId !== escalacaoId) {
            throw Object.assign(
                new Error("Esse giro não pertence à escalação informada."),
                { status: 400 }
            );
        }

        // Verifica se o giro já foi utilizado
        const giroUtilizado = await escalacaoAtletaRepository.findByGiro(
            giroId
        );

        if (giroUtilizado) {
            throw Object.assign(
                new Error("Esse giro já foi utilizado."),
                { status: 409 }
            );
        }

        // Verifica se a posição já está ocupada
        const posicaoOcupada =
            await escalacaoAtletaRepository.findByPosicao(
                escalacaoId,
                posicaoId
            );

        if (posicaoOcupada) {
            throw Object.assign(
                new Error("Essa posição já está ocupada na escalação."),
                { status: 409 }
            );
        }

        return await escalacaoAtletaRepository.create({
            escalacaoId,
            posicaoId,
            giroId
        });
    }

    async delete(id) {
        await this.getById(id);

        return await escalacaoAtletaRepository.delete(id);
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


}

export default new EscalacaoAtletaService();
