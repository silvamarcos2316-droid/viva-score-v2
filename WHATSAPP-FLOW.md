# WhatsApp Automation Flow - PRISMA Score

## Complete User Journey

This document describes the complete WhatsApp automation journey for PRISMA Score leads, from initial contact to conversion.

---

## Journey Overview

```
USER FILLS FORM → WELCOME MESSAGE → ANALYSIS RESULTS → FOLLOW-UP → CONVERSION
     (0-3 min)      (immediate)         (2-5 min)        (24h-7d)    (ongoing)
```

---

## Stage 1: Lead Capture (Immediate)

### Trigger
User completes Step 0 (contact information) in the PRISMA Score form.

### Action
**Automatic WhatsApp welcome message sent within 30 seconds**

### Message Template
```
Olá, [FirstName]! 👋

Obrigado por compartilhar seu projeto conosco através do *PRISMA Score*.

Estou analisando as informações que você forneceu e em breve terei insights valiosos sobre seu projeto de IA.

_Análise em processamento..._

Enquanto isso, você pode:
• Preparar dúvidas sobre a implementação
• Revisar suas respostas no formulário
• Pensar em detalhes adicionais do projeto

Em alguns instantes você receberá seu diagnóstico completo!

---
*PRISMA Score* - Diagnóstico Inteligente para Projetos de IA
```

### Purpose
- Confirm lead capture
- Set expectations for analysis delivery
- Build trust through immediate response
- Keep lead engaged while analysis processes

---

## Stage 2: Analysis Results (2-5 minutes after form completion)

### Trigger
Claude API completes PRISMA Score analysis and saves to database.

### Action
**Personalized WhatsApp message based on score tier**

### Message Templates by Score

#### 🎉 High Viability (36-40 points)

**Focus:** Celebration + Immediate call-to-action

```
🎉 *PARABÉNS, [NAME]!*

Seu projeto "[ProjectName]" alcançou *[Score]/40 pontos* no PRISMA Score!

🏆 *CLASSIFICAÇÃO: ALTA VIABILIDADE*

Seu projeto demonstra excelente potencial para implementação. Veja os destaques:

✨ *PRINCIPAIS FORÇAS:*
1. [Strength 1]
2. [Strength 2]
3. [Strength 3]

📊 *PONTUAÇÃO POR DIMENSÃO:*
• Visão: [X]/10
• Integração: [X]/10
• Viabilidade: [X]/10
• Execução: [X]/10

🎯 *PRÓXIMOS PASSOS RECOMENDADOS:*
1. [Step 1]
2. [Step 2]
3. [Step 3]

---

*Gostaria de avançar com este projeto?*

Podemos agendar uma conversa estratégica para:
• Detalhar o roadmap de implementação
• Discutir arquitetura técnica
• Planejar cronograma e recursos

Responda "SIM" para receber link de agendamento! 📅
```

**Expected Response:** 60-80% reply rate
**Conversion Target:** Schedule consultation

---

#### 👍 High Potential (26-35 points)

**Focus:** Validation + Improvement opportunities

```
👍 *Ótimo trabalho, [Name]!*

Seu projeto "[ProjectName]" alcançou *[Score]/40 pontos* no PRISMA Score.

📈 *CLASSIFICAÇÃO: ALTO POTENCIAL*

Seu projeto tem fundação sólida e grande potencial. Com alguns ajustes estratégicos, pode alcançar excelência.

✅ *PONTOS FORTES:*
1. [Strength 1]
2. [Strength 2]
3. [Strength 3]

⚠️ *ÁREAS DE ATENÇÃO:*
1. [Risk 1]
2. [Risk 2]
3. [Risk 3]

📊 *PONTUAÇÃO DETALHADA:*
• Visão: [X]/10
• Integração: [X]/10
• Viabilidade: [X]/10
• Execução: [X]/10

💡 *RECOMENDAÇÕES:*
1. [Step 1]
2. [Step 2]
3. [Step 3]

---

*Quer maximizar o potencial do seu projeto?*

Posso ajudar você a:
• Fortalecer os pontos fracos identificados
• Criar roadmap de implementação
• Validar decisões técnicas

Responda "QUERO AJUDA" para agendar consultoria! 🚀
```

**Expected Response:** 40-60% reply rate
**Conversion Target:** Consultation or group invite

---

#### 📋 Moderate Potential (16-25 points)

**Focus:** Honest assessment + Refinement opportunity

```
[Name], obrigado por compartilhar seu projeto! 🤝

"[ProjectName]" obteve *[Score]/40 pontos* no PRISMA Score.

📋 *CLASSIFICAÇÃO: POTENCIAL MODERADO*

Seu projeto tem base interessante, mas precisa de refinamento estratégico antes da implementação.

✨ *FORÇAS IDENTIFICADAS:*
1. [Strength 1]
2. [Strength 2]

🚨 *RISCOS CRÍTICOS:*
1. [Risk 1]
2. [Risk 2]
3. [Risk 3]

📊 *PONTUAÇÃO POR ÁREA:*
• Visão: [X]/10
• Integração: [X]/10
• Viabilidade: [X]/10
• Execução: [X]/10

🔍 *INFORMAÇÕES ADICIONAIS NECESSÁRIAS:*
1. [Missing 1]
2. [Missing 2]

❓ *PERGUNTAS PARA REFINAR O DIAGNÓSTICO:*
1. [Question 1]
2. [Question 2]

---

*Este projeto é importante para você?*

Posso ajudar a transformá-lo em algo viável através de:
• Sessão de refinamento estratégico
• Validação de conceito (MVP)
• Roadmap de implementação faseada

Responda "VAMOS REFINAR" para agendar! 💪
```

**Expected Response:** 20-40% reply rate
**Conversion Target:** Discovery workshop

---

#### ⚠️ Low Viability (0-15 points)

**Focus:** Honest feedback + Strategic pivoting

```
Olá, [Name]. Agradeço por confiar no PRISMA Score! 🙏

Analisei "[ProjectName]" com atenção. Pontuação: *[Score]/40 pontos*.

⚠️ *CLASSIFICAÇÃO: BAIXA VIABILIDADE (no estado atual)*

*Importante:* Isso NÃO significa que seu projeto não tem valor. Significa que precisa de trabalho estratégico ANTES de partir para implementação técnica.

🚨 *PRINCIPAIS DESAFIOS:*
1. [Risk 1]
2. [Risk 2]
3. [Risk 3]

💡 *FORÇAS IDENTIFICADAS:*
1. [Strength 1]
2. [Strength 2]

❓ *PERGUNTAS CRÍTICAS PARA RESPONDER:*
1. [Question 1]
2. [Question 2]
3. [Question 3]

📋 *INFORMAÇÕES ESSENCIAIS FALTANDO:*
1. [Missing 1]
2. [Missing 2]

---

*Recomendação sincera:*

Antes de investir em desenvolvimento, sugiro:

1. *Discovery Workshop* - Refinar problema e solução
2. *Validação de Mercado* - Confirmar demanda real
3. *Prototipação Conceitual* - Testar ideia sem código

Isso vai ECONOMIZAR tempo e dinheiro, garantindo que você construa a solução CERTA.

*Interessado em um Discovery Workshop?*
Responda "DISCOVERY" para saber mais! 🎯
```

**Expected Response:** 10-25% reply rate
**Conversion Target:** Discovery workshop or educational content

---

## Stage 3: Follow-up Sequences

### Timeline & Strategy by Score Tier

#### High Viability (36-40) - Aggressive Follow-up

**T+24h:** First Follow-up (if no response)
```
[Name], tudo bem? 😊

Vi que você recebeu o diagnóstico do seu projeto "[ProjectName]" (${score}/40 pontos) ontem.

Com esse score, você está no TOP 15% dos projetos analisados! 🏆

Ficou com alguma dúvida sobre os próximos passos?

Responda "AGENDAR" para marcar uma conversa rápida (30 min)!
```

**T+48h:** Group Invitation
```
🎉 [Name], tenho um convite especial!

Seu projeto demonstrou alto potencial no PRISMA Score.

Gostaria de te convidar para nossa *Comunidade Exclusiva de Founders de IA*:

🌟 *O que você encontra:*
• Founders trabalhando em projetos reais de IA
• Discussões técnicas e estratégicas
• Networking com outros empreendedores
• Recursos e materiais exclusivos
• Sessões de Q&A comigo

📱 *Link do grupo:*
[WhatsAppGroupLink]

*Obs:* Comunidade GRATUITA e focada em implementação prática, não teoria.

Nos vemos lá! 🚀
```

**T+7d:** Last Touch (if still no response)
```
[Name], última mensagem sobre "[ProjectName]" 😊

Seu diagnóstico (${score}/40) indica alto potencial, mas entendo que talvez não seja o momento certo.

Se quiser retomar no futuro, estou à disposição!

*Ou* responda "MATERIAIS" para receber conteúdo gratuito sobre implementação de projetos de IA.

Sucesso! 🚀
```

---

#### High Potential (26-35) - Moderate Follow-up

**T+48h:** First Follow-up
```
[Name], tudo bem? 😊

Revisitei o diagnóstico de "[ProjectName]" (${score}/40 pontos).

Com alguns ajustes estratégicos, esse projeto pode facilmente chegar ao TOP tier!

Quer conversar sobre como fortalecer os pontos que identificamos?

Responda "SIM" para agendar! 💪
```

**T+7d:** Value-add Follow-up
```
[Name], preparei algo especial! 📚

Baseado na análise de "[ProjectName]", selecionei 3 recursos que podem ajudar:

1. [Resource 1 link]
2. [Resource 2 link]
3. [Resource 3 link]

Se quiser discutir como aplicar isso no seu projeto, responda "BORA"!
```

---

#### Moderate Potential (16-25) - Educational Follow-up

**T+48h:** First Follow-up
```
[Name], obrigado novamente por confiar no PRISMA Score! 🙏

Após revisar "[ProjectName]", identifiquei oportunidades claras de refinamento.

Gostaria de receber um checklist personalizado para fortalecer seu projeto?

Responda "CHECKLIST" para receber! 📋
```

**T+7d:** Case Study
```
[Name], pensei em você! 💡

Acabei de publicar um case study de um projeto similar ao "[ProjectName]" que transformamos de 22 pontos → 34 pontos.

Quer ver o que fizemos?

Responda "CASE" para receber o link!
```

---

#### Low Viability (0-15) - Long-term Nurture

**T+7d:** Educational Content
```
[Name], como vai? 😊

Preparei um mini-guia GRATUITO sobre como validar ideias de IA antes de começar a desenvolver.

É baseado nos erros mais comuns que vejo (incluindo alguns desafios que "[ProjectName]" enfrenta).

Responda "GUIA" para receber! 📖
```

**T+30d:** Check-in
```
[Name], um mês se passou desde o diagnóstico de "[ProjectName]".

Conseguiu avançar com o projeto?

Se sim, adoraria saber! Se não, posso ajudar a desbloquear.

Responda com "UPDATE" ou "AJUDA"! 🤝
```

---

## Stage 4: Response Handling (Automated)

### Keyword Detection & Auto-responses

#### Positive Keywords
- **"SIM", "OK", "VAMOS", "BORA", "QUERO"**
  → Send scheduling link (Calendly/cal.com)

- **"AGENDAR", "MARCAR", "CONVERSAR"**
  → Send consultation booking link

- **"MATERIAIS", "CONTEÚDO", "RECURSOS"**
  → Send curated resource list

- **"GUIA", "CHECKLIST", "CASE"**
  → Send specific content

- **"GRUPO", "COMUNIDADE"**
  → Send WhatsApp group link

#### Negative Keywords
- **"NÃO", "DEPOIS", "MAIS TARDE"**
  → Acknowledge and add to long-term nurture

- **"PARAR", "CANCELAR", "SAIR"**
  → Remove from sequences, send opt-out confirmation

#### Questions
- **"COMO", "QUANTO", "PRAZO", "PREÇO"**
  → Flag for manual response (notify team)

---

## Stage 5: Conversion Paths

### Path 1: Direct Consultation (High Score)
```
Lead → Analysis → Reply "SIM" → Schedule Call → Consultation → Proposal → Client
```
**Target:** 36-40 point leads
**Expected Conversion:** 15-25%

---

### Path 2: Group → Consultation (Medium-High Score)
```
Lead → Analysis → Join Group → Engage → DM Conversation → Consultation → Client
```
**Target:** 26-35 point leads
**Expected Conversion:** 8-15%

---

### Path 3: Workshop → Refinement → Consultation (Medium Score)
```
Lead → Analysis → Discovery Workshop → Refined Project → New Analysis → Consultation
```
**Target:** 16-25 point leads
**Expected Conversion:** 5-10%

---

### Path 4: Education → Nurture → Future Conversion (Low Score)
```
Lead → Analysis → Educational Content → Long-term Nurture → Future Project
```
**Target:** 0-15 point leads
**Expected Conversion:** 2-5% (over 6-12 months)

---

## Implementation Checklist

### Phase 1: Basic Setup (Day 1)
- [ ] Configure Supabase webhooks
- [ ] Set up n8n workflows
- [ ] Test welcome message flow
- [ ] Test analysis message flow
- [ ] Verify phone number formatting

### Phase 2: Message Templates (Day 1-2)
- [ ] Create all 4 score-tier message templates in n8n
- [ ] Test each template with sample data
- [ ] Verify message formatting on mobile
- [ ] Check emoji rendering
- [ ] Test link clicks

### Phase 3: Follow-up Automation (Day 2-3)
- [ ] Create follow-up workflows for each tier
- [ ] Set up scheduling triggers (24h, 48h, 7d)
- [ ] Test follow-up sequences end-to-end
- [ ] Verify responders are excluded from follow-ups

### Phase 4: Response Handling (Day 3-4)
- [ ] Set up keyword detection
- [ ] Configure auto-responses
- [ ] Create manual response notifications
- [ ] Test response routing

### Phase 5: Monitoring & Optimization (Ongoing)
- [ ] Set up analytics dashboard in n8n
- [ ] Track reply rates by score tier
- [ ] Monitor conversion funnel
- [ ] A/B test message variations
- [ ] Optimize follow-up timing

---

## Metrics to Track

### Primary Metrics
- **Welcome Message Delivery Rate:** Target 98%+
- **Analysis Message Delivery Rate:** Target 98%+
- **Initial Response Rate (24h):** Target 30-50%
- **Follow-up Response Rate:** Target 15-30%
- **Consultation Booking Rate:** Target 10-20% (high scores)

### Secondary Metrics
- **Message Read Rate:** Target 80%+
- **Group Join Rate:** Target 40-60% (invited leads)
- **Content Download Rate:** Target 25-40%
- **Opt-out Rate:** Target <3%

### Business Metrics
- **Lead-to-Consultation Conversion:** Target 15%+
- **Consultation-to-Client Conversion:** Target 40%+
- **Overall Lead-to-Client Conversion:** Target 6%+
- **Average Response Time:** Target <2 hours (during business hours)

---

## Best Practices

### Do's ✅
- ✅ Respond immediately to welcome message
- ✅ Personalize with name and project name
- ✅ Be honest about low scores
- ✅ Provide clear next steps
- ✅ Use emojis to increase engagement
- ✅ Keep messages concise (mobile-friendly)
- ✅ Include specific CTAs
- ✅ Test on actual mobile devices

### Don'ts ❌
- ❌ Send more than 1 message per day (except initial sequence)
- ❌ Use spammy language or excessive emojis
- ❌ Oversell or make unrealistic promises
- ❌ Send follow-ups to people who opted out
- ❌ Use ALL CAPS (except for emphasis)
- ❌ Send messages outside business hours (9am-8pm)
- ❌ Continue following up after 3 attempts with no response

---

## Legal Compliance (LGPD/WhatsApp Terms)

### Requirements
1. **Opt-in:** Lead provided phone number voluntarily in form
2. **Identification:** Messages clearly identify sender (PRISMA Score)
3. **Opt-out:** Easy way to stop receiving messages ("PARAR")
4. **Data Privacy:** Phone numbers stored securely, not shared
5. **Business Hours:** Messages only sent 9am-8pm (Brazil time)
6. **Frequency:** No more than 3 messages per week per lead

### Opt-out Handling
When user replies with "PARAR", "CANCELAR", or similar:
```
Entendido, [Name]! ✋

Você não receberá mais mensagens automáticas do PRISMA Score.

Seus dados permanecem seguros conosco e podem ser deletados a qualquer momento.

Para deletar seus dados, envie "DELETAR DADOS".

Obrigado! 🙏
```

---

## Support & Troubleshooting

### Common Issues

**Issue:** Message not delivered
- Check phone number format (must have country code)
- Verify WhatsApp API status
- Check rate limits

**Issue:** Wrong message template sent
- Verify score calculation in analysis
- Check n8n switch node conditions
- Review webhook payload

**Issue:** Follow-up sent to responder
- Verify Supabase update is working
- Check n8n filter conditions
- Review database flags

---

## Future Enhancements

### Phase 2 Features
- [ ] WhatsApp chatbot for common questions
- [ ] Voice message analysis delivery
- [ ] Image/infographic results
- [ ] Multi-language support
- [ ] AI-powered response suggestions

### Phase 3 Features
- [ ] WhatsApp Flows for scheduling
- [ ] Payment via WhatsApp
- [ ] Live Q&A sessions in groups
- [ ] Automated webinar invitations

---

**Last Updated:** 2026-02-18
**Version:** 1.0
**Owner:** Marcos (AIOS Architect)
