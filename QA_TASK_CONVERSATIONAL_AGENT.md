# QA Task: Teste do Agente Conversacional PRISMA

**Data:** 20/02/2026
**Prioridade:** ALTA
**Assignee:** @qa (Quinn)
**Status:** READY FOR QA
**Deploy:** ✅ Em Produção

---

## Context

Deploy bem-sucedido do agente conversacional PRISMA implementado com Claude Sonnet 4. Sistema substitui formulário multi-etapas por conversa natural para coleta de dados V.I.V.A.

**URLs em Produção:**
- Landing: https://viva-score-v2-rouge.vercel.app
- Chat: https://viva-score-v2-rouge.vercel.app/calculadora-chat
- Formulário tradicional: https://viva-score-v2-rouge.vercel.app/calculator

**Commits:**
- e724333 - feat: implement conversational AI agent
- 535c53b - fix: TypeScript tool definition
- d000423 - fix: TypeScript toolUse input
- d0f069d - docs: deploy success report

---

## Acceptance Criteria

### Funcionalidade Core
- [ ] Chat conversacional funciona end-to-end
- [ ] Extração estruturada de dados funciona
- [ ] Progresso (0-100%) atualiza corretamente
- [ ] Lead é salvo no Supabase
- [ ] Diagnóstico é gerado ao final
- [ ] Redirecionamento para /results funciona
- [ ] Tracking de eventos funciona

### UX/UI
- [ ] Interface responsiva (desktop + mobile)
- [ ] Mensagens renderizam corretamente
- [ ] Input aceita Enter/Shift+Enter
- [ ] Auto-scroll para novas mensagens
- [ ] Loading states claros
- [ ] Error handling amigável

### Performance
- [ ] Primeira resposta < 3s
- [ ] Respostas subsequentes < 4s
- [ ] Geração final < 12s
- [ ] Sem memory leaks
- [ ] Funciona offline (graceful degradation)

### Security
- [ ] API keys não expostas no client
- [ ] Input sanitizado
- [ ] Rate limiting funciona
- [ ] CORS configurado corretamente
- [ ] Sem XSS vulnerabilities

---

## Test Plan

### 1. Landing Page Verification

**URL:** https://viva-score-v2-rouge.vercel.app

**Checks:**
- [ ] Seção "Por Que PRISMA vs ChatGPT?" visível
- [ ] Botão "💬 Conversar com IA" funciona (primary CTA)
- [ ] Botão "Usar formulário tradicional" funciona (secondary)
- [ ] Final CTA tem ambas opções
- [ ] Cores rainbow no progress bar
- [ ] Sem erros 404
- [ ] Sem console errors

**Screenshots:**
- [ ] Landing page completa
- [ ] Seção competitiva em destaque
- [ ] CTAs principais

---

### 2. Chat Conversational - Happy Path

**URL:** https://viva-score-v2-rouge.vercel.app/calculadora-chat

#### 2.1 Carregamento Inicial
- [ ] Interface de chat renderiza
- [ ] Mensagem inicial: "Olá! 👋 Sou o PRISMA..."
- [ ] Campo de input habilitado
- [ ] Barra de progresso em 0%
- [ ] Footer com privacidade
- [ ] Sem erros de console

#### 2.2 Coleta de Contato
**Enviar:** Nome, email, telefone, empresa

**Verificar:**
- [ ] PRISMA pergunta cada campo
- [ ] Valida formato de email
- [ ] Valida telefone brasileiro (min 10 dígitos)
- [ ] Valida nome (min 3 chars)
- [ ] Progresso aumenta para ~36%
- [ ] Lead salvo no Supabase (verificar DB)
- [ ] Tracking event: `email_captured`

**Supabase Check:**
```sql
SELECT * FROM leads
WHERE email = 'seu-email-teste@test.com'
ORDER BY created_at DESC LIMIT 1;
```

#### 2.3 Dimensão VISÃO
**Enviar:** Nome do projeto + descrição do problema

**Verificar:**
- [ ] PRISMA faz follow-ups se resposta vaga
- [ ] Aceita descrição >= 50 caracteres
- [ ] Progresso aumenta para ~54%
- [ ] Dados extraídos corretamente

#### 2.4 Dimensão INTEGRAÇÃO
**Enviar:** Tech stack + necessidades de integração

**Verificar:**
- [ ] Aceita array de tecnologias
- [ ] Valida descrição >= 30 chars
- [ ] Progresso aumenta para ~72%

#### 2.5 Dimensão VIABILIDADE
**Enviar:** Orçamento mensal + ROI esperado

**Verificar:**
- [ ] Aceita faixa de orçamento
- [ ] Valida ROI >= 30 chars
- [ ] Progresso aumenta para ~90%

#### 2.6 Dimensão EXECUÇÃO
**Enviar:** Timeline + bloqueadores

**Verificar:**
- [ ] Aceita timeline (ex: "1-3 meses")
- [ ] Valida bloqueadores >= 20 chars
- [ ] Progresso atinge 100%

#### 2.7 Geração do Diagnóstico
**Verificar:**
- [ ] Mensagem final: "Perfeito! Tenho tudo que preciso..."
- [ ] Loading: "Gerando seu diagnóstico..."
- [ ] Chamada à API `/api/analyze`
- [ ] Redirecionamento automático para `/results`
- [ ] Tracking event: `analysis_submission`

#### 2.8 Página de Resultados
**Verificar:**
- [ ] Score total (0-40) calculado
- [ ] Scores por dimensão (V.I.V.A.)
- [ ] Classificação correta
- [ ] 3 riscos listados
- [ ] 3 pontos fortes
- [ ] 3 próximos passos
- [ ] 5 perguntas de aprofundamento
- [ ] Informações faltantes identificadas

---

### 3. Chat Conversational - Edge Cases

#### 3.1 Dados Inválidos
**Testes:**
- [ ] Email inválido → PRISMA pede novamente
- [ ] Telefone < 10 dígitos → PRISMA pede novamente
- [ ] Nome < 3 chars → PRISMA pede novamente
- [ ] Descrição < 50 chars → PRISMA pede mais detalhes

#### 3.2 Interrupções
- [ ] Fechar aba no meio → Reabrir = conversa zerada
- [ ] Refresh página → Conversa resetada (sem memory por enquanto)
- [ ] Network timeout → Error message amigável

#### 3.3 Rate Limiting
- [ ] Enviar 10 mensagens rápidas → Deve rate limit gracefully
- [ ] Error message claro se rate limit atingido

#### 3.4 API Errors
- [ ] API Claude offline → Error message amigável
- [ ] Supabase offline → Conversa continua, aviso no lead save
- [ ] JSON parse error → Handled gracefully

---

### 4. Mobile Testing

**Dispositivos:**
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] Tablet

**Checks:**
- [ ] Interface responsiva
- [ ] Input acessível (não escondido pelo teclado)
- [ ] Scroll automático funciona
- [ ] Botões de envio visíveis
- [ ] Touch events funcionam

---

### 5. Performance Testing

**Métricas:**
- [ ] Lighthouse Score >= 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Cumulative Layout Shift < 0.1

**Load Testing:**
- [ ] 10 conversas simultâneas → Sistema responde
- [ ] 100 conversas/hora → Sem degradação

---

### 6. Security Testing

#### 6.1 Browser Console Check
```bash
# No console errors allowed
console.error() → FAIL
console.warn() → OK if documented
```

#### 6.2 XSS Testing
**Tentar injetar:**
```html
<script>alert('XSS')</script>
<img src=x onerror=alert('XSS')>
```
- [ ] Input sanitizado
- [ ] Não executa scripts

#### 6.3 API Security
- [ ] ANTHROPIC_API_KEY não exposta no client
- [ ] SUPABASE_SERVICE_ROLE_KEY não exposta
- [ ] Edge Runtime isola secrets
- [ ] Rate limiting funciona

#### 6.4 SQL Injection
**Tentar:**
```sql
'; DROP TABLE leads; --
```
- [ ] Supabase client sanitiza
- [ ] Sem erros SQL

---

### 7. Comparison: Chat vs Form

**Teste ambos fluxos:**

| Métrica | Formulário | Chat |
|---------|-----------|------|
| Tempo completude | ? min | ? min |
| Número de erros | ? | ? |
| Taxa de abandono | ? | ? |
| Qualidade respostas | ? | ? |
| Satisfação (subjetivo) | ? | ? |

**Resultado esperado:** Chat <= Formulário em tempo, com melhor qualidade

---

### 8. Browser Compatibility

**Browsers:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

**Checks:**
- [ ] Chat funciona
- [ ] Animações fluidas
- [ ] Sem console errors

---

### 9. Accessibility (WCAG 2.1)

- [ ] Keyboard navigation funciona (Tab, Enter)
- [ ] Screen reader compatible
- [ ] Color contrast >= 4.5:1
- [ ] Focus indicators visíveis
- [ ] ARIA labels presentes

---

### 10. Integration Testing

#### 10.1 Supabase
```sql
-- Verificar leads salvos
SELECT COUNT(*) FROM leads WHERE created_at >= NOW() - INTERVAL '1 hour';

-- Verificar estrutura
\d leads
```

**Campos esperados:**
- id (uuid)
- created_at (timestamp)
- full_name (text)
- email (text)
- phone (text)
- company (text, nullable)

#### 10.2 Tracking Events
**Verificar no console do browser:**
```javascript
// Event: page_view
{ event: 'page_view', page: '/calculadora-chat' }

// Event: email_captured
{ event: 'email_captured', email: '...', name: '...' }

// Event: analysis_submission
{ event: 'analysis_submission', formData: {...}, analysis: {...} }
```

---

## Environment Variables Check

**Verificar no Vercel:**
https://vercel.com/marcos-moraes-da-silvas-projects/viva-score-v2/settings/environment-variables

**Required:**
- [ ] ANTHROPIC_API_KEY
- [ ] NEXT_PUBLIC_SUPABASE_URL
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] SUPABASE_SERVICE_ROLE_KEY

**Optional:**
- [ ] N8N_WEBHOOK_URL
- [ ] N8N_WEBHOOK_URL_LEAD

---

## CodeRabbit Review

```bash
# Run automated code review
wsl bash -c 'cd /mnt/c/projetos-marcos/viva-mvp/viva-score-v2 && ~/.local/bin/coderabbit --prompt-only -t committed --base master'
```

**Check for:**
- CRITICAL issues → FAIL
- HIGH issues → WARN
- MEDIUM/LOW → Document as tech debt

---

## Quality Gate Decision

### PASS Criteria:
- ✅ All acceptance criteria met
- ✅ No CRITICAL/HIGH CodeRabbit issues
- ✅ Performance metrics within range
- ✅ No security vulnerabilities
- ✅ Mobile functional

### CONCERNS Criteria:
- ⚠️ Minor UX issues
- ⚠️ MEDIUM CodeRabbit issues
- ⚠️ Performance slightly below target

### FAIL Criteria:
- ❌ Core functionality broken
- ❌ CRITICAL security issues
- ❌ Data loss possible
- ❌ Major browser incompatibilities

---

## Test Artifacts

**Generate:**
- [ ] QA Report (qa_report.md)
- [ ] CodeRabbit Report
- [ ] Performance Report (Lighthouse)
- [ ] Security Scan Report
- [ ] Screenshots (happy path + edge cases)
- [ ] Screen recording (full flow)

**Save to:**
`viva-mvp/viva-score-v2/docs/qa/conversational-agent/`

---

## Rollback Plan

**Se FAIL:**

### Option 1: Desabilitar Chat
```typescript
// app/page.tsx - Comment out chat link
// <Link href="/calculadora-chat">...
```

### Option 2: Reverter no Vercel
Dashboard → Previous deployment → "Promote to Production"

### Option 3: Git Revert
```bash
cd viva-mvp/viva-score-v2
git revert d0f069d d000423 535c53b e724333
git push origin master
```

---

## Related Documentation

- `CONVERSATIONAL_AGENT.md` - Technical documentation
- `DEPLOY_SUCCESS.md` - Deploy report
- `CHECKLIST_TESTE_DEPLOY.md` - Manual test checklist

---

## Notes for QA

**What's Different:**
- This is a NEW conversational interface, not a refactor
- Existing form (`/calculator`) still works as fallback
- Chat uses Claude Sonnet 4 with tool use for structured extraction
- Progressive data collection (0-100%)
- Auto-save to Supabase when contact collected

**Focus Areas:**
1. **UX Flow:** Natural conversation vs mechanical form
2. **Data Integrity:** All fields extracted correctly
3. **Error Handling:** Graceful degradation
4. **Performance:** Response times acceptable

**Risk Areas:**
- Claude API timeout/errors
- Supabase connection issues
- Browser compatibility (especially Safari)
- Mobile keyboard UX

---

## Timeline

**Estimated Time:** 2-4 hours (comprehensive testing)

**Breakdown:**
- Happy path: 30min
- Edge cases: 1h
- Security: 30min
- Performance: 30min
- Documentation: 30min

---

**Assigned to:** @qa (Quinn)
**Requested by:** @dev (Claude Code)
**Approved by:** Marcos
**Due:** ASAP (já em produção)

---

## Status Updates

**[Add your updates here as you test]**

### Test Session 1: [Date/Time]
- [ ] Started testing
- [ ] Completed: [sections]
- [ ] Issues found: [count]
- [ ] Gate decision: [PASS/CONCERNS/FAIL]

---

**Ready for QA Testing! 🧪**
