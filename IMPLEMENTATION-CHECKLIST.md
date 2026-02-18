# PRISMA Score - Implementation Checklist

## Status da Implementação

### 1. Infraestrutura Supabase ✅ CONCLUÍDO

- [x] Schema SQL completo (`supabase/schema.sql`)
- [x] Migrations organizadas (`supabase/migrations/`)
  - [x] Initial schema
  - [x] WhatsApp integration
  - [x] Functions and triggers
  - [x] Analytics views
- [x] Cliente TypeScript (`lib/supabase.ts`)
- [x] Queries helpers (`lib/supabase-queries.ts`)
- [x] Exemplos de uso (`lib/supabase-example.ts`)
- [x] Documentação completa (`SUPABASE-SETUP.md`)

### 2. Próximos Passos - Backend 🚧 PENDENTE

- [ ] Atualizar `/api/analyze/route.ts` para salvar no Supabase
- [ ] Atualizar `/api/track/analysis/route.ts` para usar Supabase
- [ ] Criar `/api/lead/capture/route.ts` para captura de leads
- [ ] Criar `/api/session/start/route.ts` para tracking de sessão
- [ ] Criar `/api/webhooks/whatsapp/route.ts` para n8n

### 3. Próximos Passos - Frontend 🚧 PENDENTE

- [ ] Implementar tracking de sessão no `app/layout.tsx`
- [ ] Adicionar tracking de eventos no `lib/tracking.ts`
- [ ] Criar hook `useSession()` para gerenciar sessão do usuário
- [ ] Implementar form tracking detalhado
- [ ] Adicionar loading states durante save

### 4. Próximos Passos - Dashboard Admin 📊 TODO

- [ ] Criar `/app/admin/page.tsx` - Dashboard principal
- [ ] Criar `/app/admin/analyses/page.tsx` - Lista de análises
- [ ] Criar `/app/admin/leads/page.tsx` - Lista de leads
- [ ] Criar `/app/admin/analytics/page.tsx` - Analytics avançado
- [ ] Implementar autenticação básica (password protection)

### 5. Integração WhatsApp/n8n 📱 PREPARADO

- [x] Tabelas criadas no schema
- [x] Tipos definidos
- [ ] Criar workflow no n8n
- [ ] Configurar webhook
- [ ] Testar fluxo end-to-end

---

## Instruções de Implementação

### Backend - Modificar `/api/analyze/route.ts`

```typescript
import { supabaseAdmin } from '@/lib/supabase'
import { saveAnalysis } from '@/lib/supabase-queries'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = FormDataSchema.parse(body)

    // Call Claude API
    const analysis = await analyzeProject(validatedData)

    // Salvar no Supabase
    const savedAnalysis = await saveAnalysis({
      analysis_id: body.analysisId || crypto.randomUUID(),
      session_id: body.sessionId,
      user_id: body.userId,
      ...validatedData,
      ...analysis.scores,
      classification: analysis.classification,
      risks: analysis.risks,
      strengths: analysis.strengths,
      next_steps: analysis.nextSteps,
      questions: analysis.questions,
      missing_info: analysis.missingInfo,
      full_analysis_text: JSON.stringify(analysis),
      model_used: 'claude-opus-4.6',
    })

    return NextResponse.json({
      success: true,
      analysis,
      analysisId: savedAnalysis.analysis_id,
    })
  } catch (error) {
    // ...
  }
}
```

### Frontend - Adicionar tracking de sessão

```typescript
// app/layout.tsx
'use client'

import { useEffect } from 'react'
import { createSession } from '@/lib/supabase-queries'

export default function RootLayout({ children }) {
  useEffect(() => {
    // Criar ou recuperar sessionId
    let sessionId = sessionStorage.getItem('sessionId')
    if (!sessionId) {
      sessionId = crypto.randomUUID()
      sessionStorage.setItem('sessionId', sessionId)

      // Criar sessão no Supabase
      createSession({
        session_id: sessionId,
        user_agent: navigator.userAgent,
        landing_page: window.location.href,
        referrer: document.referrer,
        // ... device info
      })
    }
  }, [])

  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
```

---

## Comandos Úteis

```bash
# Instalar dependências
npm install @supabase/supabase-js

# Verificar tipos TypeScript
npm run build

# Testar localmente
npm run dev

# Deploy para produção
vercel --prod
```

---

## Testes de Integração

### 1. Testar salvamento de análise

```bash
curl -X POST https://prisma-score.vercel.app/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "Teste",
    "problemStatement": "Testar integração Supabase...",
    "techStack": ["Next.js", "Supabase"],
    ...
  }'
```

### 2. Verificar no Supabase

1. Dashboard > Table Editor > `analyses`
2. Confirmar que o registro foi criado

---

## Próximas Tarefas Prioritárias

1. **Modificar `/api/analyze`** para salvar no Supabase
2. **Adicionar session tracking** no frontend
3. **Criar dashboard admin** básico
4. **Configurar n8n** para WhatsApp
5. **Testar fluxo completo** end-to-end

---

**Data de criação**: 2026-02-18  
**Status**: Infraestrutura pronta - Implementação pendente
