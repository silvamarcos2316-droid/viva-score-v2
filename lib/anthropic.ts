import Anthropic from '@anthropic-ai/sdk'
import { FormData, AnalysisResult, VivaScores, DimensionScore } from './types'
import { calculateTotalScore, classifyScore } from './scoring'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

function buildPrompt(formData: FormData): string {
  return `Você é um especialista em validação de projetos de IA. Analise o projeto abaixo usando o framework V.I.V.A.:

**Projeto:** ${formData.projectName}

**1. VISÃO**
Problema a resolver: ${formData.problemStatement}

**2. INTEGRAÇÃO**
Stack Tecnológica: ${formData.techStack.join(', ')}
Necessidades de Integração: ${formData.integrationNeeds}

**3. VIABILIDADE**
Orçamento Mensal: R$${formData.budgetRange}
Expectativa de ROI: ${formData.roiExpectation}

**4. EXECUÇÃO**
Prazo para MVP: ${formData.timeline}
Bloqueadores Identificados: ${formData.blockers}

---

**INSTRUÇÕES PARA ANÁLISE:**

Para cada dimensão (Visão, Integração, Viabilidade, Execução), forneça:
- Uma nota de 0 a 10 (números inteiros apenas)
- Uma análise textual de 2-3 frases explicando a nota

Além disso, identifique:
- 3 riscos críticos mais importantes
- 3 pontos fortes mais relevantes
- 3 próximos passos prioritários

**RESPONDA EXATAMENTE neste formato JSON (sem markdown, apenas o JSON puro):**

{
  "visao": {
    "score": <número 0-10>,
    "analysis": "<2-3 frases explicando a nota baseada no problema descrito>"
  },
  "integracao": {
    "score": <número 0-10>,
    "analysis": "<2-3 frases sobre viabilidade técnica, stack escolhida e complexidade de integrações>"
  },
  "viabilidade": {
    "score": <número 0-10>,
    "analysis": "<2-3 frases sobre realismo do orçamento vs. escopo e clareza do ROI esperado>"
  },
  "execucao": {
    "score": <número 0-10>,
    "analysis": "<2-3 frases sobre realismo do prazo, consciência dos bloqueadores e plano de mitigação>"
  },
  "risks": [
    "<risco crítico 1: específico e acionável>",
    "<risco crítico 2: específico e acionável>",
    "<risco crítico 3: específico e acionável>"
  ],
  "strengths": [
    "<ponto forte 1: baseado nos dados fornecidos>",
    "<ponto forte 2: baseado nos dados fornecidos>",
    "<ponto forte 3: baseado nos dados fornecidos>"
  ],
  "nextSteps": [
    "<próximo passo 1: concreto e imediato>",
    "<próximo passo 2: concreto e imediato>",
    "<próximo passo 3: concreto e imediato>"
  ],
  "questions": [
    "<pergunta 1: para entender melhor a visão do negócio>",
    "<pergunta 2: para validar viabilidade técnica>",
    "<pergunta 3: para esclarecer modelo de negócio>",
    "<pergunta 4: para mapear riscos não identificados>",
    "<pergunta 5: para refinar estratégia de execução>"
  ],
  "missingInfo": [
    "<informação faltante 1: que impactaria a análise>",
    "<informação faltante 2: crítica para validação>",
    "<informação faltante 3: necessária para score mais acurado>"
  ]
}

Seja objetivo, crítico e construtivo. Não infle scores artificialmente. Base sua análise EXCLUSIVAMENTE nos dados fornecidos.

**IMPORTANTE sobre perguntas:**
- Identifique gaps de informação que limitaram sua análise
- Faça perguntas específicas que ajudariam a dar um score mais preciso
- Perguntas devem ser práticas e respondíveis pelo empreendedor
- Liste informações que, se fornecidas, mudariam significativamente a avaliação`
}

function parseClaudeResponse(text: string): any {
  // Try to extract JSON from markdown code blocks or parse directly
  const jsonMatch =
    text.match(/```json\n([\s\S]*?)\n```/) ||
    text.match(/```\n([\s\S]*?)\n```/) ||
    text.match(/\{[\s\S]*\}/)

  const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text
  return JSON.parse(jsonText.trim())
}

export async function analyzeProject(formData: FormData): Promise<AnalysisResult> {
  // Validate API key
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY não configurada')
  }

  const prompt = buildPrompt(formData)

  let message
  try {
    message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })
  } catch (error: any) {
    console.error('Anthropic API error:', error)
    throw new Error(`Erro na API do Claude: ${error.message || 'Erro desconhecido'}`)
  }

  // Extract and parse response
  const responseText =
    message.content[0].type === 'text' ? message.content[0].text : ''

  if (!responseText) {
    throw new Error('Claude retornou resposta vazia')
  }

  let parsed
  try {
    parsed = parseClaudeResponse(responseText)
  } catch (error) {
    console.error('JSON parse error:', error)
    console.error('Response text:', responseText)
    throw new Error('Erro ao interpretar resposta do Claude')
  }

  // Build scores object
  const scores: VivaScores = {
    visao: {
      score: Math.round(parsed.visao.score),
      analysis: parsed.visao.analysis,
    },
    integracao: {
      score: Math.round(parsed.integracao.score),
      analysis: parsed.integracao.analysis,
    },
    viabilidade: {
      score: Math.round(parsed.viabilidade.score),
      analysis: parsed.viabilidade.analysis,
    },
    execucao: {
      score: Math.round(parsed.execucao.score),
      analysis: parsed.execucao.analysis,
    },
    total: 0, // Will be calculated deterministically by backend
  }

  // BACKEND CALCULATES TOTAL SCORE (not LLM)
  scores.total = calculateTotalScore(scores)

  // BACKEND DETERMINES CLASSIFICATION (not LLM)
  const classification = classifyScore(scores.total)

  return {
    scores,
    risks: parsed.risks || [],
    strengths: parsed.strengths || [],
    nextSteps: parsed.nextSteps || [],
    questions: parsed.questions || [],
    missingInfo: parsed.missingInfo || [],
    classification,
  }
}
