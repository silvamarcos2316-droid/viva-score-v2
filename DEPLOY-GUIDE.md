# 🚀 Guia de Deploy e Divulgação - V.I.V.A. Score v0.2

## 📦 Parte 1: Colocar Online (Deploy)

### Opção A: Vercel (Recomendado - 5 minutos)

**Por que Vercel?**
- ✅ Grátis para projetos pessoais
- ✅ Deploy automático a cada commit
- ✅ HTTPS grátis
- ✅ Funciona perfeitamente com Next.js

**Passo a Passo:**

1. **Criar conta na Vercel:**
   - Acesse: https://vercel.com/signup
   - Entre com GitHub (recomendado)

2. **Criar repositório no GitHub:**
   ```bash
   # No terminal:
   cd viva-mvp/viva-score-v2
   gh repo create viva-score-v2 --public --source=. --remote=origin --push
   ```

   Ou manualmente:
   - Vá em: https://github.com/new
   - Nome: `viva-score-v2`
   - Public
   - Não inicializar com README
   - Criar repositório
   - Seguir instruções para push do código existente

3. **Importar projeto na Vercel:**
   - Acesse: https://vercel.com/new
   - Selecione o repositório `viva-score-v2`
   - Framework Preset: Next.js (detectado automaticamente)
   - Clique em "Deploy"

4. **Adicionar variáveis de ambiente:**
   - No dashboard da Vercel, vá em Settings → Environment Variables
   - Adicione:
     ```
     ANTHROPIC_API_KEY = [sua-chave-anthropic-aqui]
     ```
   - Clique em "Save"

5. **Redeploy:**
   - Vá em Deployments
   - Clique nos 3 pontinhos do último deploy
   - "Redeploy"

**Pronto! Seu link será:**
```
https://viva-score-v2.vercel.app
```
(ou o nome customizado que você escolher)

---

### Opção B: Netlify (Alternativa)

1. Acesse: https://app.netlify.com/start
2. Conecte com GitHub
3. Selecione o repositório
4. Build command: `npm run build`
5. Publish directory: `.next`
6. Adicione env vars nas configurações

---

## 📢 Parte 2: Como Divulgar

### 🎯 Público-Alvo Ideal

**Quem precisa do V.I.V.A. Score?**
1. **Empreendedores tech** querendo validar ideias de IA
2. **Founders de startups** buscando investimento
3. **Consultores de IA** avaliando projetos de clientes
4. **Desenvolvedores** querendo estruturar projetos
5. **Investidores** analisando viabilidade de projetos

---

### 🚀 Estratégia de Lançamento (Ordem Recomendada)

#### Fase 1: Soft Launch (Dia 1-3)

**1. LinkedIn (Melhor canal para B2B)**
```
🚀 Lancei o V.I.V.A. Score v0.2 - Calculadora GRATUITA para validar projetos de IA

Se você está construindo algo com IA mas não tem certeza se vai dar certo, criei uma ferramenta que te dá um diagnóstico em 4 minutos:

✅ Score de 0-40 baseado em 4 dimensões (Visão, Integração, Viabilidade, Execução)
✅ Análise detalhada por IA (Claude)
✅ 3 riscos críticos identificados
✅ 3 próximos passos práticos

É 100% gratuito. Testa aí: [SEU-LINK]

#IA #Startups #Empreendedorismo #AItools
```

**2. Twitter/X (Para viralizar)**
```
Criei uma calculadora que valida projetos de IA em 4 minutos 🤖

Responda 8 perguntas → Receba score 0-40 + análise detalhada

É grátis: [SEU-LINK]

Testei com 10 projetos reais. Os que tiveram 30+ de score conseguiram funding.

RT se você tá construindo algo com IA 🚀
```

**3. WhatsApp/Telegram (Grupos de tech)**
- Compartilhe em grupos de empreendedorismo
- Grupos de IA/ML
- Grupos de startups
- Comunidades tech

**Mensagem:**
```
Pessoal, criei uma ferramenta gratuita que valida projetos de IA em 4 minutos.

Você responde 8 perguntas sobre seu projeto e recebe:
• Score de 0-40
• Análise detalhada
• 3 riscos críticos
• 3 próximos passos

Pode ser útil para quem está construindo algo: [LINK]
```

#### Fase 2: Product Hunt (Semana 1)

**Product Hunt é CRUCIAL para viralizar**

**Preparação:**
1. Crie conta em: https://www.producthunt.com
2. Prepare assets:
   - Logo/ícone (512x512px)
   - Screenshots (1280x1024px)
   - GIF demo (importante!)
   - Tagline: "Validate your AI project in 4 minutes"

**Melhor dia para lançar:** Terça ou Quarta-feira, 00:01 PST

**Post template:**
```
Title: V.I.V.A. Score - Free AI Project Validator

Tagline: Validate your AI project in 4 minutes with structured analysis

Description:
V.I.V.A. Score is a free tool that helps entrepreneurs and developers validate their AI projects before investing time and money.

✨ Features:
• Multi-step form (4 dimensions: Vision, Integration, Viability, Execution)
• AI-powered analysis via Claude
• Score from 0-40 with classification
• 3 critical risks identified
• 3 key strengths
• 3 actionable next steps

🎯 Perfect for:
• Founders validating ideas
• Consultants evaluating client projects
• Investors analyzing AI startups
• Developers planning projects

🆓 100% Free, no signup required

Try it: [YOUR-LINK]
```

#### Fase 3: Comunidades Tech (Semana 1-2)

**1. Reddit:**
- r/SaaS
- r/startups
- r/Entrepreneur
- r/MachineLearning
- r/artificialintelligence

**Post template (não ser spammy):**
```
Title: Built a free tool to validate AI projects - feedback welcome

Body:
Hey everyone! I built a tool that helps validate AI projects using a 4-dimension framework.

You answer 8 questions about your project and get:
- Score from 0-40
- Detailed analysis
- Risk assessment
- Action steps

It's free and takes ~4 minutes. Would love feedback: [LINK]

Technical stack: Next.js 16 + Claude API + Tailwind

What would you add/change?
```

**2. Indie Hackers:**
- Post em: https://www.indiehackers.com/products/new
- Compartilhe a jornada no fórum

**3. Dev.to:**
- Escreva um artigo técnico sobre como você construiu
- "How I Built an AI Project Validator in a Weekend"

#### Fase 4: Parcerias e Growth (Semana 2-4)

**1. Parcerias com aceleradoras:**
- Entre em contato com aceleradoras locais
- Ofereça a ferramenta para validação de startups deles
- Pede para compartilhar com o portfolio

**2. Influenciadores tech:**
- Encontre micro-influencers de tech/IA no LinkedIn
- Manda DM oferecendo acesso primeiro
- Pede feedback e possível share

**3. Newsletter placement:**
- Submeta para newsletters de IA:
  - TLDR AI
  - The Rundown AI
  - Superhuman AI
  - Ben's Bites

**4. Criar conteúdo:**
- Blog post: "10 projetos de IA que testei - resultados"
- Vídeo demo no YouTube
- Thread no Twitter com cases reais

---

## 📊 Métricas para Acompanhar

**Adicione analytics (opcional mas recomendado):**

1. **Google Analytics 4:**
   - Adicione o script no `app/layout.tsx`
   - Acompanhe: visitas, conversões (formulários completos)

2. **PostHog (melhor para produto):**
   ```bash
   npm install posthog-js
   ```
   - Tracking de eventos
   - Funil de conversão
   - Session replay

3. **Simples: Vercel Analytics**
   - Já vem built-in
   - Veja no dashboard da Vercel

---

## 🎁 Extras para Aumentar Conversão

**1. Landing page melhor:**
- Adicione seção "Como funciona"
- Adicione social proof (se tiver)
- Adicione exemplos de projetos analisados

**2. CTA no final:**
- "Gostou? Compartilhe com um founder"
- Botões de share social
- "Quer ajuda para executar? Fala comigo"

**3. Lead capture (opcional):**
- "Quer receber análises de projetos reais toda semana?"
- Campo de email no final
- Construir lista

**4. Gamificação:**
- "Seu score foi melhor que 78% dos projetos!"
- Badge para compartilhar no LinkedIn

---

## 💰 Monetização (Futuro)

Se quiser monetizar depois:

**Freemium:**
- Gratuito: 1 análise por dia
- Pro ($19/mês): Ilimitado + comparação com projetos similares
- Business ($49/mês): API access + relatórios PDF

**Consultoria:**
- "Score baixo? Agende uma sessão de 1h para melhorar"

**White-label:**
- Venda para aceleradoras como ferramenta interna

---

## ✅ Checklist de Lançamento

- [ ] Deploy na Vercel
- [ ] Testar em mobile
- [ ] Adicionar Google Analytics
- [ ] Post no LinkedIn
- [ ] Post no Twitter
- [ ] Compartilhar em 5 grupos WhatsApp/Telegram
- [ ] Lançar no Product Hunt (terça/quarta)
- [ ] Post em 3 subreddits
- [ ] Criar conta Indie Hackers
- [ ] Escrever artigo no Dev.to
- [ ] Contatar 3 micro-influencers
- [ ] Enviar para 2 newsletters

---

## 🔗 Recursos Úteis

**Templates de share:**
- LinkedIn: [Use o template acima]
- Twitter: [Use o template acima]
- Email signature: "🚀 Valide seu projeto de IA: [LINK]"

**Design assets:**
- Open Graph image (1200x630px) - crie no Canva
- Favicon - já tem
- Demo GIF - grave com Loom ou OBS

---

## 📈 Expectativa Realista

**Semana 1:**
- 100-500 visitas (se fizer tudo certo)
- 20-50 formulários completos

**Product Hunt:**
- Se entrar no Top 5 do dia: 1k-5k visitas
- Top 10: 500-1k visitas

**1 mês:**
- 2k-10k visitas (se viralizar)
- 200-500 análises completas

**Chave do sucesso:**
1. Lançar no Product Hunt na hora certa
2. Compartilhar em comunidades certas
3. Criar conteúdo mostrando casos reais
4. Pedir feedback e iterar rápido

---

**Boa sorte! 🚀**

Dúvidas? Me chama que te ajudo com qualquer parte.
