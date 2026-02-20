# Guia de Configuração - Variáveis de Ambiente Vercel

**Data:** 20/02/2026
**Status:** 📋 GUIA PASSO A PASSO
**Prioridade:** ALTA (App não funciona completamente sem essas variáveis)

---

## 🎯 Objetivo

Configurar todas as variáveis de ambiente necessárias no Vercel para o PRISMA Score funcionar completamente.

---

## 📊 Variáveis Detectadas no Código

### ✅ CRÍTICAS (Obrigatórias)

Sem essas variáveis, o app **não funciona** ou mostra warnings:

```bash
ANTHROPIC_API_KEY=sk-ant-api03-...
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Usadas em:**
- `lib/anthropic.ts` - ANTHROPIC_API_KEY
- `app/api/chat/route.ts` - ANTHROPIC_API_KEY
- `lib/supabase.ts` - Todas as variáveis Supabase

---

### ⚠️ OPCIONAIS (Recursos Avançados)

App funciona sem, mas funcionalidades limitadas:

```bash
# n8n Webhooks (Integrações WhatsApp)
N8N_WEBHOOK_URL_LEAD=https://...n8n.cloud/webhook/...
N8N_WEBHOOK_URL=https://...n8n.cloud/webhook/...

# Segurança de Webhooks
SUPABASE_WEBHOOK_SECRET=seu-secret-aqui
N8N_API_KEY=seu-api-key-aqui
WEBHOOK_API_KEY=seu-webhook-key-aqui
ADMIN_API_KEY=seu-admin-key-aqui
```

**Usadas em:**
- `app/api/webhooks/new-lead/route.ts` - N8N_WEBHOOK_URL_LEAD, SUPABASE_WEBHOOK_SECRET
- `app/api/webhooks/new-analysis/route.ts` - N8N_WEBHOOK_URL, SUPABASE_WEBHOOK_SECRET
- `lib/webhook-security.ts` - N8N_API_KEY, WEBHOOK_API_KEY, ADMIN_API_KEY

---

## 🔑 Onde Encontrar Cada Chave

### 1. ANTHROPIC_API_KEY

**Onde obter:**
1. Acessar: https://console.anthropic.com/settings/keys
2. Clicar em "Create Key"
3. Nome: "PRISMA Production"
4. Copiar a chave (começa com `sk-ant-api03-...`)

**Formato:**
```
sk-ant-api03-AbCdEfGh1234567890_aBcDeFgHiJkLmNoPqRsTuVwXyZ...
```
(~95 caracteres)

---

### 2. NEXT_PUBLIC_SUPABASE_URL

**Onde obter:**
1. Acessar: https://supabase.com/dashboard/project/[seu-projeto]
2. Settings → API
3. Copiar "Project URL"

**Formato:**
```
https://abcdefghijklmnop.supabase.co
```

---

### 3. NEXT_PUBLIC_SUPABASE_ANON_KEY

**Onde obter:**
1. Mesma página: https://supabase.com/dashboard/project/[seu-projeto]/settings/api
2. Copiar "anon public" key

**Formato:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhdmV...
```
(JWT token longo, ~300+ caracteres)

**⚠️ IMPORTANTE:** Esta chave é PÚBLICA (pode ser exposta no client).

---

### 4. SUPABASE_SERVICE_ROLE_KEY

**Onde obter:**
1. Mesma página: https://supabase.com/dashboard/project/[seu-projeto]/settings/api
2. Copiar "service_role secret" key
3. **⚠️ CUIDADO:** Esta chave tem poderes de admin!

**Formato:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhdmV...
```
(JWT token longo, similar ao anon key mas com mais permissões)

**🔒 SEGURANÇA:** NUNCA exponha essa chave no client! Só no servidor/Vercel.

---

### 5. N8N_WEBHOOK_URL_LEAD (Opcional)

**Onde obter:**
1. Acessar seu workspace n8n: https://app.n8n.cloud
2. Criar workflow: "New Lead Notification"
3. Adicionar nó "Webhook"
4. Copiar URL do webhook

**Formato:**
```
https://[seu-workspace].app.n8n.cloud/webhook/[id-do-webhook]
```

**Usado para:** Notificar no WhatsApp quando novo lead é capturado.

---

### 6. N8N_WEBHOOK_URL (Opcional)

**Onde obter:**
1. Mesmo processo do N8N_WEBHOOK_URL_LEAD
2. Criar workflow diferente: "Analysis Complete Notification"
3. Copiar URL

**Usado para:** Notificar quando análise completa é gerada.

---

### 7. SUPABASE_WEBHOOK_SECRET (Opcional)

**Onde obter:**
1. Você define esse secret
2. Gerar um token aleatório seguro:

```bash
# No terminal
openssl rand -hex 32
```

Ou usar: https://generate-secret.vercel.app/32

**Formato:**
```
abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```
(64 caracteres hexadecimais)

**Usado para:** Validar que webhooks realmente vêm do Supabase.

---

### 8. N8N_API_KEY, WEBHOOK_API_KEY, ADMIN_API_KEY (Opcional)

**Onde obter:**
1. Você define esses secrets (mesma lógica do SUPABASE_WEBHOOK_SECRET)
2. Gerar tokens aleatórios:

```bash
openssl rand -hex 32  # Para cada um
```

**Usado para:** Camada adicional de segurança nos webhooks.

---

## 🚀 Passo a Passo - Configurar no Vercel

### Método 1: Via Dashboard (Recomendado)

1. **Acessar Settings:**
   https://vercel.com/marcos-moraes-da-silvas-projects/viva-score-v2/settings/environment-variables

2. **Para cada variável:**
   - Clicar em "Add New"
   - **Key:** Nome da variável (ex: `ANTHROPIC_API_KEY`)
   - **Value:** Valor da chave
   - **Environments:** Selecionar TODOS (Production, Preview, Development)
   - Clicar "Save"

3. **Repetir para todas as variáveis críticas**

4. **Redeploy:**
   - Voltar para aba "Deployments"
   - Clicar em "..." no último deployment
   - "Redeploy"

---

### Método 2: Via CLI (Avançado)

```bash
# Instalar Vercel CLI (se não tiver)
npm install -g vercel

# Login
vercel login

# Link ao projeto
cd viva-mvp/viva-score-v2
vercel link

# Adicionar variáveis (uma por vez)
vercel env add ANTHROPIC_API_KEY production
# Cole o valor quando solicitar
# Repita para preview e development

# Ou usando arquivo
vercel env pull .env.production
# Edite o arquivo e depois:
vercel env push .env.production
```

---

## ✅ Checklist de Configuração

### Variáveis Críticas (OBRIGATÓRIAS):
- [ ] `ANTHROPIC_API_KEY` - Configurada
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Configurada
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Configurada
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Configurada

### Variáveis Opcionais:
- [ ] `N8N_WEBHOOK_URL_LEAD` - Configurada (ou skip)
- [ ] `N8N_WEBHOOK_URL` - Configurada (ou skip)
- [ ] `SUPABASE_WEBHOOK_SECRET` - Configurada (ou skip)
- [ ] `N8N_API_KEY` - Configurada (ou skip)
- [ ] `WEBHOOK_API_KEY` - Configurada (ou skip)
- [ ] `ADMIN_API_KEY` - Configurada (ou skip)

### Após Configurar:
- [ ] Redeploy no Vercel
- [ ] Aguardar build (1-3 min)
- [ ] Testar chat: https://viva-score-v2-rouge.vercel.app/calculadora-chat
- [ ] Verificar console (F12) - Sem erros de "Missing env variable"

---

## 🧪 Como Testar Após Configuração

### 1. Teste do Chat Conversacional

**URL:** https://viva-score-v2-rouge.vercel.app/calculadora-chat

**Passos:**
1. Abrir chat
2. Iniciar conversa
3. Fornecer dados (nome, email, telefone)
4. Completar conversa até 100%
5. Verificar diagnóstico gerado

**✅ Sucesso se:**
- Chat responde normalmente
- Progresso atualiza
- Lead salvo no Supabase
- Diagnóstico gerado
- Sem erros no console

**❌ Falha se:**
- Erro: "Missing env.ANTHROPIC_API_KEY"
- Erro: "Supabase not configured"
- Chat não responde
- Console mostra erros

---

### 2. Verificar no Browser Console

**Abrir DevTools (F12) → Console:**

```javascript
// ✅ Deve aparecer (apenas em dev):
[Supabase] Warning: ... not configured, using placeholder

// ❌ NÃO deve aparecer:
Error: Missing env.ANTHROPIC_API_KEY
Error: Failed to initialize Supabase
```

---

### 3. Verificar Supabase

**Query no SQL Editor:**

```sql
-- Verificar se leads estão sendo salvos
SELECT * FROM leads
ORDER BY created_at DESC
LIMIT 5;

-- Verificar se analyses estão sendo salvas
SELECT * FROM analyses
ORDER BY created_at DESC
LIMIT 5;
```

**✅ Deve retornar dados dos testes**

---

### 4. Verificar Webhooks (Se configurados)

**Logs do n8n:**
1. Acessar workflow no n8n
2. Ver "Executions"
3. Verificar se webhooks estão sendo recebidos

**✅ Deve aparecer execuções quando:**
- Lead é capturado
- Análise é gerada

---

## 🚨 Troubleshooting

### Erro: "Missing env.ANTHROPIC_API_KEY"

**Causa:** Variável não configurada no Vercel

**Solução:**
1. Verificar se `ANTHROPIC_API_KEY` está em Environment Variables
2. Verificar se está nos 3 environments (Production, Preview, Development)
3. Redeploy após adicionar

---

### Erro: "Failed to create chat completion"

**Causa:** API key inválida ou expirada

**Solução:**
1. Testar chave: https://console.anthropic.com/settings/keys
2. Se expirada, gerar nova
3. Atualizar no Vercel
4. Redeploy

---

### Warning: "[Supabase] ... not configured"

**Causa:** Variáveis Supabase faltando

**Solução:**
1. Adicionar `NEXT_PUBLIC_SUPABASE_URL`
2. Adicionar `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Adicionar `SUPABASE_SERVICE_ROLE_KEY`
4. Redeploy

---

### Leads não aparecem no Supabase

**Causa:** SERVICE_ROLE_KEY incorreta

**Solução:**
1. Verificar se `SUPABASE_SERVICE_ROLE_KEY` está correta
2. Copiar novamente do dashboard Supabase
3. Verificar se tabela `leads` existe
4. Verificar RLS policies

---

### Chat não responde

**Causas possíveis:**
1. ANTHROPIC_API_KEY inválida
2. Rate limit atingido
3. Erro de rede

**Debug:**
1. Abrir DevTools → Network
2. Procurar requisição para `/api/chat`
3. Ver response: erro específico
4. Corrigir baseado no erro

---

## 📋 Template de Valores

Copie e preencha (NÃO comite este arquivo!):

```bash
# =====================================================
# PRISMA Score - Produção Vercel
# =====================================================

# Anthropic API (OBRIGATÓRIA)
ANTHROPIC_API_KEY=sk-ant-api03-[COLE_AQUI_SUA_CHAVE]

# Supabase (OBRIGATÓRIAS)
NEXT_PUBLIC_SUPABASE_URL=https://[SEU_PROJETO].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.[COLE_AQUI]
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.[COLE_AQUI]

# n8n Webhooks (OPCIONAIS)
N8N_WEBHOOK_URL_LEAD=https://[WORKSPACE].app.n8n.cloud/webhook/[ID]
N8N_WEBHOOK_URL=https://[WORKSPACE].app.n8n.cloud/webhook/[ID]

# Segurança (OPCIONAIS)
SUPABASE_WEBHOOK_SECRET=[GERE_COM_openssl_rand_-hex_32]
N8N_API_KEY=[GERE_COM_openssl_rand_-hex_32]
WEBHOOK_API_KEY=[GERE_COM_openssl_rand_-hex_32]
ADMIN_API_KEY=[GERE_COM_openssl_rand_-hex_32]
```

---

## 🔒 Segurança - Boas Práticas

### ✅ FAÇA:
- Use variáveis de ambiente no Vercel
- Mantenha `.env*` no `.gitignore`
- Rotacione chaves periodicamente
- Use secrets diferentes para dev/prod
- Monitore uso de API keys (Anthropic dashboard)

### ❌ NÃO FAÇA:
- Commitar `.env` no Git
- Expor `SUPABASE_SERVICE_ROLE_KEY` no client
- Compartilhar chaves por email/Slack
- Usar mesmas chaves em dev e prod
- Deixar chaves em código hardcoded

---

## 📞 Suporte

**Se precisar de ajuda:**

1. **Vercel Support:** https://vercel.com/support
2. **Supabase Support:** https://supabase.com/support
3. **Anthropic Support:** https://support.anthropic.com
4. **Documentação:**
   - `CONVERSATIONAL_AGENT.md` - Arquitetura técnica
   - `DEPLOY_SUCCESS.md` - Status do deploy
   - `.env.example` - Template de variáveis

---

## ✅ Validação Final

Após configurar TUDO:

1. [ ] Todas variáveis críticas configuradas no Vercel
2. [ ] Redeploy concluído com sucesso
3. [ ] Chat conversacional funciona
4. [ ] Lead salvo no Supabase
5. [ ] Diagnóstico gerado corretamente
6. [ ] Sem erros no console
7. [ ] Mobile funciona
8. [ ] Webhooks funcionam (se configurados)

**Status:** ✅ CONFIGURAÇÃO COMPLETA

---

**Criado por:** Claude Code (Dev Agent)
**Data:** 20/02/2026
**Versão:** 1.0

---

## 🎯 Próximo Passo

Após configurar as variáveis:

1. **Atualizar Task #6:** Marcar como completed
2. **Executar Task #12:** QA Testing (Quinn)
3. **Monitorar produção:** Verificar logs, métricas, erros
4. **Anunciar feature:** Comunicar aos usuários
