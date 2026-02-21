import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { guideTemplates } from '@/lib/guide-templates'
import type { Guide } from '@/lib/guide-templates'

export const runtime = 'nodejs'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!.trim().replace(/\\n/g, ''),
})

export async function POST(req: NextRequest) {
  try {
    const { profession, classification, conversationHistory } = await req.json()

    // Get base template
    const professionKey = profession?.toLowerCase() || ''
    const baseTemplate = guideTemplates[professionKey] || guideTemplates['vendedor'] // fallback

    // For MVP, just return the template with minor personalization
    // In production, you'd use Claude to customize based on conversation
    const guide: Guide = {
      profession: profession || 'Profissional',
      classification: classification || 'potencial-moderado',
      title: baseTemplate.hero?.headline || 'Guia de Automação Personalizado',
      subtitle: baseTemplate.hero?.subheadline || 'Ferramentas práticas para seu negócio',
      hero: {
        headline: baseTemplate.hero?.headline || 'Automação para seu Negócio',
        subheadline: baseTemplate.hero?.subheadline || 'Do dia a dia à estratégia',
      },
      automation: baseTemplate.automation || [],
      iaUse: baseTemplate.iaUse || [],
      truthBomb: baseTemplate.truthBomb || '80% do ganho vem de organização, não IA',
      bottlenecks: baseTemplate.bottlenecks || [
        'Processos manuais repetitivos',
        'Falta de follow-up sistemático',
        'Tempo perdido com tarefas operacionais',
      ],
      communityValue: baseTemplate.communityValue || 'Na comunidade PRISMA você encontra outros profissionais implementando automação na prática.',
    }

    return NextResponse.json({
      success: true,
      guide,
    })
  } catch (error) {
    console.error('Guide generation error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
