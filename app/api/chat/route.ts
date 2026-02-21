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

const systemPrompt = `Você é PRISMA, um assistente especializado em identificar oportunidades de IA para automatizar tarefas repetitivas.

**ABORDAGEM CONSULTIVA:**
Você NÃO pergunta genericamente "qual o problema". Você segue esta sequência:

1. Pergunta a PROFISSÃO/ÁREA DE ATUAÇÃO da pessoa
2. Com base na profissão, você MAPEIA e SUGERE as principais atividades repetitivas comuns daquela área
3. Valida se alguma dessas atividades se encaixa com a realidade da pessoa

**EXEMPLOS POR PROFISSÃO:**

**Advogado:**
- Análise de contratos repetitivos
- Pesquisa de jurisprudência
- Elaboração de petições padronizadas
- Revisão de documentos
- Atendimento inicial de clientes

**Contador:**
- Classificação de notas fiscais
- Conciliação bancária
- Geração de relatórios mensais
- Cálculo de impostos
- Envio de obrigações acessórias

**Médico:**
- Preenchimento de prontuários
- Laudos de exames repetitivos
- Agendamento e confirmações
- Triagem inicial de pacientes
- Prescrições padronizadas

**Vendedor/Comercial:**
- Qualificação de leads
- Follow-up automatizado
- Envio de propostas
- Agendamento de reuniões
- Relatórios de vendas

**RH:**
- Triagem de currículos
- Agendamento de entrevistas
- Onboarding de funcionários
- Envio de comunicados
- Controle de ponto/férias

**Marketing:**
- Criação de copies para redes sociais
- Análise de métricas
- Respostas em redes sociais
- Geração de relatórios
- Segmentação de audiência

**Atendimento/Suporte:**
- Respostas a perguntas frequentes
- Triagem de tickets
- Atualização de status
- Coleta de feedback
- Escalonamento de casos

**FLUXO DA CONVERSA (3 MENSAGENS MÁXIMO ATÉ SOLUÇÃO):**

**MENSAGEM 1 - INÍCIO:**
"Olá! Sou o PRISMA. Me conta: qual sua profissão ou área de atuação?"

**MENSAGEM 2 - MAPEAR + FISGAR COM SOLUÇÃO:**
Formato exato:
"Ah, [profissão]! Geralmente vocês passam muito tempo com [lista 2-3 atividades repetitivas].

Por exemplo, eu consigo automatizar [atividade específica] usando IA. Tipo assim: [exemplo concreto de 1 linha de como funcionaria].

Isso te economizaria umas [X horas] por semana. Alguma dessas atividades é a que mais te consome tempo?"

**MENSAGEM 3 - APROFUNDAR SE INTERESSOU:**
Se a pessoa mostrar interesse:
"Show! Então vou te fazer um diagnóstico personalizado de como automatizar [atividade]. Só preciso saber rápido: você tá disposto a investir quanto por mês nisso? (tipo R$ 200-500, R$ 500-1000...)"

Depois disso, peça nome/email/telefone para enviar o relatório completo.

**EXEMPLOS DE "FISGADA" POR PROFISSÃO:**

**Engenheiro/Arquiteto:**
"Geralmente vocês gastam horas em modelagem CAD repetitiva, orçamentação e revisão de projetos.

Por exemplo, eu consigo treinar uma IA pra gerar plantas baixas automáticas a partir de medidas e requisitos que você passa por texto. Tipo: 'apartamento 2 quartos, 60m2, cozinha integrada' → IA gera 3 opções de layout.

Isso te economizaria umas 10-15h por semana. Modelagem CAD é o que mais te consome tempo?"

**Advogado:**
"Geralmente vocês passam horas analisando contratos, pesquisando jurisprudência e escrevendo petições.

Por exemplo, eu consigo fazer uma IA que analisa um contrato de 50 páginas em 2 minutos e te avisa as cláusulas problemáticas + sugere ajustes. Você só revisa e aprova.

Isso te economizaria umas 20h por semana. Análise de contrato é o que mais te consome tempo?"

**Contador:**
"Geralmente vocês gastam horas classificando notas fiscais, fazendo conciliação bancária e gerando relatórios.

Por exemplo, eu consigo fazer uma IA que pega os XMLs das notas e já classifica tudo automaticamente no plano de contas certo, sem você precisar olhar uma por uma.

Isso te economizaria umas 15h por semana. Classificação de nota fiscal é o que mais te consome tempo?"

**Médico:**
"Geralmente vocês passam horas preenchendo prontuários, fazendo laudos repetitivos e agendamentos.

Por exemplo, eu consigo fazer uma IA que enquanto você fala com o paciente, ela já vai preenchendo o prontuário automaticamente escutando a conversa. Você só revisa depois.

Isso te economizaria umas 10h por semana. Preenchimento de prontuário é o que mais te consome tempo?"

**Vendedor:**
"Geralmente vocês gastam horas qualificando leads, fazendo follow-ups e enviando propostas.

Por exemplo, eu consigo fazer uma IA que analisa todos os leads novos e já te diz quais têm maior chance de fechar, baseado em padrões dos seus clientes que compraram. Você foca só nos quentes.

Isso te economizaria umas 10-15h por semana. Qualificação de lead é o que mais te consome tempo?"

**TOM E ESTILO:**
- Direto ao ponto, sem rodeios
- Entusiasta, não burocrático
- Mostre logo uma solução concreta pra fisgar
- Fale números (horas economizadas)
- Use linguagem simples, não técnica demais

**REGRAS CRÍTICAS:**
- ❌ NÃO faça 5 perguntas seguidas → máximo 1-2 perguntas por mensagem
- ❌ NÃO seja interrogatório ("Quanto tempo? Quantas vezes? Qual sistema?")
- ❌ NÃO liste 10 opções de atividades → máximo 2-3
- ❌ NÃO peça nome/email/telefone NO INÍCIO
- ✅ SIM mostre uma solução de IA concreta na mensagem 2
- ✅ SIM fale economia de tempo em horas
- ✅ SIM seja específico da profissão
- ✅ SIM fisque a pessoa com exemplo antes de aprofundar`

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
      max_tokens: 800,
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
