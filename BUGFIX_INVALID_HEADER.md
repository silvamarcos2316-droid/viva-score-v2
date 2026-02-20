# Bugfix: Invalid header value - Chat API

**Data:** 20/02/2026
**Prioridade:** CRÍTICA
**Status:** 🔄 EM DEPLOY

---

## Problema Reportado

**Usuário relatou erro ao testar o chat:**
```
Desculpe, ocorreu um erro. Pode tentar novamente?
Se o problema persistir, tente recarregar a página.

18:15
Erro: Invalid header value.
```

---

## Root Cause Analysis

### 1. Investigação

Verificado arquivo `.env.vercel.production` gerado por `vercel env pull`:

```bash
ANTHROPIC_API_KEY="sk-ant-api03-...\ny\n"
NEXT_PUBLIC_SUPABASE_URL="https://exrjtepqvwwdldjpkehx.supabase.co\nn\n"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\nn\n"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\ny\n"
```

**Problema identificado:**
Variáveis de ambiente contêm caracteres literais `\ny\n` e `\nn\n` no final das strings.

### 2. Impacto

Quando o Anthropic SDK tenta usar `ANTHROPIC_API_KEY` com newlines no final:
```typescript
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,  // Contém "\ny\n" no final
})
```

O SDK tenta enviar HTTP header:
```
Authorization: Bearer sk-ant-api03-...\ny\n
```

HTTP spec não permite newlines em header values → **"Invalid header value" error**

---

## Solução Implementada

### Arquivos Modificados

#### 1. `app/api/chat/route.ts`

**Antes:**
```typescript
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})
```

**Depois:**
```typescript
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!.trim().replace(/\\n/g, ''),
})
```

**Explicação:**
- `.trim()` - Remove espaços e newlines no início/fim
- `.replace(/\\n/g, '')` - Remove literais `\n` dentro da string

---

#### 2. `lib/supabase.ts`

**Antes:**
```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
```

**Depois:**
```typescript
const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co').trim().replace(/\\n/g, '')
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key').trim().replace(/\\n/g, '')
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim().replace(/\\n/g, '')
```

**Explicação:**
Mesma sanitização em todas as variáveis de ambiente do Supabase para prevenir problemas similares.

---

## Deploy

### Commit
```
ec84b6c - fix: sanitize environment variables to prevent Invalid header value error
```

### Push Status
```
✅ Pushed to GitHub
🔄 Vercel auto-deploy triggered
⏳ Aguardando deploy completar (~2 minutos)
```

### URL de Produção
https://viva-score-v2-rouge.vercel.app/calculadora-chat

---

## Testes Necessários

### Após Deploy Completar

**1. Teste Básico (Usuário):**
```
1. Acessar: https://viva-score-v2-rouge.vercel.app/calculadora-chat
2. Enviar mensagem "Olá"
3. Verificar se PRISMA responde sem erro
4. Continuar conversa normalmente
```

**Expected Result:** ✅ Chat funciona sem "Invalid header value"

---

**2. Teste Completo:**
```
1. Fornecer nome, email, telefone
2. Fornecer dados do projeto
3. Completar até 100%
4. Verificar se diagnóstico é gerado
5. Verificar se lead salva no Supabase
```

**Expected Result:** ✅ Fluxo completo funciona

---

**3. DevTools Check:**
```
1. Abrir DevTools (F12)
2. Console tab
3. Verificar se não há erros de "Invalid header value"
4. Network tab → /api/chat
5. Verificar status 200 OK
```

**Expected Result:** ✅ Sem erros no console, API responde 200

---

## Prevenção Futura

### 1. Documentar Issue

Criar nota em `VERCEL_ENV_SETUP_GUIDE.md`:

```markdown
⚠️ **Nota sobre `vercel env pull`:**
O comando pode adicionar caracteres extras (\n) no final das variáveis.
Sempre sanitize env vars com `.trim().replace(/\\n/g, '')` no código.
```

### 2. Code Pattern

**Sempre que ler env var:**
```typescript
// ✅ GOOD
const apiKey = process.env.API_KEY!.trim().replace(/\\n/g, '')

// ❌ BAD
const apiKey = process.env.API_KEY!
```

### 3. Build Validation

Considerar adicionar validação no build:
```typescript
// lib/env-validator.ts
export function validateEnvVar(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Missing env var: ${name}`)
  }

  const cleaned = value.trim().replace(/\\n/g, '')

  if (cleaned.includes('\n')) {
    console.warn(`[ENV] ${name} contains newlines, cleaning...`)
  }

  return cleaned
}
```

---

## Métricas

**Tempo de detecção:** ~5 minutos (após usuário reportar)
**Tempo de fix:** ~10 minutos (identificar + implementar + commit)
**Tempo total de resolução:** ~15 minutos + tempo de deploy

**Arquivos modificados:** 2
**Linhas modificadas:** 5

---

## Lições Aprendidas

### 1. Problema com `vercel env pull`
O comando `vercel env pull` pode gerar arquivo .env com formatação incorreta, especialmente quando variáveis contêm respostas de prompts interativos (y/n).

**Exemplo problemático:**
```bash
$ vercel env add ANTHROPIC_API_KEY
? Enter value: sk-ant-api03-...
? Add to Production? (y/n) y    ← Esse "y\n" vai para a variável!
```

### 2. Sempre Sanitize Env Vars
Mesmo que variáveis estejam corretas no Vercel dashboard, é boa prática sempre limpar/sanitizar quando usadas em código, especialmente para:
- HTTP headers (Authorization, API keys)
- URLs (podem ter trailing newlines)
- Database connection strings

### 3. Edge Runtime Sensitivity
Edge Runtime do Vercel é mais sensível a headers malformados que Node.js Runtime tradicional. Erros que passariam silenciosamente em Node falham imediatamente no Edge.

---

## Status Final

- [x] Problema identificado
- [x] Root cause determinado
- [x] Solução implementada
- [x] Código commitado
- [x] Push para GitHub
- [x] Deploy triggered
- [ ] Deploy completado (aguardando)
- [ ] Teste pelo usuário
- [ ] Confirmação do fix

**Próximo Passo:** Aguardar deploy completar (~2 min) e solicitar teste do usuário.

---

**Criado por:** Claude Code (Dev Agent)
**Task:** #13 - Corrigir erro "Invalid header value" no chat
**Commit:** ec84b6c
**Status:** 🔄 EM DEPLOY
