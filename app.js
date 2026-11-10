
import express from "express";
import cors from "cors";

// Importação das rotas
import timeRoutes from "./src/modules/time/time.routes.js";
import giroRoutes from "./src/modules/giro/giro.routes.js";
import escalacaoRoutes from "./src/modules/escalacoes/escalacao.routes.js";
import atletaRoutes from "./src/modules/atleta/atleta.routes.js";
import escalacaoAtletaRoutes from "./src/modules/escalacao_atletas/escalacaoAtleta.routes.js";
import posicaoRoutes from "./src/modules/posicao/posicao.routes.js";
import usuarioRoutes from "./src/modules/usuario/usuario.routes.js";
import formacaoRoutes from "./src/modules/formacoes/formacao.routes.js";
import campeonatoRoutes from "./src/modules/campeonato/campeonato.routes.js";

// Criação da aplicação Express
const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rota inicial
app.get("/", (req, res) => {
    return res.status(200).json({
        mensagem: "API do projeto funcionando corretamente!"
    });
});

// Registro das rotas
app.use("/api/times", timeRoutes);
app.use("/api/giros", giroRoutes);
app.use("/api/escalacoes", escalacaoRoutes);
app.use("/api/atletas", atletaRoutes);
app.use("/api/escalacao-atletas", escalacaoAtletaRoutes);
app.use("/api/posicoes", posicaoRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/formacoes", formacaoRoutes);
app.use("/api/campeonatos", campeonatoRoutes);

// Middleware para rotas não encontradas
app.use((req, res) => {
    return res.status(404).json({
        mensagem: "Rota não encontrada."
    });
});

// Tratamento global de erros
app.use((error, req, res, next) => {
    console.error(error);

    return res.status(error.status || 500).json({
        mensagem: error.message || "Erro interno do servidor."
    });
});

export default app;
