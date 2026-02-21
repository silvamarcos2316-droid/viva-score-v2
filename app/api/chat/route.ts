import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { saveLeadToDatabase } from '@/lib/supabase'

export const runtime = 'nodejs'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!.trim().replace(/\\n/g, ''),
})

// Tool definition for structured data extraction
const extractDataTool = {
  name: 'extract_project_data',
  description: 'Extract structured project data from the conversation to update the PRISMA analysis form. Only call this when you have collected new information from the user.',
  input_schema: {
    type: 'object',
    properties: {
      fullName: {
        type: 'string',
        description: 'Full name of the person (at least 3 characters)',
      },
      email: {
        type: 'string',
        description: 'Professional email address',
      },
      phone: {
        type: 'string',
        description: 'Phone/WhatsApp number in Brazilian format',
      },
      profession: {
        type: 'string',
        description: 'Profession or area of work (e.g., Advogado, Contador, Vendedor)',
      },
      company: {
        type: 'string',
        description: 'Company name (optional)',
      },
      projectName: {
        type: 'string',
        description: 'Name of the AI project (at least 3 characters)',
      },
      problemStatement: {
        type: 'string',
        description: 'Detailed description of the problem the project solves (at least 50 characters)',
      },
      techStack: {
        type: 'array',
        items: { type: 'string' },
        description: 'List of technologies/frameworks being used or considered',
      },
      integrationNeeds: {
        type: 'string',
        description: 'Description of integration needs with existing systems (at least 30 characters)',
      },
      budgetRange: {
        type: 'string',
        description: 'Monthly budget range (e.g., "2000-5000", "5000-10000", etc.)',
      },
      roiExpectation: {
        type: 'string',
        description: 'Expected ROI and business impact description (at least 30 characters)',
      },
      timeline: {
        type: 'string',
        description: 'Timeline for MVP delivery (e.g., "1-3 meses", "3-6 meses", etc.)',
      },
      blockers: {
        type: 'string',
        description: 'Identified blockers and challenges (at least 20 characters)',
      },
    },
  },
}

const systemPrompt = `PROMPT PRISMA — VERSÃO OFICIAL

Você é PRISMA, um sistema de clareza operacional.

Sua função é identificar quando um problema exige:
(A) Automação simples
(B) IA aplicada
(C) Organização de processo
(D) Estrutura estratégica de decisão

OBJETIVO:
Gerar clareza imediata, classificar corretamente o tipo de solução necessária e entregar um mini plano de ação prático — sem hype, sem exageros.

TOM:
• Direto
• Analítico
• Didático
• Anti-exagero
• Seguro
• Sem linguagem técnica desnecessária

REGRAS IMPORTANTES:
• Máximo de 3 mensagens por conversa
• Não faça interrogatório
• Não peça dados pessoais no início
• Não prometa milagres
• Seja realista
• Se não for caso de IA, diga claramente
• Diferencie automação simples de IA aplicada
• Educação antes de venda

FLUXO OBRIGATÓRIO

MENSAGEM 1:
Pergunte apenas: "Qual sua profissão hoje?"
Espere resposta.

MENSAGEM 2 — Diagnóstico Estrutural:
Após a profissão, responda assim:
• Cite 2 ou 3 gargalos comuns reais da área
• Mostre que nem tudo é IA
• Pergunte qual mais incomoda

Modelo de estrutura:
"[Profissão], geralmente vejo três tipos de gargalo nessa área:

• [atividade repetitiva comum]
• [atividade que exige análise/variação]
• [atividade ligada a processo ou decisão]

E aqui vai um ponto importante:

Nem tudo isso exige IA.
Alguns casos resolvem com automação simples bem estruturada.
Outros exigem inteligência aplicada.
E alguns são apenas falta de processo claro.

Qual dessas hoje mais trava sua rotina?"

Espere resposta.

MENSAGEM 3 — Classificação + Mini Plano + Convite:
• MÁXIMO 150 palavras
• Seja extremamente conciso
• Nada de rodeios ou contexto desnecessário

Estrutura obrigatória:
"Isso é [A/B/C/D].

Por quê? [1 frase curta e direta - máximo 20 palavras]

Caminho:
1. [5-8 palavras]
2. [5-8 palavras]
3. [5-8 palavras]

Clareza de processo vem antes de tecnologia. Quer roteiro prático e acesso à comunidade?"

IMPORTANTE — Nunca:
• Exagere ganhos irreais
• Prometa economia absurda
• Fale como vendedor
• Force orçamento

IMPORTANTE — Sempre:
• Classifique com maturidade
• Eduque
• Seja anti-hype
• Posicione como filtro de clareza`

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(request: NextRequest) {
  try {
    const { messages, formData } = await request.json()

    // Build conversation history
    const apiMessages: Anthropic.MessageParam[] = messages.map((msg: ChatMessage) => ({
      role: msg.role,
      content: msg.content,
    }))

    // Call Claude with updated system prompt
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 300,
      system: systemPrompt,
      messages: apiMessages,
      // tools: [extractDataTool], // Will re-enable after testing
    })

    // Extract assistant response
    const textContent = response.content.find((c) => c.type === 'text')
    const assistantMessage = textContent && textContent.type === 'text' ? textContent.text : ''

    // Extract tool calls (data extraction) - DISABLED FOR NOW
    // const toolUse = response.content.find((c) => c.type === 'tool_use')
    let extractedData: Record<string, any> = {}
    let completed = false

    /* DISABLED - Tool use causing errors
    if (toolUse && toolUse.type === 'tool_use') {
      extractedData = toolUse.input as Record<string, any>
      // Check if form is complete
      const input: any = toolUse.input
      completed = !!(
        input.fullName &&
        input.email &&
        input.phone &&
        input.projectName &&
        input.problemStatement &&
        input.techStack &&
        input.integrationNeeds &&
        input.budgetRange &&
        input.roiExpectation &&
        input.timeline &&
        input.blockers
      )
    }
    */

    // Calculate progress based on filled fields
    const allFields = [
      'fullName',
      'email',
      'phone',
      'projectName',
      'problemStatement',
      'techStack',
      'integrationNeeds',
      'budgetRange',
      'roiExpectation',
      'timeline',
      'blockers',
    ]

    const currentData = { ...formData, ...extractedData }
    const filledFields = allFields.filter((field) => {
      const value = currentData[field]
      if (Array.isArray(value)) return value.length > 0
      return value && value.toString().length > 0
    })

    const progress = Math.round((filledFields.length / allFields.length) * 100)

    // Save lead to database if we have contact info and haven't saved yet
    let leadSaved = false
    const hasContactInfo = currentData.fullName && currentData.email && currentData.phone
    const previousHadContactInfo = formData.fullName && formData.email && formData.phone

    if (hasContactInfo && !previousHadContactInfo) {
      // New contact info collected - save to database
      try {
        leadSaved = await saveLeadToDatabase({
          fullName: currentData.fullName,
          email: currentData.email,
          phone: currentData.phone,
          company: currentData.company,
        })
      } catch (err) {
        console.error('Error saving lead:', err)
        // Don't fail the whole request if lead saving fails
      }
    }

    return NextResponse.json({
      success: true,
      message: assistantMessage,
      extractedData,
      progress,
      completed,
      leadSaved,
    })
  } catch (error) {
    console.error('Chat API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    )
  }
}
