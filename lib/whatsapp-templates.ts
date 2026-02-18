/**
 * WhatsApp Message Templates
 *
 * Pre-formatted message templates for automated WhatsApp integration via n8n
 */

import { AnalysisResult, FormData } from './types'

export interface WhatsAppMessage {
  phone: string
  message: string
  metadata?: Record<string, any>
}

/**
 * Format phone number for WhatsApp (Brazilian format)
 * Removes special characters and adds country code if missing
 */
export function formatPhoneForWhatsApp(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '')

  // Add Brazil country code if not present
  if (cleaned.length === 11) {
    return `55${cleaned}` // Brazilian mobile: 11 digits -> 5511XXXXXXXXX
  }

  if (cleaned.length === 10) {
    return `55${cleaned}` // Brazilian landline: 10 digits
  }

  // Already has country code or international format
  return cleaned
}

/**
 * Welcome message for new leads (sent immediately after form submission)
 */
export function generateWelcomeMessage(leadData: Partial<FormData>): WhatsAppMessage {
  const name = leadData.fullName?.split(' ')[0] || 'olá'

  const message = `Olá, ${name}! 👋

Obrigado por compartilhar seu projeto conosco através do *PRISMA Score*.

Estou analisando as informações que você forneceu e em breve terei insights valiosos sobre seu projeto de IA.

_Análise em processamento..._

Enquanto isso, você pode:
• Preparar dúvidas sobre a implementação
• Revisar suas respostas no formulário
• Pensar em detalhes adicionais do projeto

Em alguns instantes você receberá seu diagnóstico completo!

---
*PRISMA Score* - Diagnóstico Inteligente para Projetos de IA`

  return {
    phone: formatPhoneForWhatsApp(leadData.phone || ''),
    message,
    metadata: {
      type: 'welcome',
      leadName: leadData.fullName,
      timestamp: new Date().toISOString(),
    },
  }
}

/**
 * High score analysis message (36-40 points - "alta-viabilidade")
 */
export function generateHighScoreMessage(
  leadData: Partial<FormData>,
  analysis: AnalysisResult
): WhatsAppMessage {
  const name = leadData.fullName?.split(' ')[0] || 'olá'
  const score = analysis.scores.total

  const message = `🎉 *PARABÉNS, ${name.toUpperCase()}!*

Seu projeto "${leadData.projectName}" alcançou *${score}/40 pontos* no PRISMA Score!

🏆 *CLASSIFICAÇÃO: ALTA VIABILIDADE*

Seu projeto demonstra excelente potencial para implementação. Veja os destaques:

✨ *PRINCIPAIS FORÇAS:*
${analysis.strengths.map((s, i) => `${i + 1}. ${s}`).join('\n')}

📊 *PONTUAÇÃO POR DIMENSÃO:*
• Visão: ${analysis.scores.visao.score}/10
• Integração: ${analysis.scores.integracao.score}/10
• Viabilidade: ${analysis.scores.viabilidade.score}/10
• Execução: ${analysis.scores.execucao.score}/10

🎯 *PRÓXIMOS PASSOS RECOMENDADOS:*
${analysis.nextSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

---

*Gostaria de avançar com este projeto?*

Podemos agendar uma conversa estratégica para:
• Detalhar o roadmap de implementação
• Discutir arquitetura técnica
• Planejar cronograma e recursos

Responda "SIM" para receber link de agendamento! 📅`

  return {
    phone: formatPhoneForWhatsApp(leadData.phone || ''),
    message,
    metadata: {
      type: 'high_score',
      score: score,
      classification: analysis.classification,
      leadName: leadData.fullName,
      projectName: leadData.projectName,
      timestamp: new Date().toISOString(),
    },
  }
}

/**
 * Medium-High score analysis message (26-35 points - "potencial-alto")
 */
export function generateMediumHighScoreMessage(
  leadData: Partial<FormData>,
  analysis: AnalysisResult
): WhatsAppMessage {
  const name = leadData.fullName?.split(' ')[0] || 'olá'
  const score = analysis.scores.total

  const message = `👍 *Ótimo trabalho, ${name}!*

Seu projeto "${leadData.projectName}" alcançou *${score}/40 pontos* no PRISMA Score.

📈 *CLASSIFICAÇÃO: ALTO POTENCIAL*

Seu projeto tem fundação sólida e grande potencial. Com alguns ajustes estratégicos, pode alcançar excelência.

✅ *PONTOS FORTES:*
${analysis.strengths.map((s, i) => `${i + 1}. ${s}`).join('\n')}

⚠️ *ÁREAS DE ATENÇÃO:*
${analysis.risks.map((r, i) => `${i + 1}. ${r}`).join('\n')}

📊 *PONTUAÇÃO DETALHADA:*
• Visão: ${analysis.scores.visao.score}/10
• Integração: ${analysis.scores.integracao.score}/10
• Viabilidade: ${analysis.scores.viabilidade.score}/10
• Execução: ${analysis.scores.execucao.score}/10

💡 *RECOMENDAÇÕES:*
${analysis.nextSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

---

*Quer maximizar o potencial do seu projeto?*

Posso ajudar você a:
• Fortalecer os pontos fracos identificados
• Criar roadmap de implementação
• Validar decisões técnicas

Responda "QUERO AJUDA" para agendar consultoria! 🚀`

  return {
    phone: formatPhoneForWhatsApp(leadData.phone || ''),
    message,
    metadata: {
      type: 'medium_high_score',
      score: score,
      classification: analysis.classification,
      leadName: leadData.fullName,
      projectName: leadData.projectName,
      timestamp: new Date().toISOString(),
    },
  }
}

/**
 * Medium score analysis message (16-25 points - "potencial-moderado")
 */
export function generateMediumScoreMessage(
  leadData: Partial<FormData>,
  analysis: AnalysisResult
): WhatsAppMessage {
  const name = leadData.fullName?.split(' ')[0] || 'olá'
  const score = analysis.scores.total

  const message = `${name}, obrigado por compartilhar seu projeto! 🤝

"${leadData.projectName}" obteve *${score}/40 pontos* no PRISMA Score.

📋 *CLASSIFICAÇÃO: POTENCIAL MODERADO*

Seu projeto tem base interessante, mas precisa de refinamento estratégico antes da implementação.

✨ *FORÇAS IDENTIFICADAS:*
${analysis.strengths.map((s, i) => `${i + 1}. ${s}`).join('\n')}

🚨 *RISCOS CRÍTICOS:*
${analysis.risks.map((r, i) => `${i + 1}. ${r}`).join('\n')}

📊 *PONTUAÇÃO POR ÁREA:*
• Visão: ${analysis.scores.visao.score}/10
• Integração: ${analysis.scores.integracao.score}/10
• Viabilidade: ${analysis.scores.viabilidade.score}/10
• Execução: ${analysis.scores.execucao.score}/10

🔍 *INFORMAÇÕES ADICIONAIS NECESSÁRIAS:*
${analysis.missingInfo.map((m, i) => `${i + 1}. ${m}`).join('\n')}

❓ *PERGUNTAS PARA REFINAR O DIAGNÓSTICO:*
${analysis.questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

---

*Este projeto é importante para você?*

Posso ajudar a transformá-lo em algo viável através de:
• Sessão de refinamento estratégico
• Validação de conceito (MVP)
• Roadmap de implementação faseada

Responda "VAMOS REFINAR" para agendar! 💪`

  return {
    phone: formatPhoneForWhatsApp(leadData.phone || ''),
    message,
    metadata: {
      type: 'medium_score',
      score: score,
      classification: analysis.classification,
      leadName: leadData.fullName,
      projectName: leadData.projectName,
      timestamp: new Date().toISOString(),
    },
  }
}

/**
 * Low score analysis message (0-15 points - "baixa-viabilidade")
 */
export function generateLowScoreMessage(
  leadData: Partial<FormData>,
  analysis: AnalysisResult
): WhatsAppMessage {
  const name = leadData.fullName?.split(' ')[0] || 'olá'
  const score = analysis.scores.total

  const message = `Olá, ${name}. Agradeço por confiar no PRISMA Score! 🙏

Analisei "${leadData.projectName}" com atenção. Pontuação: *${score}/40 pontos*.

⚠️ *CLASSIFICAÇÃO: BAIXA VIABILIDADE (no estado atual)*

*Importante:* Isso NÃO significa que seu projeto não tem valor. Significa que precisa de trabalho estratégico ANTES de partir para implementação técnica.

🚨 *PRINCIPAIS DESAFIOS:*
${analysis.risks.map((r, i) => `${i + 1}. ${r}`).join('\n')}

💡 *SE houver forças identificadas:*
${analysis.strengths.length > 0 ? analysis.strengths.map((s, i) => `${i + 1}. ${s}`).join('\n') : '• Conceito inicial interessante\n• Identificação de problema real'}

❓ *PERGUNTAS CRÍTICAS PARA RESPONDER:*
${analysis.questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

📋 *INFORMAÇÕES ESSENCIAIS FALTANDO:*
${analysis.missingInfo.map((m, i) => `${i + 1}. ${m}`).join('\n')}

---

*Recomendação sincera:*

Antes de investir em desenvolvimento, sugiro:

1. *Discovery Workshop* - Refinar problema e solução
2. *Validação de Mercado* - Confirmar demanda real
3. *Prototipação Conceitual* - Testar ideia sem código

Isso vai ECONOMIZAR tempo e dinheiro, garantindo que você construa a solução CERTA.

*Interessado em um Discovery Workshop?*
Responda "DISCOVERY" para saber mais! 🎯`

  return {
    phone: formatPhoneForWhatsApp(leadData.phone || ''),
    message,
    metadata: {
      type: 'low_score',
      score: score,
      classification: analysis.classification,
      leadName: leadData.fullName,
      projectName: leadData.projectName,
      timestamp: new Date().toISOString(),
    },
  }
}

/**
 * Main function to generate appropriate message based on score
 */
export function generateAnalysisMessage(
  leadData: Partial<FormData>,
  analysis: AnalysisResult
): WhatsAppMessage {
  const score = analysis.scores.total

  if (score >= 36) {
    return generateHighScoreMessage(leadData, analysis)
  } else if (score >= 26) {
    return generateMediumHighScoreMessage(leadData, analysis)
  } else if (score >= 16) {
    return generateMediumScoreMessage(leadData, analysis)
  } else {
    return generateLowScoreMessage(leadData, analysis)
  }
}

/**
 * Follow-up message for non-responders (send after 24h)
 */
export function generateFollowUpMessage(
  leadData: Partial<FormData>,
  analysis: AnalysisResult
): WhatsAppMessage {
  const name = leadData.fullName?.split(' ')[0] || 'olá'
  const score = analysis.scores.total

  const message = `${name}, tudo bem? 😊

Vi que você recebeu o diagnóstico do seu projeto "${leadData.projectName}" (${score}/40 pontos) ontem.

Ficou com alguma dúvida sobre os resultados?

Posso esclarecer qualquer ponto da análise ou conversar sobre próximos passos.

*Responda com sua dúvida principal ou "AGENDAR" para marcar uma conversa!*`

  return {
    phone: formatPhoneForWhatsApp(leadData.phone || ''),
    message,
    metadata: {
      type: 'follow_up',
      score: score,
      leadName: leadData.fullName,
      projectName: leadData.projectName,
      timestamp: new Date().toISOString(),
    },
  }
}

/**
 * Group invitation message for high-scoring projects
 */
export function generateGroupInviteMessage(
  leadData: Partial<FormData>,
  groupLink: string
): WhatsAppMessage {
  const name = leadData.fullName?.split(' ')[0] || 'olá'

  const message = `🎉 ${name}, tenho um convite especial!

Seu projeto demonstrou alto potencial no PRISMA Score.

Gostaria de te convidar para nossa *Comunidade Exclusiva de Founders de IA*:

🌟 *O que você encontra:*
• Founders trabalhando em projetos reais de IA
• Discussões técnicas e estratégicas
• Networking com outros empreendedores
• Recursos e materiais exclusivos
• Sessões de Q&A comigo

📱 *Link do grupo:*
${groupLink}

*Obs:* Comunidade GRATUITA e focada em implementação prática, não teoria.

Nos vemos lá! 🚀`

  return {
    phone: formatPhoneForWhatsApp(leadData.phone || ''),
    message,
    metadata: {
      type: 'group_invite',
      leadName: leadData.fullName,
      groupLink: groupLink,
      timestamp: new Date().toISOString(),
    },
  }
}
