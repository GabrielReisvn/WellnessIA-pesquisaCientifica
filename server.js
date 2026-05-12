// =============================================================
// SERVIDOR PRINCIPAL — Sistema de Monitoramento de Bem-Estar
// Projeto: Monitoramento Inteligente e Ético para Saúde Mental
// Autor: Gabriel Viana dos Reis
// =============================================================

const express = require("express");
const path = require("path");
const wellnessRoutes = require("./routes/wellness");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Rotas da API
app.use("/api", wellnessRoutes);

// Serve o dashboard
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`\n🧠 Sistema de Bem-Estar Organizacional`);
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`\nEndpoints disponíveis:`);
  console.log(`  GET /api/employees         → Lista todos os funcionários com score de risco`);
  console.log(`  GET /api/employee/:id/analyze → Análise IA de um funcionário (ex: E001, E008)`);
  console.log(`  GET /api/departments       → Agregado por departamento`);
  console.log(`  GET /api/climate           → Análise IA do clima organizacional`);
  console.log(`  GET /api/high-risk         → Funcionários com risco elevado`);
});

module.exports = app;
