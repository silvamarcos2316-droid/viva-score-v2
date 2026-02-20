# PRISMA Conversational Agent

## Overview

Implementação de agente conversacional usando Claude API com structured extraction (tool use) para substituir o formulário multi-etapas tradicional do PRISMA Score.

## Motivação

**Feedback recebido:**
- **Paulo Soares**: "Por que usar PRISMA em vez de ChatGPT/Gemini?"
- **Manassés**: "Você está vendendo IA e usando um forms"

**Decisão:** Implementar Option 2 - Agente conversacional estruturado que extrai dados durante conversa natural.

## Arquitetura

### Componentes Criados

1. **`/app/api/chat/route.ts`**
   - Edge Runtime API route
   - Usa Claude Sonnet 4 com tool use
   - Tool: `extract_project_data` - extrai dados estruturados durante conversa
   - Salva leads automaticamente quando info de contato é coletada
   - Calcula progresso (0-100%) baseado em campos preenchidos
   - Detecta quando conversa está completa e aciona análise

2. **`/components/ChatAgent.tsx`**
   - Componente React de interface de chat
   - Exibe mensagens do usuário e assistente com avatares
   - Barra de progresso dinâmica (0-100%)
   - Input com suporte a Enter/Shift+Enter
   - Loading states (digitando, gerando diagnóstico)
   - Error handling
   - Auto-scroll para novas mensagens
   - Tracking de eventos (lead capture, analysis submission)

3. **`/app/calculadora-chat/page.tsx`**
   - Página full-screen para interface conversacional
   - Layout otimizado para chat (header + chat + footer)
   - Background com grid sutil
   - Tracking de page view

### Fluxo de Dados

```
User → ChatAgent → /api/chat → Claude API (tool use) → extract_project_data
                       ↓
                  FormData update
                       ↓
                  Progress calculation
                       ↓
         (when complete) → /api/analyze → AnalysisResult → /results
```

### Dados Coletados

**Framework V.I.V.A. (11 campos):**
1. `fullName` - Nome completo (min 3 chars)
2. `email` - Email profissional (validado)
3. `phone` - Telefone brasileiro (min 10 dígitos)
4. `company` - Empresa (opcional)
5. `projectName` - Nome do projeto (min 3 chars)
6. `problemStatement` - Descrição do problema (min 50 chars)
7. `techStack` - Array de tecnologias (min 1 item)
8. `integrationNeeds` - Necessidades de integração (min 30 chars)
9. `budgetRange` - Faixa de orçamento mensal
10. `roiExpectation` - Expectativa de ROI (min 30 chars)
11. `timeline` - Prazo para MVP
12. `blockers` - Bloqueadores identificados (min 20 chars)

**Progresso:** Calculado como `(campos_preenchidos / 11) * 100`

## Personalidade do Agente

**Nome:** PRISMA

**Tom:**
- Profissional mas acessível
- Consultivo e empático
- Curioso e engajado
- Direto ao ponto (não prolixo)
- Linguagem brasileira natural

**Estratégia de Conversa:**
1. Abertura calorosa + explicação breve
2. Coleta de contato (SEMPRE PRIMEIRO) com validação
3. Dimensão 1: VISÃO - problema, usuários, dor principal
4. Dimensão 2: INTEGRAÇÃO - tech stack, sistemas, APIs
5. Dimensão 3: VIABILIDADE - orçamento, ROI esperado
6. Dimensão 4: EXECUÇÃO - timeline, equipe, obstáculos

**Regras:**
- Uma dimensão por vez (não sobrecarregar)
- Perguntas específicas com exemplos
- Follow-up quando resposta vaga
- Extração incremental (não pedir tudo de uma vez)
- Nunca perguntar novamente campos já preenchidos

## Integração com Landing Page

**Mudanças em `/app/page.tsx`:**

1. **Hero Section (Path 2: PRISMA Full)**
   - Botão primário: "💬 Conversar com IA" → `/calculadora-chat`
   - Botão secundário: "Usar formulário tradicional" → `/calculator`
   - Label: "Recomendado • Mais natural"

2. **Final CTA**
   - Botão primário: "💬 Conversar com IA" → `/calculadora-chat`
   - Botão secundário: "Usar formulário" → `/calculator`
   - Texto: "✨ Novo: Converse naturalmente com nosso assistente de IA"

## Features Implementadas

✅ Conversação natural com Claude Sonnet 4
✅ Extração estruturada incremental (tool use)
✅ Validação de campos em tempo real
✅ Progresso dinâmico (0-100%)
✅ Salvamento automático de leads no Supabase
✅ Tracking de eventos (lead capture, analysis)
✅ Detecção automática de completude
✅ Geração automática de PRISMA Score ao finalizar
✅ Navegação para página de resultados
✅ Error handling e retry
✅ UI responsiva e acessível
✅ Loading states claros

## Tracking de Eventos

**Eventos trackados:**
1. `page_view` - `/calculadora-chat` visitada
2. `email_captured` - Lead salvo com sucesso
3. `analysis_submission` - Diagnóstico completo gerado

**Conformidade:**
- Respeita consent do usuário (ConsentBanner)
- Só faz tracking após aceite

## Vantagens vs Formulário

| Aspecto | Formulário | Conversacional |
|---------|-----------|----------------|
| Experiência | Mecânica, burocrática | Natural, fluida |
| Contexto | Zero (perguntas isoladas) | Rico (follow-ups, exemplos) |
| Validação | Apenas formato | Semântica + formato |
| Progressão | Linear rígida | Adaptativa |
| Feedback | Passivo | Ativo e engajado |
| Abandono | Alto (5 steps) | Menor (conversa) |
| Alinhamento com brand | ❌ "Vendendo IA, usando forms" | ✅ "IA de ponta a ponta" |

## Resposta à Objeção de Paulo

**Objeção:** "Por que usar PRISMA em vez de ChatGPT?"

**Resposta implementada (landing page):**

Nova seção "Por Que PRISMA vs ChatGPT?" com grid comparativo:

| ChatGPT/Gemini | PRISMA |
|----------------|--------|
| ❌ Opiniões genéricas | ✅ Framework validado (150+ projetos) |
| ❌ Score inconsistente | ✅ Score 0-40 objetivo e comparável |
| ❌ Sem benchmarking | ✅ Benchmarking implícito vs mercado BR |
| ❌ Conversa se perde | ✅ Relatório executivo apresentável |
| ❌ Análise pontual | ✅ Plataforma evolutiva com histórico |

## Próximos Passos

**Melhorias futuras:**
1. A/B testing: Conversacional vs Formulário
2. Memory entre sessões (retomar conversa)
3. Sugestões automáticas de respostas
4. Voice input/output
5. Exportar conversa completa com diagnóstico
6. Multi-idioma (EN/ES)
7. Personalização do agente por segmento de cliente

**Otimizações:**
1. Streaming de respostas (SSE)
2. Caching de conversas parciais
3. Pre-loading da análise durante conversa
4. Lazy loading de componentes

## Deploy Checklist

- [x] Criar API route `/api/chat`
- [x] Criar componente `ChatAgent`
- [x] Criar página `/calculadora-chat`
- [x] Atualizar landing page CTAs
- [x] Adicionar tracking de eventos
- [x] Integrar com Supabase (lead saving)
- [x] Integrar com análise existente
- [x] Criar documentação
- [ ] Configurar variáveis de ambiente no Vercel (ANTHROPIC_API_KEY)
- [ ] Testar em produção
- [ ] Monitorar métricas de conversão

## Variáveis de Ambiente Necessárias

```bash
# Já existentes (necessárias)
ANTHROPIC_API_KEY=sk-ant-api03-...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Opcionais (webhooks)
N8N_WEBHOOK_URL=...
N8N_WEBHOOK_URL_LEAD=...
```

## Métricas de Sucesso

**KPIs para monitorar:**
1. Taxa de conversão (início → completude)
2. Tempo médio de conversa
3. Número médio de mensagens
4. Taxa de abandono por etapa
5. Satisfação do usuário (NPS)
6. Comparação conversacional vs formulário

---

**Data de implementação:** 20/02/2026
**Implementado por:** Marcos + Claude Code
**Status:** ✅ Pronto para deploy e testes
