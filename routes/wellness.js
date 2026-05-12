// =============================================================
// ROTAS DA API — Endpoints do Sistema de Bem-Estar
// =============================================================

const express = require("express");
const router = express.Router();
const { buildAnalysisPayload, aggregateByDepartment, getAllEmployeeSummaries } = require("../services/analysisService");
const { analyzeEmployee, analyzeDepartmentClimate } = require("../services/aiService");

// GET /api/employees — Lista todos com score de risco (sem IA, processamento local)
router.get("/employees", (req, res) => {
  const summaries = getAllEmployeeSummaries();
  res.json({ success: true, count: summaries.length, data: summaries });
});

// GET /api/employee/:id/analyze — Análise completa de um funcionário via IA
router.get("/employee/:id/analyze", async (req, res) => {
  try {
    const { id } = req.params;
    const payload = buildAnalysisPayload(id, true); // anonimizado
    if (!payload.timeMetrics) return res.status(404).json({ error: "Funcionário não encontrado" });

    const aiAnalysis = await analyzeEmployee(payload);
    res.json({ success: true, employeeId: id, department: payload.department, role: payload.role, aiAnalysis });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/departments — Agregado por departamento (sem IA)
router.get("/departments", (req, res) => {
  const data = aggregateByDepartment();
  res.json({ success: true, data });
});

// GET /api/climate — Análise de clima organizacional via IA (dados macro)
router.get("/climate", async (req, res) => {
  try {
    const deptData = aggregateByDepartment();
    const climate = await analyzeDepartmentClimate(deptData);
    res.json({ success: true, climate, deptData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/high-risk — Funcionários com score > 60 (triagem rápida)
router.get("/high-risk", (req, res) => {
  const all = getAllEmployeeSummaries();
  const highRisk = all.filter(e => e.hoursRiskScore >= 60);
  res.json({ success: true, count: highRisk.length, data: highRisk });
});

module.exports = router;
