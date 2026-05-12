// =============================================================
// SERVIÇO DE ANÁLISE LOCAL — Sem API externa, 100% offline
// Motor de regras baseado nas métricas reais de jornada e texto
// =============================================================

function analyzeEmployee(payload) {
  const m = payload.timeMetrics;
  const report = payload.performanceReport.toLowerCase();
  const score = m.hoursRiskScore;

  // Detecta palavras-chave nos relatórios de texto
  const keywords = {
    burnout:    ["no limite", "esgotamento", "colaps", "burnout"],
    stress:     ["pressão", "ansiedade", "estresse", "irritab", "tenso", "nervos"],
    fatigue:    ["cansaço", "cansado", "exausto", "exaustão", "dores de cabeça", "cefaleia", "licença médica"],
    disengaged: ["automático", "desengaj", "desmotiv", "sem espaço", "adiou", "esquecimento"],
    overload:   ["sobrecarga", "horas extras", "sem tempo", "correndo", "acumulado", "backlog"],
    decline:    ["caiu", "queda", "diminuiu", "erros", "não entregou", "atrasou"],
  };

  const found = {};
  for (const [key, terms] of Object.entries(keywords)) {
    found[key] = terms.some(t => report.includes(t));
  }

  const flagCount = Object.values(found).filter(Boolean).length;

  // Calcula score combinado (horas + sinais textuais)
  const textBonus = flagCount * 8;
  const combinedScore = Math.min(100, score + textBonus);

  // Define nível de risco
  let riskLevel;
  if (combinedScore >= 75) riskLevel = "CRÍTICO";
  else if (combinedScore >= 55) riskLevel = "ALTO";
  else if (combinedScore >= 35) riskLevel = "MODERADO";
  else riskLevel = "BAIXO";

  // Monta indicadores detectados
  const indicators = [];
  if (m.avgHoursPerDay > 10) indicators.push(`Média diária de ${m.avgHoursPerDay}h (${(m.avgHoursPerDay - 8).toFixed(1)}h acima do padrão)`);
  if (m.overtimeDays > 5)    indicators.push(`${m.overtimeDays} dias com jornada acima de 10h nas últimas 4 semanas`);
  if (m.criticalDays > 2)    indicators.push(`${m.criticalDays} dias com jornada crítica acima de 12h`);
  if (m.trend > 0.5)         indicators.push(`Tendência de piora: +${m.trend}h/semana nas últimas semanas`);
  if (found.burnout)         indicators.push("Relatos verbais de esgotamento extremo nos feedbacks");
  if (found.fatigue)         indicators.push("Sinais físicos de fadiga (cefaleias, licenças médicas)");
  if (found.disengaged)      indicators.push("Sinais de desengajamento e queda de atenção");
  if (found.decline)         indicators.push("Queda mensurável de desempenho nas entregas");
  if (found.overload)        indicators.push("Sobrecarga de demandas relatada pelo próprio colaborador");
  if (indicators.length === 0) indicators.push("Nenhum indicador crítico identificado no período");

  // Causas raiz
  const rootCauses = [];
  if (m.overtimeDays > 8)   rootCauses.push("Subdimensionamento da equipe para a demanda atual");
  if (found.overload)       rootCauses.push("Acúmulo de backlog sem redistribuição de tarefas");
  if (found.stress)         rootCauses.push("Pressão por prazos sem suporte adequado do gestor");
  if (m.trend > 0.5)        rootCauses.push("Aumento progressivo de carga sem contrapartida de descanso");
  if (found.disengaged)     rootCauses.push("Possível desalinhamento entre expectativas e capacidade real");
  if (rootCauses.length === 0) rootCauses.push("Carga de trabalho dentro do esperado para o período");

  // Intervenções
  const interventions = [];

  if (riskLevel === "CRÍTICO") {
    interventions.push({
      priority: "IMEDIATA",
      type: "SUPORTE_RH",
      action: "Realizar conversa de acolhimento com o colaborador ainda esta semana. Verificar interesse em apoio psicológico.",
      responsible: "RH"
    });
    interventions.push({
      priority: "IMEDIATA",
      type: "REDISTRIBUIÇÃO",
      action: `Reduzir carga imediatamente. Colaborador acumula ${m.totalOvertimeHours}h extras. Redistribuir tarefas para outros membros ou adiar entregas não críticas.`,
      responsible: "GESTOR"
    });
  }

  if (riskLevel === "ALTO" || riskLevel === "CRÍTICO") {
    interventions.push({
      priority: "CURTO_PRAZO",
      type: "PAUSA_ATIVA",
      action: "Implementar pausas ativas obrigatórias de 10 min a cada 2h. Sugerir técnica de respiração 4-7-8 para regulação do sistema nervoso parassimpático.",
      responsible: "FUNCIONÁRIO"
    });
  }

  if (m.overtimeDays > 5) {
    interventions.push({
      priority: "CURTO_PRAZO",
      type: "REDISTRIBUIÇÃO",
      action: "Avaliar necessidade de nova contratação ou realocação temporária de colaborador de setor com menor carga.",
      responsible: "RH"
    });
  }

  interventions.push({
    priority: "MEDIO_PRAZO",
    type: "TREINAMENTO",
    action: "Incluir colaborador em programa de gestão de energia e produtividade sustentável. Abordar técnicas de priorização (Eisenhower Matrix).",
    responsible: "TODOS"
  });

  // Nota circadiana baseada na tendência de horário
  const circadianNote = m.avgHoursPerDay > 11
    ? "Jornadas acima de 11h frequentemente invadem o período noturno, suprimindo a secreção de melatonina e prejudicando a consolidação da memória e recuperação muscular. Priorizar encerramento até 18h."
    : m.avgHoursPerDay > 9
    ? "Horas extras moderadas impactam a fase de maior alerta biológico (período pós-almoço). Recomenda-se proteger o intervalo de 12h às 14h para descanso e digestão."
    : "Jornada dentro do ritmo circadiano saudável. Manter rotina de horários regulares para estabilizar o ciclo sono-vigília.";

  const summary = riskLevel === "CRÍTICO"
    ? `Colaborador em estado crítico de sobrecarga com ${m.avgHoursPerDay}h de média diária e ${flagCount} sinais de alerta nos relatórios. Intervenção imediata necessária para evitar afastamento médico.`
    : riskLevel === "ALTO"
    ? `Colaborador apresenta sobrecarga significativa com tendência de piora. Média de ${m.avgHoursPerDay}h/dia e ${m.overtimeDays} dias com horas extras. Atenção preventiva recomendada nas próximas semanas.`
    : riskLevel === "MODERADO"
    ? `Carga de trabalho acima do ideal com alguns sinais de atenção. Monitorar evolução nas próximas semanas e verificar com o gestor direto.`
    : `Colaborador apresenta indicadores saudáveis de jornada e desempenho. Manter acompanhamento periódico de rotina.`;

  return Promise.resolve({
    riskLevel,
    riskScore: combinedScore,
    summary,
    indicators,
    rootCauses,
    interventions,
    circadianNote,
    followUpDays: riskLevel === "CRÍTICO" ? 3 : riskLevel === "ALTO" ? 7 : 14,
  });
}

function analyzeDepartmentClimate(deptData) {
  const sorted = [...deptData].sort((a, b) => b.avgRiskScore - a.avgRiskScore);
  const topDept = sorted[0];
  const avgCompany = deptData.reduce((a, d) => a + d.avgRiskScore, 0) / deptData.length;

  let overallClimate;
  if (avgCompany >= 50) overallClimate = "CRÍTICO";
  else if (avgCompany >= 35) overallClimate = "PREOCUPANTE";
  else if (avgCompany >= 20) overallClimate = "ATENÇÃO";
  else overallClimate = "SAUDÁVEL";

  const departmentHighlights = deptData.map(d => ({
    department: d.department,
    status: d.avgRiskScore >= 50 ? "CRÍTICO" : d.avgRiskScore >= 30 ? "ATENÇÃO" : "SAUDÁVEL",
    note: d.avgRiskScore >= 50
      ? `Média de ${d.avgHoursPerDay}h/dia com ${d.avgCriticalDays} dias críticos por colaborador. Requer ação imediata.`
      : d.avgRiskScore >= 30
      ? `Carga moderada de ${d.avgHoursPerDay}h/dia. Monitorar evolução quinzenal.`
      : `Setor equilibrado com média de ${d.avgHoursPerDay}h/dia. Referência positiva.`
  }));

  const companyRecommendations = [];
  if (avgCompany >= 35) companyRecommendations.push(`Revisar dimensionamento de equipe no setor ${topDept.department} com urgência`);
  companyRecommendations.push("Implementar política de desconexão digital após as 18h para todos os setores");
  companyRecommendations.push("Criar programa mensal de escuta ativa com gestores para coleta de sinais precoces");
  if (deptData.some(d => d.avgCriticalDays > 2)) companyRecommendations.push("Mapear e redistribuir gargalos de demanda entre setores com menor carga");
  companyRecommendations.push("Adotar pesquisa de clima quinzenal (pulse survey) em substituição à pesquisa anual");

  const summary = `O clima organizacional está classificado como ${overallClimate} com score médio de ${avgCompany.toFixed(0)}/100. O setor mais crítico é ${topDept.department} com média de ${topDept.avgHoursPerDay}h/dia. Recomenda-se priorizar intervenções de redistribuição de carga e escuta ativa nos próximos 30 dias.`;

  return Promise.resolve({
    overallClimate,
    departmentHighlights,
    companyRecommendations,
    priorityDepartment: topDept.department,
    summary,
  });
}

module.exports = { analyzeEmployee, analyzeDepartmentClimate };