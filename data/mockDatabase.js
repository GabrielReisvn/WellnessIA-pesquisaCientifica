// =============================================================
// BANCO DE DADOS SIMULADO — Sistema de Pontos e Relatórios RH
// Representa os dados já existentes no sistema da empresa
// =============================================================

const employees = [
  { id: "E001", name: "Ana Souza",        department: "Tecnologia",  role: "Dev Senior"    },
  { id: "E002", name: "Carlos Lima",      department: "Marketing",   role: "Analista"      },
  { id: "E003", name: "Fernanda Costa",   department: "Tecnologia",  role: "Dev Pleno"     },
  { id: "E004", name: "Ricardo Alves",    department: "Financeiro",  role: "Coordenador"   },
  { id: "E005", name: "Juliana Martins",  department: "Tecnologia",  role: "Dev Júnior"    },
  { id: "E006", name: "Bruno Ferreira",   department: "Marketing",   role: "Designer"      },
  { id: "E007", name: "Patrícia Nunes",   department: "Financeiro",  role: "Analista"      },
  { id: "E008", name: "Diego Santos",     department: "Suporte",     role: "Técnico N2"    },
  { id: "E009", name: "Mariana Oliveira", department: "Suporte",     role: "Técnico N1"    },
  { id: "E010", name: "Thiago Mendes",    department: "Tecnologia",  role: "Arquiteto"     },
];

// Registros de ponto — últimas 4 semanas (horas trabalhadas por dia)
// Valor = horas trabalhadas. Jornada padrão = 8h. Acima de 10h = alerta.
const timeRecords = {
  E001: [8.5, 9.0, 11.5, 12.0, 10.5,  9.0, 10.0, 11.0, 13.0, 12.5,  9.5, 10.5, 11.0, 9.0, 8.5,  9.0, 10.0, 12.0, 11.5, 10.0, 8.0],
  E002: [8.0, 8.5,  8.0,  7.5,  8.5,  8.0,  8.0,  9.0,  8.5,  8.0,  8.0,  7.5,  8.0, 8.5, 8.0,  8.0,  8.5,  8.0,  7.5,  8.0, 9.5],
  E003: [9.0, 9.5, 10.0, 11.0, 12.5, 11.0, 10.5, 12.0, 13.5, 11.0, 12.0, 13.0, 10.5, 9.5, 11.0, 12.5, 13.0, 11.5, 10.0, 12.0, 8.0],
  E004: [8.0, 8.0,  9.5,  9.0,  8.5,  8.0,  9.0,  9.5,  9.0,  8.0,  8.5,  9.0,  9.5, 8.0, 8.5,  9.0,  9.5,  9.0,  8.5,  8.0, 10.5],
  E005: [7.5, 8.0,  8.5,  9.0,  9.5, 10.0, 10.5, 11.0, 11.5, 12.0,  9.5, 10.0, 10.5, 9.0, 9.5,  8.5,  9.0, 10.0, 11.0, 10.5, 8.0],
  E006: [8.0, 7.5,  8.0,  8.5,  8.0,  7.5,  8.0,  8.0,  8.5,  8.0,  8.0,  8.5,  8.0, 7.5, 8.0,  8.0,  8.5,  8.0,  7.5,  8.0, 9.0],
  E007: [8.5, 9.0,  9.5,  9.0,  8.5,  9.0,  9.5, 10.0,  9.5,  9.0,  9.5, 10.0, 10.5, 9.0, 9.5, 10.0, 10.5,  9.5,  9.0,  9.5, 8.5],
  E008: [9.5,10.0, 11.0, 12.0, 13.5, 12.0, 11.5, 12.5, 14.0, 13.0, 12.0, 13.5, 11.5,10.5,12.0, 13.0, 14.5, 12.5, 11.0, 13.0, 8.0],
  E009: [8.0, 8.5,  9.0,  9.5, 10.0,  9.5,  9.0, 10.0,  9.5,  9.0,  8.5,  9.5, 10.0, 9.0, 9.5, 10.0,  9.5,  9.0,  8.5,  9.0, 8.5],
  E010: [8.0, 8.0,  8.5,  8.0,  8.5,  9.0,  8.0,  8.5,  9.0,  8.5,  8.0,  8.5,  8.0, 8.5, 8.0,  8.5,  8.0,  8.5,  8.0,  8.0, 10.0],
};

// Relatórios de desempenho e feedback — texto livre (simulando sistema de RH)
const performanceReports = {
  E001: `Semana 1: Entregou o módulo de pagamentos com sucesso, mas comentou que está "correndo contra o tempo o dia todo". Trabalhou até tarde na sexta. Semana 2: Relatou dificuldade de concentração. Perdeu duas reuniões por esquecimento. Começou a errar em revisões de código simples. Semana 3: Gestor notou irritabilidade. Ana pediu para adiar reunião de 1:1, dizendo estar "sem espaço na agenda". Semana 4: Produtividade caiu. Entregou só 2 dos 5 itens do sprint. Mencionou dores de cabeça frequentes.`,

  E002: `Semana 1: Bom desempenho. Criou campanha de e-mail com engajamento acima da meta. Semana 2: Entregou relatório de métricas com antecedência. Boa comunicação. Semana 3: Participação ativa no brainstorm do produto. Sugeriu três melhorias aceitas. Semana 4: Continuidade positiva. Nenhum sinal de alerta.`,

  E003: `Semana 1: Alta demanda de projeto novo. Fernanda pediu horas extras voluntariamente. Semana 2: "Preciso terminar isso antes das férias do cliente". Ficou no escritório até as 22h em dois dias. Semana 3: Reportou sentir-se "no limite". Aparenta cansaço na comunicação escrita — respostas mais curtas e secas. Semana 4: Solicitou folga e foi negada. Desempenho caiu 40% nas tarefas estimadas. Gestor preocupado.`,

  E004: `Semana 1: Fechamento de balanço trimestral. Pressão normal do período. Semana 2: Organizou treinamento de equipe. Liderança proativa. Semana 3: Algumas revisões pendentes mas dentro do prazo. Semana 4: Estável. Sem alertas.`,

  E005: `Semana 1: Juliana está aprendendo novas tecnologias. Entusiasmo notável. Semana 2: Começou a fazer horas extras sem ser solicitada. Quer "provar valor". Semana 3: Reportou ansiedade antes de code reviews. Disse que "tem medo de errar". Semana 4: Horas extras aumentando. Está trabalhando em fins de semana também. Gestor não pediu, mas ela não quer "atrasar o time".`,

  E006: `Semana 1: Entregou identidade visual do novo produto. Excelente qualidade. Semana 2: Colaborou com o time de UX sem demanda extra. Semana 3: Sem alertas. Semana 4: Bom ritmo. Equilibrado.`,

  E007: `Semana 1: Auditoria interna aumentou carga. Patrícia pediu suporte e recebeu. Semana 2: Horas extras leves, dentro do razoável. Semana 3: Comunicação mais tensa por causa de prazo regulatório. Semana 4: Encerrou período com tensão moderada mas resolvida.`,

  E008: `Semana 1: Fila de chamados em backlog. Diego está atendendo mais de 20 tickets/dia. Semana 2: Reportou que "não tem tempo para almoçar direito". Resposta a clientes com tom mais ansioso. Semana 3: Tirou dois dias de licença médica (cefaleia). Voltou ainda com backlog. Semana 4: Gestor relatou que Diego está "no automático", erros básicos aumentando. Sinais claros de esgotamento. Pediu redução de carga e não foi atendido.`,

  E009: `Semana 1: Alta demanda por ausência de colega. Cobriu dois postos. Semana 2: Cansaço visível. Chegou 30min atrasada dois dias. Semana 3: Desempenho oscilando. Boa nas manhãs, queda à tarde. Semana 4: Estável mas com carga acima do ideal.`,

  E010: `Semana 1: Liderança técnica em novo projeto de arquitetura. Bem equilibrado. Semana 2: Reuniões frequentes mas gerenciadas. Semana 3: Sem alertas. Semana 4: Continua estável. Referência positiva para o time.`,
};

module.exports = { employees, timeRecords, performanceReports };
