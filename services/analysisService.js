// =============================================================
// SERVIÇO DE PRÉ-PROCESSAMENTO — Análise de Pontos e Relatórios
// Processa os dados brutos antes de enviar à IA
// =============================================================

const { employees, timeRecords, performanceReports } = require("../data/mockDatabase");

const STANDARD_HOURS = 8;
const OVERTIME_THRESHOLD = 10;
const CRITICAL_THRESHOLD = 12;

/**
 * Calcula métricas de jornada para um funcionário
 */
function analyzeTimeRecord(employeeId) {
  const records = timeRecords[employeeId];
  if (!records) return null;

  const totalDays = records.length;
  const avgHours = records.reduce((a, b) => a + b, 0) / totalDays;
  const overtimeDays = records.filter(h => h > OVERTIME_THRESHOLD).length;
  const criticalDays = records.filter(h => h > CRITICAL_THRESHOLD).length;
  const totalOvertime = records.reduce((acc, h) => acc + Math.max(0, h - STANDARD_HOURS), 0);

  // Tendência: compara primeiras 10 dias com últimas 10
  const firstHalf = records.slice(0, 10);
  const secondHalf = records.slice(10);
  const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  const trend = avgSecond - avgFirst; // positivo = piorando

  // Score de risco baseado em horas (0–100)
  let hoursRiskScore = 0;
  hoursRiskScore += Math.min(40, (avgHours - STANDARD_HOURS) * 8);
  hoursRiskScore += Math.min(30, overtimeDays * 3);
  hoursRiskScore += Math.min(20, criticalDays * 5);
  hoursRiskScore += Math.min(10, trend > 0 ? trend * 5 : 0);
  hoursRiskScore = Math.max(0, Math.min(100, hoursRiskScore));

  return {
    employeeId,
    totalDays,
    avgHoursPerDay: +avgHours.toFixed(2),
    overtimeDays,
    criticalDays,
    totalOvertimeHours: +totalOvertime.toFixed(1),
    trend: +trend.toFixed(2),
    hoursRiskScore: Math.round(hoursRiskScore),
    weeklyAvg: [
      +(records.slice(0, 5).reduce((a, b) => a + b, 0) / 5).toFixed(2),
      +(records.slice(5, 10).reduce((a, b) => a + b, 0) / 5).toFixed(2),
      +(records.slice(10, 15).reduce((a, b) => a + b, 0) / 5).toFixed(2),
      +(records.slice(15, 20).reduce((a, b) => a + b, 0) / 5).toFixed(2),
    ],
  };
}

/**
 * Constrói o payload completo para envio à IA (anonimizado por padrão)
 */
function buildAnalysisPayload(employeeId, anonymize = true) {
  const employee = employees.find(e => e.id === employeeId);
  const timeAnalysis = analyzeTimeRecord(employeeId);
  const report = performanceReports[employeeId];

  return {
    identifier: anonymize ? employeeId : employee?.name,
    department: employee?.department,
    role: employee?.role,
    timeMetrics: timeAnalysis,
    performanceReport: report,
  };
}

/**
 * Agrega dados por departamento (relatório macro — sem identificação individual)
 */
function aggregateByDepartment() {
  const deptMap = {};

  employees.forEach(emp => {
    const dept = emp.department;
    if (!deptMap[dept]) {
      deptMap[dept] = { department: dept, employees: 0, totalRiskScore: 0, avgHours: 0, criticalDays: 0 };
    }
    const metrics = analyzeTimeRecord(emp.id);
    deptMap[dept].employees++;
    deptMap[dept].totalRiskScore += metrics.hoursRiskScore;
    deptMap[dept].avgHours += metrics.avgHoursPerDay;
    deptMap[dept].criticalDays += metrics.criticalDays;
  });

  return Object.values(deptMap).map(d => ({
    ...d,
    avgRiskScore: Math.round(d.totalRiskScore / d.employees),
    avgHoursPerDay: +(d.avgHours / d.employees).toFixed(2),
    avgCriticalDays: +(d.criticalDays / d.employees).toFixed(1),
  }));
}

/**
 * Lista todos os funcionários com seus scores para triagem
 */
function getAllEmployeeSummaries() {
  return employees.map(emp => {
    const metrics = analyzeTimeRecord(emp.id);
    return {
      id: emp.id,
      name: emp.name,
      department: emp.department,
      role: emp.role,
      hoursRiskScore: metrics.hoursRiskScore,
      avgHours: metrics.avgHoursPerDay,
      overtimeDays: metrics.overtimeDays,
      trend: metrics.trend,
    };
  }).sort((a, b) => b.hoursRiskScore - a.hoursRiskScore);
}

module.exports = { buildAnalysisPayload, aggregateByDepartment, getAllEmployeeSummaries, analyzeTimeRecord };
