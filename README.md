# PRISMA - Plataforma de Diagnóstico Estratégico

**URL Principal:** https://prisma-score.vercel.app

Diagnóstico estratégico estruturado para negócios que operam na lógica AI-First.

---

## 🎯 O que é PRISMA?

Framework estruturado para diagnóstico contínuo de projetos AI-First. Análise completa em 4 dimensões com score 0-40.

### Dimensões V.I.V.A:
- **Visão** - Clareza do problema e proposta de valor
- **Integração** - Viabilidade técnica e arquitetura
- **Viabilidade** - Sustentabilidade econômica e ROI
- **Ação** - Plano de execução estruturado

---

## 🚀 Tech Stack

- **Frontend:** Next.js 16 + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 + Framer Motion
- **Backend:** Next.js API Routes (Edge Runtime)
- **AI:** Claude Sonnet 4.5 (Anthropic API)
- **Database:** Supabase (PostgreSQL + RLS)
- **Deploy:** Vercel
- **Analytics:** Built-in tracking system

---

## 🌐 URLs Disponíveis

- **Principal:** https://prisma-score.vercel.app
- **Alternativas:**
  - https://diagnostico-prisma.vercel.app
  - https://prisma-diagnostico.vercel.app

---

## 🔧 Setup Local

```bash
cd viva-mvp/viva-score-v2
npm install
npm run dev
```

Acesse: http://localhost:3000

---

## 📊 Estrutura do Projeto

```
viva-score-v2/
├── app/
│   ├── page.tsx              # Landing page (Hero + Value Props)
│   ├── calculator/page.tsx   # Formulário V.I.V.A.
│   ├── results/page.tsx      # Resultados do diagnóstico
│   └── api/
│       ├── analyze/route.ts  # Integração Claude API
│       └── track/route.ts    # Sistema de tracking
├── components/
│   ├── steps/                # Componentes das 4 dimensões
│   ├── ProgressBar.tsx
│   └── TestimonialsSection.tsx
└── lib/
    ├── anthropic.ts          # Cliente Anthropic
    ├── scoring.ts            # Lógica de pontuação
    └── tracking.ts           # Analytics

```

---

## 🔐 Variáveis de Ambiente

```env
ANTHROPIC_API_KEY=sk-ant-api03-...
```

---

## 📈 Métricas e Analytics

Sistema completo de tracking implementado:
- Page views e conversões
- Tempo de preenchimento
- Scores gerados
- Taxas de conclusão

Ver: `TRACKING.md` para detalhes.

---

## 🚢 Deploy

Deploy automático via Vercel conectado ao GitHub.

```bash
npx vercel --prod
```

Ver: `DEPLOY-GUIDE.md` para instruções completas.

---

## 📱 Marketing

Templates prontos para redes sociais em: `SOCIAL-MEDIA-TEMPLATES.md`

---

## 📄 Licença

Projeto proprietário - Marcos Silva © 2026
