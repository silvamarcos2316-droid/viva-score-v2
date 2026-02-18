# Sistema de Tracking - V.I.V.A. Score

## Visão Geral

Sistema de rastreamento de analytics implementado para coletar dados dos usuários que utilizam o V.I.V.A. Score.

## Dados Coletados

### 1. Eventos Gerais (`/data/events/`)
Arquivo: `events-YYYY-MM-DD.jsonl` (um arquivo por dia)

Eventos rastreados:
- `page_view` - Visualização de páginas (/, /calculator, /results)
- `step_completed` - Conclusão de cada step do formulário (1, 2, 3, 4)
- `email_captured` - Captura de email no modal

Formato:
```json
{
  "event": "step_completed",
  "timestamp": "2025-02-17T12:34:56.789Z",
  "sessionId": "1708177234567-abc123def",
  "data": { "step": 2 }
}
```

### 2. Análises Completas (`/data/analyses/`)

Arquivos:
- `analysis-{id}.json` - Um arquivo por análise (facilita busca individual)
- `analyses-YYYY-MM-DD.jsonl` - Log diário de todas análises

Dados salvos:
```json
{
  "id": "1708177234567-abc123def",
  "timestamp": "2025-02-17T12:34:56.789Z",
  "sessionId": "1708177234567-abc123def",
  "formData": {
    "projectName": "...",
    "problemStatement": "...",
    "techStack": [...],
    "integrationNeeds": "...",
    "budgetRange": "...",
    "roiExpectation": "...",
    "timeline": "...",
    "blockers": "..."
  },
  "analysis": {
    "scores": {
      "vision": 8,
      "integration": 7,
      "viability": 9,
      "execution": 6,
      "total": 30
    },
    "classification": "potential-high",
    "risks": [...],
    "strengths": [...],
    "nextSteps": [...],
    "questions": [...],
    "missingInfo": [...]
  },
  "userEmail": "user@example.com",
  "userName": "João Silva"
}
```

## Estrutura de Arquivos

```
data/
├── events/
│   ├── events-2025-02-17.jsonl
│   ├── events-2025-02-18.jsonl
│   └── ...
└── analyses/
    ├── analysis-1708177234567-abc123def.json
    ├── analysis-1708177299999-xyz789ghi.json
    ├── analyses-2025-02-17.jsonl
    ├── analyses-2025-02-18.jsonl
    └── ...
```

## Endpoints de API

### POST /api/track
Salva eventos gerais (page_view, step_completed, email_captured)

### POST /api/track/analysis
Salva análises completas com todos os dados do formulário e resultados

## Implementação

### Client-side (lib/tracking.ts)
Funções helper para trackear eventos:
- `trackPageView(page)` - Trackea visualização de página
- `trackStepCompleted(step)` - Trackea conclusão de step
- `trackAnalysisSubmission(data)` - Salva análise completa
- `trackEmailCapture(email, name)` - Trackea captura de email

### Session ID
Cada usuário recebe um `sessionId` único gerado no primeiro acesso e persistido em `sessionStorage`. Permite correlacionar eventos da mesma sessão.

## Privacidade e LGPD

- Dados são salvos localmente no servidor (pasta `data/`)
- Não são compartilhados com terceiros
- Email/nome só são salvos se o usuário optar por fornecer no modal
- `sessionId` é temporário (limpa ao fechar navegador)
- Dados não contêm informações pessoais sensíveis

## Migração Futura

Estrutura pronta para migrar para banco de dados:
- **Supabase**: Tabelas `events` e `analyses`
- **PostgreSQL**: Schema SQL disponível
- **MongoDB**: Documentos JSON nativos

## Análise de Dados

### Métricas Importantes

1. **Conversão por Step**
   - Quantos usuários completam cada step?
   - Onde desistem mais?

2. **Scores Médios**
   - Distribuição de scores (0-40)
   - Classificações mais comuns

3. **Stacks Tecnológicas**
   - Tecnologias mais escolhidas
   - Combinações comuns

4. **Taxa de Captura de Email**
   - % de usuários que fornecem email
   - Momento da captura (antes/depois dos resultados)

### Scripts de Análise (TODO)

```bash
# Contar análises por dia
cat data/analyses/analyses-2025-02-*.jsonl | wc -l

# Ver scores médios
jq -s '[.[].analysis.scores.total] | add/length' data/analyses/analyses-2025-02-17.jsonl

# Tecnologias mais usadas
jq -r '.formData.techStack[]' data/analyses/*.json | sort | uniq -c | sort -nr

# Taxa de captura de email
jq -s '[.[] | select(.userEmail != null)] | length' data/analyses/*.json
```

## Backup

**IMPORTANTE**: Fazer backup regular da pasta `data/`

Sugestões:
- Backup diário automatizado
- Enviar para S3/Google Cloud Storage
- Manter histórico de 90 dias
- Comprimir arquivos antigos (.jsonl.gz)

## Monitoramento

Métricas a monitorar:
- [ ] Número de análises por dia
- [ ] Taxa de conclusão (quantos chegam no step 4)
- [ ] Score médio por período
- [ ] Taxa de captura de email
- [ ] Tecnologias mais populares
- [ ] Erros na API de análise
