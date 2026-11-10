import pool from "./config/database.js";

try {
    const resultado = await pool.query("SELECT NOW()");

    console.log("Conexão com PostgreSQL realizada!");
    console.log("Horário do banco:", resultado.rows[0].now);

} catch (erro) {
    console.error("Erro ao conectar ao banco:", erro);

} finally {
    await pool.end();
}