# PRISMA Score - WhatsApp/n8n Integration

## 📁 Arquivos de Integração

Este diretório contém toda a infraestrutura necessária para integração WhatsApp/n8n do PRISMA Score.

---

## 🗂️ Estrutura de Arquivos

### 📄 Documentação

| Arquivo | Descrição |
|---------|-----------|
| `QUICK-START.md` | **COMECE AQUI** - Setup em 30 minutos |
| `N8N-INTEGRATION.md` | Documentação técnica completa da integração |
| `WHATSAPP-FLOW.md` | Fluxo completo de mensagens e jornada do usuário |
| `INTEGRATION-README.md` | Este arquivo - índice geral |

### 🛠️ Arquivos Técnicos

| Arquivo | Descrição |
|---------|-----------|
| `supabase-setup.sql` | Script SQL para criar banco de dados |
| `test-webhooks.sh` | Script de testes para todos os endpoints |
| `.env.example` | Template de variáveis de ambiente |

### 💻 Código Fonte

| Arquivo/Pasta | Descrição |
|---------------|-----------|
| `app/api/webhooks/new-lead/` | Webhook para novos leads capturados |
| `app/api/webhooks/new-analysis/` | Webhook para análises completas |
| `app/api/admin/analyses/` | API admin para listar análises |
| `app/api/admin/stats/` | API admin para estatísticas |
| `lib/webhook-security.ts` | Utilitários de segurança (assinatura, API keys, rate limiting) |
| `lib/whatsapp-templates.ts` | Templates de mensagens WhatsApp personalizadas |

---

## 🚀 Como Começar

### Opção 1: Setup Rápido (Recomendado)

```bash
# Leia o guia rápido
cat QUICK-START.md

# Siga os 5 passos em ordem
```

**Tempo estimado:** 30-40 minutos

### Opção 2: Setup Detalhado

```bash
# Para entender cada detalhe da integração
cat N8N-INTEGRATION.md
```

**Tempo estimado:** 1-2 horas (com testes e otimizações)

---

## 📊 Fluxo de Dados

```
┌──────────────────┐
│  User preenche   │
│    formulário    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Supabase DB    │
│  INSERT trigger  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Webhook Handler  │
│ (Vercel Edge)    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   n8n Workflow   │
│  (Automation)    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  WhatsApp API    │
│  (Message send)  │
└──────────────────┘
```

---

## 🔑 Endpoints Disponíveis

### Webhooks (Recebem do Supabase)

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/webhooks/new-lead` | POST | Recebe notificação de novo lead |
| `/api/webhooks/new-analysis` | POST | Recebe notificação de análise completa |

### Admin APIs (Usados pelo n8n)

| Endpoint | Método | Auth | Descrição |
|----------|--------|------|-----------|
| `/api/admin/analyses` | GET | API Key | Lista análises com filtros |
| `/api/admin/stats` | GET | API Key | Estatísticas agregadas |

### Health Checks

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/webhooks/new-lead` | GET | Health check do webhook |
| `/api/webhooks/new-analysis` | GET | Health check do webhook |
| `/api/admin/analyses` | HEAD | Health check do admin API |
| `/api/admin/stats` | HEAD | Health check do admin API |

---

## 🔐 Segurança

### Implementado

✅ **Assinatura de Webhooks (HMAC-SHA256)**
- Verifica autenticidade dos webhooks do Supabase
- Previne replay attacks

✅ **API Key Authentication**
- Protege endpoints admin
- Suporta múltiplas chaves (n8n, admin, webhook)

✅ **Rate Limiting**
- 20 requisições/segundo por IP
- Token bucket algorithm
- Cleanup automático de buckets antigos

✅ **Input Validation (Zod)**
- Valida todos os payloads de webhook
- Schemas tipados para TypeScript

✅ **Row Level Security (RLS)**
- Políticas no Supabase
- Leads podem ser inseridos por usuários anônimos
- Análises requerem service role
- Leitura requer autenticação

### Variáveis de Ambiente Sensíveis

```bash
SUPABASE_SERVICE_ROLE_KEY=xxx  # Nunca exponha ao cliente
SUPABASE_WEBHOOK_SECRET=xxx    # Usado para verificar assinaturas
N8N_API_KEY=xxx               # API key para n8n chamar admin APIs
ADMIN_API_KEY=xxx             # API key para outros serviços
WEBHOOK_API_KEY=xxx           # API key adicional
```

**⚠️ NUNCA commite estes valores no Git!**

---

## 📱 Templates de Mensagens WhatsApp

### 4 Tiers de Mensagens (baseado no score)

1. **Alta Viabilidade (36-40 pontos)**
   - Celebração + Destaque dos pontos fortes
   - CTA: Agendar consulta estratégica
   - Tom: Entusiasmado e confiante

2. **Alto Potencial (26-35 pontos)**
   - Validação + Oportunidades de melhoria
   - CTA: Ajuda para maximizar potencial
   - Tom: Encorajador e construtivo

3. **Potencial Moderado (16-25 pontos)**
   - Análise honesta + Refinamento necessário
   - CTA: Sessão de refinamento estratégico
   - Tom: Honesto e educativo

4. **Baixa Viabilidade (0-15 pontos)**
   - Feedback sincero + Redirecionamento
   - CTA: Discovery workshop
   - Tom: Honesto mas respeitoso

Veja detalhes completos em `WHATSAPP-FLOW.md`.

---

## 🧪 Testes

### Testes Automatizados

```bash
# Executar suite completa de testes
bash test-webhooks.sh
```

Testa:
- ✅ Health checks de todos os endpoints
- ✅ Webhooks com payloads válidos
- ✅ Admin APIs com autenticação
- ✅ Rejeição de requisições não autorizadas
- ✅ Rate limiting

### Testes Manuais

```bash
# Webhook de novo lead
curl -X POST https://prisma-score.vercel.app/api/webhooks/new-lead \
  -H "Content-Type: application/json" \
  -H "x-webhook-signature: YOUR_SECRET" \
  -d @test-payloads/lead.json

# Admin API
curl -X GET https://prisma-score.vercel.app/api/admin/analyses \
  -H "x-api-key: YOUR_API_KEY"
```

Payloads de exemplo estão em `test-webhooks.sh`.

---

## 📈 Monitoramento

### Métricas Importantes

**Taxas de Entrega:**
- Welcome message delivery rate: alvo 98%+
- Analysis message delivery rate: alvo 98%+

**Engagement:**
- Initial response rate (24h): alvo 30-50%
- Follow-up response rate: alvo 15-30%
- Consultation booking rate: alvo 10-20%

**Performance:**
- Webhook processing time: <500ms
- n8n to WhatsApp send time: <2s
- Total lead-to-message time: <30s

### Onde Monitorar

1. **Vercel Logs**
   ```bash
   vercel logs --follow
   ```

2. **Supabase Dashboard**
   - Database → Webhooks → Logs
   - Database → Run SQL (queries customizadas)

3. **n8n Dashboard**
   - Executions tab
   - Error tracking
   - Execution time analytics

### Queries Úteis

```sql
-- Conversão geral
SELECT * FROM get_conversion_metrics(30);

-- Leads de alto potencial sem resposta
SELECT * FROM get_high_potential_leads(7);

-- Estatísticas por classificação
SELECT classification, COUNT(*), AVG(score_total)
FROM analyses
GROUP BY classification;
```

---

## 🐛 Troubleshooting Comum

### Problema: Webhook não dispara

**Causa provável:** Trigger do Supabase não configurado

**Solução:**
```sql
-- Verificar triggers
SELECT * FROM pg_trigger WHERE tgname LIKE '%webhook%';

-- Se vazio, recrie os webhooks no Dashboard
```

### Problema: n8n não recebe payload

**Causa provável:** URL do webhook incorreta ou workflow inativo

**Solução:**
1. Verifique URL em `N8N_WEBHOOK_URL`
2. Confirme que workflow está ATIVO
3. Teste diretamente: `curl -X POST [n8n-webhook-url] -d '{"test": "data"}'`

### Problema: WhatsApp não envia mensagem

**Causa provável:** Formato de telefone incorreto ou credenciais inválidas

**Solução:**
1. Verifique formato: `5511999887766` (país + DDD + número)
2. Teste função `formatPhoneForWhatsApp()` em `lib/whatsapp-templates.ts`
3. Confirme credenciais do WhatsApp API no n8n

### Problema: Rate limit atingido

**Causa provável:** Muitos webhooks disparando rapidamente

**Solução:**
```typescript
// Ajustar limites em lib/webhook-security.ts
export const webhookRateLimiter = new RateLimiter(
  40, // maxTokens (aumente se necessário)
  5   // refillRate (tokens por segundo)
)
```

---

## 🔄 Fluxos de Follow-up

### Automações Recomendadas

| Quando | Quem | Ação |
|--------|------|------|
| T+24h | Score 36-40 | Follow-up agressivo + convite grupo |
| T+48h | Score 26-35 | Follow-up moderado + recursos |
| T+48h | Score 16-25 | Checklist personalizado |
| T+7d | Score 0-15 | Conteúdo educativo |
| T+7d | Sem resposta (qualquer score) | Last touch |

Veja fluxo completo em `WHATSAPP-FLOW.md`.

---

## 📦 Dependências

### NPM Packages Necessários

```json
{
  "@supabase/supabase-js": "^2.x",  // Cliente Supabase
  "zod": "^4.x",                     // Validação de schemas
  "next": "^16.x",                   // Framework Next.js
  "@anthropic-ai/sdk": "^0.74.0"     // Claude API (já instalado)
}
```

### Serviços Externos

- **Supabase** (PostgreSQL + Webhooks)
- **n8n** (Workflow automation)
- **WhatsApp Business API** ou **Evolution API**
- **Vercel** (Edge functions hosting)

---

## 🌟 Próximas Melhorias

### Curto Prazo
- [ ] Implementar Supabase client real (atualmente placeholder)
- [ ] Adicionar queries SQL para admin APIs
- [ ] Configurar Upstash Redis para rate limiting distribuído
- [ ] Adicionar testes unitários (Jest)

### Médio Prazo
- [ ] Dashboard web para visualizar métricas
- [ ] Notificações em tempo real (WebSockets)
- [ ] A/B testing de mensagens
- [ ] Chatbot para respostas automáticas

### Longo Prazo
- [ ] Multi-language support
- [ ] WhatsApp Flows integration
- [ ] Voice message analysis delivery
- [ ] Payment via WhatsApp
- [ ] CRM integration

---

## 📞 Suporte

### Documentação

- 📖 **Setup Rápido:** `QUICK-START.md`
- 🔧 **Integração Técnica:** `N8N-INTEGRATION.md`
- 💬 **Fluxo de Mensagens:** `WHATSAPP-FLOW.md`
- 🗃️ **Setup do Banco:** `supabase-setup.sql`

### Arquivos de Código

- **Webhooks:** `app/api/webhooks/*/route.ts`
- **Admin APIs:** `app/api/admin/*/route.ts`
- **Segurança:** `lib/webhook-security.ts`
- **Templates:** `lib/whatsapp-templates.ts`

### Ferramentas

- **Testes:** `bash test-webhooks.sh`
- **Logs:** `vercel logs --follow`
- **Env vars:** `vercel env pull`

---

## ✅ Checklist de Implementação

### Fase 1: Infraestrutura Base
- [x] Criar estrutura de tabelas Supabase
- [x] Implementar webhooks Vercel
- [x] Adicionar segurança (assinaturas, API keys)
- [x] Criar templates de mensagens WhatsApp
- [x] Escrever documentação completa

### Fase 2: Integração n8n (Amanhã)
- [ ] Configurar banco Supabase
- [ ] Criar webhooks do Supabase
- [ ] Configurar workflows n8n
- [ ] Conectar WhatsApp API
- [ ] Testar end-to-end

### Fase 3: Otimização
- [ ] Implementar follow-ups automáticos
- [ ] Criar comunidade WhatsApp
- [ ] Configurar analytics
- [ ] A/B test mensagens
- [ ] Monitorar conversões

---

**Última atualização:** 2026-02-18
**Versão:** 1.0
**Status:** ✅ Pronto para implementação

**Desenvolvido por:** Aria (@architect) - AIOS
**Projeto:** PRISMA Score - WhatsApp Integration
