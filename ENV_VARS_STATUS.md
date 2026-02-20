# Status das Variáveis de Ambiente - PRISMA

**Data:** 20/02/2026
**Status:** ⚠️ VERIFICAÇÃO NECESSÁRIA

---

## 🔍 Verificação Automática

### API Endpoint Check
✅ **API `/api/chat` está respondendo** (HTTP 405 = rota existe, precisa POST)

**Isso significa:**
- Build passou sem erros críticos de env vars
- Runtime não está crashando por falta de variáveis
- Código compilou corretamente

**MAS NÃO GARANTE:**
- Que ANTHROPIC_API_KEY está correta (pode estar placeholder)
- Que Supabase está configurado corretamente
- Que webhooks estão funcionando

---

## ⚠️ Ação Necessária do Usuário

**Você precisa verificar manualmente no Vercel:**

### 1. Acessar Dashboard
🔗 https://vercel.com/marcos-moraes-da-silvas-projects/viva-score-v2/settings/environment-variables

### 2. Verificar Variáveis Críticas

| Variável | Status | Onde Obter |
|----------|--------|------------|
| `ANTHROPIC_API_KEY` | ❓ VERIFICAR | https://console.anthropic.com/settings/keys |
| `NEXT_PUBLIC_SUPABASE_URL` | ❓ VERIFICAR | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ❓ VERIFICAR | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | ❓ VERIFICAR | Supabase Dashboard → Settings → API |

### 3. Variáveis Opcionais (Podem Faltar)

| Variável | Status | Necessário Para |
|----------|--------|-----------------|
| `N8N_WEBHOOK_URL_LEAD` | ⚠️ OPCIONAL | Notificações WhatsApp de leads |
| `N8N_WEBHOOK_URL` | ⚠️ OPCIONAL | Notificações WhatsApp de análises |
| `SUPABASE_WEBHOOK_SECRET` | ⚠️ OPCIONAL | Validação de webhooks |
| `N8N_API_KEY` | ⚠️ OPCIONAL | Segurança adicional |
| `WEBHOOK_API_KEY` | ⚠️ OPCIONAL | Segurança adicional |
| `ADMIN_API_KEY` | ⚠️ OPCIONAL | Segurança adicional |

---

## 🧪 Como Testar se Está Funcionando

### Teste 1: Chat Conversacional

**URL:** https://viva-score-v2-rouge.vercel.app/calculadora-chat

**Passos:**
1. Abrir página
2. Iniciar conversa
3. Enviar mensagem

**✅ Funciona se:**
- PRISMA responde
- Progresso atualiza
- Sem erros no console (F12)

**❌ Erro se:**
```
Missing env.ANTHROPIC_API_KEY
ou
Failed to create chat completion
ou
API key invalid
```

### Teste 2: Salvar Lead no Supabase

**Após fornecer nome, email, telefone:**

**Verificar no Supabase:**
```sql
SELECT * FROM leads ORDER BY created_at DESC LIMIT 1;
```

**✅ Funciona se:** Lead aparece
**❌ Erro se:** Tabela vazia ou erro de conexão

### Teste 3: Console do Browser

**Abrir DevTools (F12) → Console**

**Procurar por:**
- ✅ Sem erros relacionados a env vars
- ⚠️ Warnings são ok: `[Supabase] Warning: ... using placeholder`
- ❌ Errors são problema: `Error: Missing env...`

---

## 📋 Checklist de Configuração

**Se variáveis estiverem faltando, siga o guia:**
📄 `VERCEL_ENV_SETUP_GUIDE.md` (493 linhas, passo a passo completo)

### Passo 1: Obter Credenciais
- [ ] ANTHROPIC_API_KEY - https://console.anthropic.com/settings/keys
- [ ] Supabase URL - Supabase Dashboard → API
- [ ] Supabase Anon Key - Supabase Dashboard → API
- [ ] Supabase Service Key - Supabase Dashboard → API (⚠️ SECRET!)

### Passo 2: Adicionar no Vercel
- [ ] Acessar: https://vercel.com/.../settings/environment-variables
- [ ] Add New para cada variável
- [ ] Selecionar TODOS os environments (Production, Preview, Development)
- [ ] Save

### Passo 3: Redeploy
- [ ] Deployments → Latest → "..." → Redeploy
- [ ] Aguardar build (1-3 min)
- [ ] Verificar status: ✅ Ready

### Passo 4: Testar
- [ ] Chat funciona
- [ ] Lead salvo no Supabase
- [ ] Diagnóstico gerado
- [ ] Sem erros no console

---

## 🔄 Status de Configuração

**Última verificação:** 20/02/2026

**Detectado:**
- ✅ API /api/chat está online
- ⚠️ Variáveis não verificadas (acesso manual necessário)

**Próximos passos:**
1. Usuário verifica variáveis no Vercel
2. Adiciona as que faltarem
3. Redeploy
4. Testa chat completamente
5. Atualiza Task #6 como completed

---

## 📞 Se Precisar de Ajuda

**Guias disponíveis:**
- 📄 `VERCEL_ENV_SETUP_GUIDE.md` - Setup completo passo a passo
- 📄 `CONVERSATIONAL_AGENT.md` - Arquitetura técnica
- 📄 `DEPLOY_SUCCESS.md` - Status do deploy
- 📄 `.env.example` - Template com todas as variáveis

**Suporte:**
- Vercel: https://vercel.com/support
- Supabase: https://supabase.com/support
- Anthropic: https://support.anthropic.com

---

**Criado por:** Claude Code (Dev Agent)
**Task:** #6 - Configurar variáveis de ambiente no Vercel
**Status:** ⚠️ AGUARDANDO VERIFICAÇÃO MANUAL DO USUÁRIO
