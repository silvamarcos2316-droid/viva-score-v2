# Checklist de Teste - Deploy do Agente Conversacional PRISMA

## Status do Push ✅

### ✅ Submodule viva-score-v2 - **SUCESSO**
```
Commit e724333 enviado com sucesso para:
https://github.com/silvamarcos2316-droid/viva-score-v2
```

**Conteúdo enviado:**
- ✅ `app/api/chat/route.ts` - API do agente conversacional
- ✅ `components/ChatAgent.tsx` - Interface de chat
- ✅ `app/calculadora-chat/page.tsx` - Página dedicada
- ✅ `app/page.tsx` - Landing page atualizada com novos CTAs
- ✅ `CONVERSATIONAL_AGENT.md` - Documentação completa

### ⚠️ Repo principal projetos-marcos - TIMEOUT
**Motivo:** Arquivos de vídeo grandes (124MB + 266MB) no histórico antigo
**Impacto:** **NENHUM** - O código do PRISMA está no submodule que foi enviado com sucesso

---

## 1. Configuração no Vercel (CRÍTICO)

### Acessar Dashboard
🔗 https://vercel.com/marcos-moraes-da-silvas-projects/viva-score-v2

### Variáveis de Ambiente Necessárias

#### ✅ Verificar se já existem:
```bash
ANTHROPIC_API_KEY=sk-ant-api03-...
```

#### ⚠️ Adicionar se faltando:
```bash
# Supabase (obrigatórias)
NEXT_PUBLIC_SUPABASE_URL=https://[seu-projeto].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Webhooks n8n (opcionais)
N8N_WEBHOOK_URL=https://...
N8N_WEBHOOK_URL_LEAD=https://...
```

**Como adicionar:**
1. Settings → Environment Variables
2. Add New → Name + Value
3. Selecionar ambientes: Production, Preview, Development
4. Save

---

## 2. Verificar Deploy Automático

### Após Push
O Vercel detecta automaticamente novos commits no GitHub e inicia deploy.

**Monitorar:**
1. Acessar: https://vercel.com/marcos-moraes-da-silvas-projects/viva-score-v2
2. Aba "Deployments"
3. Aguardar status mudar de "Building" → "Ready" (1-3 minutos)

### Se Build Falhar
**Possíveis causas:**
- ❌ Variáveis de ambiente faltando
- ❌ Erro de sintaxe TypeScript
- ❌ Erro na API do Claude

**Como debugar:**
1. Clicar no deployment com erro
2. Ver "Build Logs"
3. Procurar por:
   - `Missing env.NEXT_PUBLIC_SUPABASE_URL`
   - `ANTHROPIC_API_KEY`
   - TypeScript errors

---

## 3. Testes em Produção

### 3.1 Teste da Landing Page

**URL:** https://prisma-score.vercel.app (ou seu domínio)

**Verificar:**
- [ ] Seção "Por Que PRISMA vs ChatGPT?" está visível
- [ ] Hero section tem opção "💬 Conversar com IA"
- [ ] Botão secundário "Usar formulário tradicional"
- [ ] Final CTA tem ambas opções
- [ ] Cores rainbow/prisma no progress bar (violet→blue→green→yellow→orange)

**Prints:**
- [ ] Tirar screenshot da landing page completa
- [ ] Screenshot da nova seção competitiva

---

### 3.2 Teste do Agente Conversacional

**URL:** https://prisma-score.vercel.app/calculadora-chat

#### Fluxo Completo:

**Etapa 1: Abertura**
- [ ] Assistente PRISMA cumprimenta e explica o processo
- [ ] Interface de chat está responsiva
- [ ] Barra de progresso mostra 0%

**Etapa 2: Coleta de Contato**
- [ ] Pergunta nome completo
- [ ] Valida nome (mínimo 3 caracteres)
- [ ] Pergunta email
- [ ] Valida formato de email
- [ ] Pergunta telefone
- [ ] Valida telefone brasileiro (mínimo 10 dígitos)
- [ ] Pergunta empresa (opcional)
- [ ] Progresso aumenta para ~36% (4 de 11 campos)

**Verificar no Supabase:**
- [ ] Acessar: https://supabase.com/dashboard/project/[seu-projeto]/editor
- [ ] Tabela `leads` tem novo registro com:
  - Nome, email, telefone, empresa
  - Timestamp correto

**Etapa 3: Dimensão VISÃO**
- [ ] Pergunta nome do projeto
- [ ] Pergunta sobre problema específico
- [ ] Faz follow-ups se resposta vaga
- [ ] Progresso ~54% (6 de 11 campos)

**Etapa 4: Dimensão INTEGRAÇÃO**
- [ ] Pergunta sobre tech stack
- [ ] Pergunta sobre integrações necessárias
- [ ] Progresso ~72% (8 de 11 campos)

**Etapa 5: Dimensão VIABILIDADE**
- [ ] Pergunta sobre orçamento mensal
- [ ] Pergunta sobre ROI esperado
- [ ] Progresso ~90% (10 de 11 campos)

**Etapa 6: Dimensão EXECUÇÃO**
- [ ] Pergunta sobre timeline/prazo
- [ ] Pergunta sobre bloqueadores
- [ ] Progresso atinge 100%

**Etapa 7: Geração do Diagnóstico**
- [ ] Mensagem: "Perfeito! Tenho tudo que preciso. Vou gerar seu diagnóstico..."
- [ ] Loading state: "Gerando seu diagnóstico..."
- [ ] Redirecionamento automático para `/results`

**Verificar Página de Resultados:**
- [ ] Score total (0-40) calculado corretamente
- [ ] Scores por dimensão (V.I.V.A.)
- [ ] Classificação (baixa/moderado/alto/alta viabilidade)
- [ ] 3 riscos listados
- [ ] 3 pontos fortes listados
- [ ] 3 próximos passos listados
- [ ] 5 perguntas de aprofundamento
- [ ] Informações faltantes identificadas

---

### 3.3 Teste do Formulário Tradicional (Comparação)

**URL:** https://prisma-score.vercel.app/calculator

**Verificar:**
- [ ] Formulário multi-etapas ainda funciona
- [ ] Progress bar com cores rainbow
- [ ] Todos os 5 steps funcionando (Lead → Visão → Integração → Viabilidade → Execução)
- [ ] Gera mesmo resultado que agente conversacional

---

### 3.4 Testes de Erro

**Teste 1: Conversa sem completar todos campos**
- [ ] Fechar aba no meio da conversa
- [ ] Reabrir → Deve começar do zero (sem memória por enquanto)

**Teste 2: Dados inválidos**
- [ ] Fornecer email inválido → Agente deve pedir novamente
- [ ] Fornecer telefone com menos de 10 dígitos → Agente deve pedir novamente

**Teste 3: Erro na API Claude**
- [ ] Se API key inválida → Deve mostrar mensagem de erro amigável
- [ ] Botão "Tentar novamente" deve funcionar

**Teste 4: Erro no Supabase**
- [ ] Se Supabase offline → Lead não salva, mas conversa continua
- [ ] Erro não deve quebrar o fluxo

---

## 4. Testes de Performance

### Velocidade
- [ ] Primeira mensagem do agente: < 2 segundos
- [ ] Respostas subsequentes: < 3 segundos
- [ ] Geração do diagnóstico final: < 10 segundos

### Mobile
- [ ] Interface responsiva em celular
- [ ] Input de mensagem acessível
- [ ] Scroll automático funciona
- [ ] Botões de envio visíveis

---

## 5. Monitoramento de Métricas

### Analytics
- [ ] Event tracking funcionando (se consent aceito)
- [ ] Page view de `/calculadora-chat` registrado
- [ ] Email capture registrado quando lead é salvo
- [ ] Analysis submission registrado ao finalizar

### Supabase Logs
- [ ] Verificar tabela `leads` para novos registros
- [ ] Verificar tabela `analyses` (se implementada)

---

## 6. Comparação A/B (Futuro)

Para medir impacto do agente conversacional vs formulário:

**KPIs para rastrear:**
- Taxa de início (quantos começam?)
- Taxa de completude (quantos terminam?)
- Tempo médio de conclusão
- Taxa de abandono por etapa
- Qualidade das respostas (comprimento médio)

**Ferramentas sugeridas:**
- Google Analytics 4
- Hotjar (heatmaps)
- Mixpanel (funnels)

---

## 7. Próximos Passos Após Testes

### Melhorias Rápidas
- [ ] Adicionar botão "Voltar" no chat (reabrir última pergunta)
- [ ] Memory entre sessões (LocalStorage)
- [ ] Sugestões de resposta rápida (Quick Replies)
- [ ] Exportar conversa completa como PDF

### Otimizações
- [ ] Streaming de respostas (SSE)
- [ ] Pre-loading da análise durante conversa
- [ ] Caching de conversas parciais

### Marketing
- [ ] Anúncio nas redes: "Novo: Diagnóstico conversacional com IA"
- [ ] Email para leads antigos oferecendo nova experiência
- [ ] Case study: "De formulário para conversa: +X% conversão"

---

## 8. Rollback Plan (Se Algo Der Errado)

### Opção 1: Desabilitar Chat Temporariamente
Editar `app/page.tsx`:
```typescript
// Comentar link para /calculadora-chat
// Deixar apenas /calculator ativo
```

### Opção 2: Reverter Deploy
No Vercel:
1. Deployments → Selecionar deploy anterior
2. "Promote to Production"

### Opção 3: Reverter Código
```bash
cd viva-mvp/viva-score-v2
git revert e724333
git push origin master
```

---

## Contatos de Suporte

**Vercel:** https://vercel.com/support
**Supabase:** https://supabase.com/support
**Anthropic:** https://support.anthropic.com

---

**Data:** 20/02/2026
**Versão:** 1.0
**Responsável:** Marcos + Claude Code
