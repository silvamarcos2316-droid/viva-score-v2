# Quick Start Guide - WhatsApp/n8n Integration

## 🚀 Setup em 30 Minutos

Este guia vai te ajudar a configurar tudo rapidamente amanhã. Siga na ordem!

---

## ✅ Pré-requisitos

Antes de começar, tenha em mãos:

- [ ] Conta Supabase (gratuita)
- [ ] Conta n8n (cloud ou self-hosted)
- [ ] WhatsApp Business API ou Evolution API
- [ ] Acesso ao projeto no Vercel

---

## 📋 Passo 1: Configurar Supabase (10 min)

### 1.1 Criar Banco de Dados

1. Abra o Supabase Dashboard
2. Vá em **SQL Editor**
3. Cole o conteúdo do arquivo `supabase-setup.sql`
4. Execute (Run)
5. Verifique que as tabelas foram criadas:
   - `leads`
   - `analyses`
   - `whatsapp_messages`

### 1.2 Copiar Credenciais

1. Vá em **Settings** → **API**
2. Copie:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon/public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` → `SUPABASE_SERVICE_ROLE_KEY`

### 1.3 Gerar Webhook Secret

```bash
# No terminal/Git Bash:
openssl rand -base64 32
```

Salve o resultado como `SUPABASE_WEBHOOK_SECRET`

---

## 📋 Passo 2: Configurar Vercel (5 min)

### 2.1 Adicionar Variáveis de Ambiente

Vá em **Vercel Dashboard** → **Settings** → **Environment Variables**

Adicione:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
SUPABASE_WEBHOOK_SECRET=<o-secret-que-você-gerou>

# n8n (deixe vazio por enquanto, vamos preencher no Passo 4)
N8N_WEBHOOK_URL=
N8N_WEBHOOK_URL_LEAD=
N8N_API_KEY=

# Admin API (gere novos secrets)
WEBHOOK_API_KEY=<gere-com-openssl-rand-base64-32>
ADMIN_API_KEY=<gere-com-openssl-rand-base64-32>
```

### 2.2 Deploy

```bash
# Na pasta do projeto:
vercel --prod
```

Ou use o auto-deploy do GitHub (se configurado).

---

## 📋 Passo 3: Configurar Webhooks do Supabase (5 min)

### 3.1 Webhook: New Lead

1. Vá em **Supabase Dashboard** → **Database** → **Webhooks**
2. Clique em **Create a new hook**
3. Configure:
   - **Name:** `prisma-new-lead`
   - **Table:** `public.leads`
   - **Events:** ☑ INSERT
   - **Type:** HTTP Request
   - **Method:** POST
   - **URL:** `https://prisma-score.vercel.app/api/webhooks/new-lead`
   - **HTTP Headers:**
     ```
     Content-Type: application/json
     x-webhook-signature: <seu-SUPABASE_WEBHOOK_SECRET>
     ```
4. **Create webhook**

### 3.2 Webhook: New Analysis

Repita o processo:

- **Name:** `prisma-new-analysis`
- **Table:** `public.analyses`
- **Events:** ☑ INSERT
- **URL:** `https://prisma-score.vercel.app/api/webhooks/new-analysis`
- **HTTP Headers:** (mesmos do anterior)

### 3.3 Testar Webhooks

```bash
# No Git Bash:
bash test-webhooks.sh
```

Ou teste manualmente com curl (veja exemplos no `test-webhooks.sh`).

---

## 📋 Passo 4: Configurar n8n (10 min)

### 4.1 Criar Workflow: Lead Welcome

1. Abra o n8n
2. **New Workflow** → Nome: "PRISMA - Welcome Message"
3. Adicione nós:

   **Nó 1: Webhook**
   - Path: `prisma-lead`
   - Authentication: None

   **Nó 2: WhatsApp (Evolution API ou WAPI)**
   - To: `{{ $json.whatsapp_message.phone }}`
   - Message: `{{ $json.whatsapp_message.message }}`

4. **Activate** workflow
5. Copie a URL do webhook: `https://your-n8n.com/webhook/prisma-lead`

### 4.2 Criar Workflow: Analysis Results

1. **New Workflow** → Nome: "PRISMA - Analysis Results"
2. Adicione nós:

   **Nó 1: Webhook**
   - Path: `prisma-analysis`

   **Nó 2: WhatsApp**
   - To: `{{ $json.whatsapp_message.phone }}`
   - Message: `{{ $json.whatsapp_message.message }}`

3. **Activate** workflow
4. Copie a URL: `https://your-n8n.com/webhook/prisma-analysis`

### 4.3 Gerar API Key para n8n

```bash
openssl rand -base64 32
```

Salve como `N8N_API_KEY`.

### 4.4 Atualizar Vercel com URLs do n8n

Vá em **Vercel** → **Settings** → **Environment Variables**

Atualize:
```bash
N8N_WEBHOOK_URL=https://your-n8n.com/webhook/prisma-analysis
N8N_WEBHOOK_URL_LEAD=https://your-n8n.com/webhook/prisma-lead
N8N_API_KEY=<o-api-key-que-você-gerou>
```

**Redeploy** o projeto Vercel.

---

## 📋 Passo 5: Testar End-to-End (5 min)

### 5.1 Teste Manual com curl

```bash
bash test-webhooks.sh
```

Verifique:
- ✅ Health checks passando
- ✅ Webhooks recebendo payloads
- ✅ n8n recebendo notificações

### 5.2 Teste com Formulário Real

1. Abra `https://prisma-score.vercel.app`
2. Preencha o formulário com SEU número de WhatsApp
3. Complete a análise
4. Aguarde:
   - **Mensagem 1** (welcome): deve chegar em ~30 segundos
   - **Mensagem 2** (analysis): deve chegar em ~3-5 minutos

### 5.3 Verificar Logs

- **Vercel:** `vercel logs --follow`
- **Supabase:** Database → Webhooks → Logs
- **n8n:** Executions tab

---

## ⚠️ Troubleshooting Rápido

### Webhook não dispara

```sql
-- Verifique que as triggers estão ativas no Supabase
SELECT * FROM pg_trigger WHERE tgname LIKE '%webhook%';
```

Se vazio, recrie os webhooks no Dashboard.

### n8n não recebe dados

1. Teste o webhook do n8n diretamente:
```bash
curl -X POST https://your-n8n.com/webhook/prisma-lead \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

2. Verifique se o workflow está ATIVO (não pausado)

### WhatsApp não envia

1. Verifique credenciais da API do WhatsApp no n8n
2. Confirme formato do telefone: `55119999887766` (com país)
3. Teste envio manual no n8n

### Erro 401 nos webhooks

Verifique que `SUPABASE_WEBHOOK_SECRET` é o MESMO no:
- Supabase webhook headers
- Vercel env variables

---

## 📊 Monitoramento

Depois de configurar, monitore:

### Dashboard Supabase

```sql
-- Leads capturados hoje
SELECT COUNT(*) FROM leads WHERE created_at > CURRENT_DATE;

-- Análises por classificação
SELECT classification, COUNT(*)
FROM analyses
GROUP BY classification;

-- Mensagens enviadas
SELECT
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE whatsapp_message_sent) as sent
FROM analyses
WHERE created_at > CURRENT_DATE;
```

### Dashboard n8n

- Total de executions (deve ser ~2x número de leads)
- Success rate (deve ser >95%)
- Average execution time

---

## 🎯 Próximos Passos (após setup básico)

Uma vez que tudo estiver funcionando:

### Curto Prazo (hoje/amanhã)
- [ ] Configurar follow-ups automáticos (24h, 48h)
- [ ] Criar comunidade no WhatsApp
- [ ] Testar com 5-10 leads reais

### Médio Prazo (esta semana)
- [ ] Implementar respostas automáticas (keywords)
- [ ] Configurar notificações para time
- [ ] A/B test de mensagens

### Longo Prazo (próximas semanas)
- [ ] Dashboard de analytics
- [ ] Integração com CRM
- [ ] Chatbot para perguntas frequentes

---

## 📚 Documentação Completa

Para referência detalhada:

- **Integração técnica:** `N8N-INTEGRATION.md`
- **Fluxo de mensagens:** `WHATSAPP-FLOW.md`
- **Setup do banco:** `supabase-setup.sql`
- **Testes:** `test-webhooks.sh`

---

## 🆘 Ajuda Rápida

### Comandos Úteis

```bash
# Ver logs do Vercel em tempo real
vercel logs --follow

# Testar webhooks
bash test-webhooks.sh

# Verificar env vars no Vercel
vercel env pull

# Rodar projeto localmente
npm run dev
```

### Arquivos Importantes

```
viva-score-v2/
├── app/api/
│   ├── webhooks/
│   │   ├── new-lead/route.ts          # Webhook lead
│   │   └── new-analysis/route.ts      # Webhook análise
│   └── admin/
│       ├── analyses/route.ts          # API admin
│       └── stats/route.ts             # Estatísticas
├── lib/
│   ├── webhook-security.ts            # Segurança
│   └── whatsapp-templates.ts          # Templates de mensagem
├── supabase-setup.sql                 # Setup DB
├── test-webhooks.sh                   # Testes
├── N8N-INTEGRATION.md                 # Doc completa
└── WHATSAPP-FLOW.md                   # Fluxo completo
```

---

## ✅ Checklist Final

Antes de considerar pronto:

- [ ] Supabase DB criado e populado
- [ ] Webhooks do Supabase configurados
- [ ] Env vars no Vercel configuradas
- [ ] n8n workflows criados e ativos
- [ ] WhatsApp API conectado ao n8n
- [ ] Teste end-to-end funcionando
- [ ] Recebeu mensagens de teste no WhatsApp
- [ ] Logs monitorados e sem erros

---

**Tempo estimado total: 30-40 minutos**

**Boa sorte! 🚀**

Se algo der errado, consulte `N8N-INTEGRATION.md` (seção Troubleshooting) ou `WHATSAPP-FLOW.md` (para ajustar mensagens).
