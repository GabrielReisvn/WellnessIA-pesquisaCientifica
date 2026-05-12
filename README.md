# 🧠 WellnessAI — Sistema de Monitoramento de Bem-Estar Organizacional

**Projeto:** Monitoramento Inteligente e Ético para a Saúde Mental e Bem-Estar Organizacional  
**Autor:** Gabriel Viana dos Reis  
**Stack:** Node.js + Express + Anthropic Claude API

---

## Arquitetura do Sistema

```
wellness-ai/
├── server.js                   ← Servidor Express (porta 3000)
├── package.json
├── data/
│   └── mockDatabase.js         ← Banco de dados simulado (pontos + relatórios)
├── services/
│   ├── analysisService.js      ← Processamento local dos dados de jornada
│   └── aiService.js            ← Integração com Anthropic Claude API
├── routes/
│   └── wellness.js             ← Endpoints REST da API
└── public/
    └── index.html              ← Dashboard interativo
```

## Como Rodar

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar a API Key da Anthropic
```bash
# Linux/Mac
export ANTHROPIC_API_KEY="sk-ant-..."

# Windows
set ANTHROPIC_API_KEY=sk-ant-...
```

### 3. Iniciar o servidor
```bash
npm start
```

Acesse: **http://localhost:3000**

---

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/employees` | Lista todos com score de risco (sem IA) |
| GET | `/api/employee/:id/analyze` | Análise IA de um funcionário (ex: `E001`, `E008`) |
| GET | `/api/departments` | Agregado por departamento |
| GET | `/api/climate` | Análise IA do clima organizacional |
| GET | `/api/high-risk` | Funcionários com score de risco ≥ 60 |

## Funcionários no Banco de Dados Simulado

| ID | Nome | Departamento | Risco Estimado |
|----|------|--------------|----------------|
| E001 | Ana Souza | Tecnologia | ALTO |
| E003 | Fernanda Costa | Tecnologia | ALTO |
| E005 | Juliana Martins | Tecnologia | MODERADO |
| E008 | Diego Santos | Suporte | **CRÍTICO** |
| E002 | Carlos Lima | Marketing | BAIXO |
| ... | ... | ... | ... |

## Fluxo Ético de Intervenção (LGPD)

1. **Monitoramento** → IA identifica padrões de risco via dados de jornada e relatórios
2. **Anonimização** → Relatórios macro não identificam indivíduos  
3. **Recomendação** → IA sugere intervenções ao RH, sem tomar decisões autônomas
4. **Decisão Humana** → Gestor/RH decide a ação com base no relatório

---

> A IA nunca toma decisões punitivas. Ela atua como suporte de decisão para o RH.
