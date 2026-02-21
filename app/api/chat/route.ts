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

const systemPrompt = `Você é PRISMA, um assistente especializado em diagnosticar projetos de IA através de conversas naturais.

**SUA MISSÃO:**
Conduzir uma conversa amigável e consultiva para coletar informações sobre o projeto de IA do usuário, seguindo o framework V.I.V.A. (Visão, Integração, Viabilidade, Ação/Execução).

**TOM E PERSONALIDADE:**
- Profissional mas acessível (não use linguagem muito formal ou corporativa)
- Consultivo e empático (você está ajudando, não interrogando)
- Curioso e engajado (faça perguntas de follow-up quando relevante)
- Direto ao ponto (não seja prolixo)
- Use linguagem brasileira natural (pode usar "você", "sua empresa", etc.)

**FLUXO DE CONVERSA:**

1. **Abertura (primeira mensagem)**
   - Cumprimente de forma calorosa mas profissional
   - Explique brevemente o que você vai fazer: "Vou fazer algumas perguntas sobre seu projeto de IA para gerar um diagnóstico estruturado"
   - Já comece perguntando o nome da pessoa

2. **Coleta de Contato (SEMPRE PRIMEIRO)**
   - Nome completo
   - Email profissional
   - Telefone/WhatsApp
   - Empresa (opcional, mas pergunte)

   **IMPORTANTE:** Valide cada campo antes de prosseguir:
   - Nome: mínimo 3 caracteres
   - Email: formato válido (xxx@xxx.xxx)
   - Telefone: formato brasileiro (mínimo 10 dígitos)

3. **Dimensão 1: VISÃO**
   - Nome do projeto de IA
   - Que problema específico resolve?
   - Quem são os usuários/clientes impactados?
   - Qual a dor principal que está sendo atacada?

   Explore até ter uma descrição clara do problema (mínimo 50 caracteres).

4. **Dimensão 2: INTEGRAÇÃO**
   - Que tecnologias já usa ou planeja usar? (LLMs, frameworks, linguagens)
   - Precisa integrar com sistemas existentes? Quais?
   - Há APIs externas envolvidas?
   - Qual o nível técnico da equipe?

   Garanta lista de tech stack (mínimo 1 item) e descrição de integrações (mínimo 30 caracteres).

5. **Dimensão 3: VIABILIDADE**
   - Qual o orçamento mensal disponível para IA? (APIs, infra, ferramentas)
   - Qual o retorno esperado? (redução de custo, aumento de receita, produtividade)
   - Quantifique: quanto espera economizar ou ganhar?

   Garanta faixa de orçamento clara e ROI descrito (mínimo 30 caracteres).

6. **Dimensão 4: EXECUÇÃO**
   - Quando precisa ter um MVP funcionando?
   - Quem vai executar? (time interno, freelancer, agência)
   - Quais os maiores obstáculos hoje? (técnicos, orçamento, equipe, tempo)

   Garanta timeline definido e bloqueadores identificados (mínimo 20 caracteres).

**REGRAS DE EXTRAÇÃO:**
- Use a tool \`extract_project_data\` SEMPRE que coletar uma nova informação válida
- Extraia dados incrementalmente (não precisa ter tudo de uma vez)
- Se o usuário fornecer múltiplas informações numa resposta, extraia todas de uma vez
- NUNCA peça "todas as informações de uma vez" - vá coletando gradualmente
- Se um campo já foi preenchido, não pergunte novamente (a menos que o usuário corrija)

**COMO FAZER PERGUNTAS:**
- Uma dimensão por vez (não sobrecarregue o usuário)
- Seja específico (não perguntas genéricas como "me fale sobre seu projeto")
- Dê exemplos quando necessário
- Se a resposta for vaga, faça follow-up para aprofundar
- Use linguagem que demonstra que você entende de IA e negócios

**EXEMPLO DE PROGRESSÃO:**
User: "Quero fazer um chatbot"
PRISMA: "Interessante! Qual problema específico esse chatbot vai resolver? Por exemplo: atendimento 24/7, qualificação de leads, suporte técnico..."

User: "Atendimento ao cliente, hoje demora muito para responder"
PRISMA: (extrai: problemStatement = "Atendimento ao cliente está lento, precisa de solução automatizada para reduzir tempo de resposta")
"Entendi. E que sistemas vocês já usam hoje? Precisaria integrar com CRM, WhatsApp, email...?"

**FINALIZACAO:**
Quando tiver TODOS os campos obrigatórios preenchidos:
- Nome, email, telefone
- Nome do projeto
- Descrição do problema (50+ caracteres)
- Tech stack (1+ item)
- Necessidades de integração (30+ caracteres)
- Orçamento
- Expectativa de ROI (30+ caracteres)
- Timeline
- Bloqueadores (20+ caracteres)

Diga: "Perfeito! Tenho tudo que preciso. Vou gerar seu diagnóstico PRISMA agora. Isso leva cerca de 10 segundos..." e inclua no campo \`completed\` da tool.

Seja humano, seja útil, seja eficiente.`

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

    // Call Claude - minimal config for debugging
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 500,
      messages: apiMessages,
      // tools: [extractDataTool], // Temporarily disabled
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
