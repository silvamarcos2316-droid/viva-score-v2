# PRISMA Score - Supabase Setup Guide

## Visão Geral

Este documento descreve como configurar e usar o Supabase como infraestrutura de dados para o PRISMA Score.

## Arquitetura de Dados

### Tabelas Principais

1. **users** - Leads/usuários capturados
2. **sessions** - Sessões de navegação com tracking detalhado
3. **analyses** - Diagnósticos completos gerados (V.I.V.A. Score)
4. **tracking_events** - Eventos de comportamento do usuário
5. **form_interactions** - Tracking detalhado de interações com formulários
6. **whatsapp_conversations** - Conversas via WhatsApp (integração n8n)
7. **whatsapp_messages** - Mensagens individuais do WhatsApp

---

## 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie um projeto chamado `prisma-score`
3. Aguarde provisionamento (~2 minutos)

## 2. Obter Credenciais

Vá em **Settings** > **API** e copie:
- **Project URL**: `https://[seu-projeto].supabase.co`
- **anon public key**: Para uso no frontend
- **service_role key**: Para uso no backend (NUNCA expor!)

## 3. Configurar .env.local

```bash
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
ANTHROPIC_API_KEY=sk-ant-api03-...
```

## 4. Executar Migrations

No dashboard do Supabase:
1. **SQL Editor** > **New query**
2. Cole o conteúdo de `supabase/schema.sql`
3. Clique em **Run**
4. Aguarde (~30 segundos)

## 5. Instalar Dependências

```bash
npm install @supabase/supabase-js
```

## 6. Uso no Código

### Frontend (Browser)
```typescript
import { supabase } from '@/lib/supabase'

await supabase.from('tracking_events').insert({
  event_name: 'page_view',
  page_path: window.location.pathname,
})
```

### Backend (API Routes)
```typescript
import { supabaseAdmin } from '@/lib/supabase'

const { data } = await supabaseAdmin
  .from('analyses')
  .insert({ project_name: 'Test', ... })
```

## 7. Próximos Passos

1. Criar `lib/supabase.ts` com cliente configurado
2. Modificar `/api/analyze` para salvar no Supabase
3. Implementar tracking de sessão
4. Criar dashboard admin

Veja documentação completa em: https://supabase.com/docs
