/**
 * Exemplos de uso do Supabase
 * PRISMA Score - Usage Examples
 */

import { supabaseAdmin } from './supabase'
import {
  upsertUser,
  createSession,
  saveAnalysis,
  trackEvent,
  getRecentAnalyses,
  getConversionFunnel,
} from './supabase-queries'

// ============================================
// EXEMPLO 1: Capturar Lead
// ============================================

export async function capturarLead(email: string, name: string, company?: string) {
  try {
    const user = await upsertUser({
      email,
      name,
      company,
      source: 'prisma-web',
    })

    console.log('Lead capturado:', user.id)
    return user
  } catch (error) {
    console.error('Erro ao capturar lead:', error)
    throw error
  }
}

// ============================================
// EXEMPLO 2: Criar Sessão de Navegação
// ============================================

export async function criarSessao(sessionId: string, deviceInfo: any) {
  try {
    const session = await createSession({
      session_id: sessionId,
      ...deviceInfo,
      landing_page: '/calculator',
      started_at: new Date().toISOString(),
    })

    console.log('Sessão criada:', session.id)
    return session
  } catch (error) {
    console.error('Erro ao criar sessão:', error)
    throw error
  }
}

// ============================================
// EXEMPLO 3: Salvar Análise Completa
// ============================================

export async function salvarAnalise(formData: any, analysis: any) {
  try {
    const savedAnalysis = await saveAnalysis({
      analysis_id: crypto.randomUUID(),
      project_name: formData.projectName,
      problem_statement: formData.problemStatement,
      tech_stack: formData.techStack,
      integration_needs: formData.integrationNeeds,
      budget_range: formData.budgetRange,
      roi_expectation: formData.roiExpectation,
      timeline: formData.timeline,
      blockers: formData.blockers,
      score_vision: analysis.scores.vision,
      score_integration: analysis.scores.integration,
      score_viability: analysis.scores.viability,
      score_execution: analysis.scores.execution,
      score_total: analysis.scores.total,
      classification: analysis.classification,
      risks: analysis.risks,
      strengths: analysis.strengths,
      next_steps: analysis.nextSteps,
      questions: analysis.questions,
      missing_info: analysis.missingInfo,
      full_analysis_text: JSON.stringify(analysis),
      model_used: 'claude-opus-4.6',
    })

    console.log('Análise salva:', savedAnalysis.id)
    return savedAnalysis
  } catch (error) {
    console.error('Erro ao salvar análise:', error)
    throw error
  }
}

// ============================================
// EXEMPLO 4: Tracking de Eventos
// ============================================

export async function trackPageView(sessionId: string, path: string) {
  try {
    await trackEvent({
      session_id: sessionId,
      event_name: 'page_view',
      event_category: 'navigation',
      page_path: path,
      page_title: document.title,
    })
  } catch (error) {
    console.error('Erro ao trackear page view:', error)
  }
}

export async function trackFormStart(sessionId: string) {
  try {
    await trackEvent({
      session_id: sessionId,
      event_name: 'form_start',
      event_category: 'form',
      page_path: '/calculator',
    })
  } catch (error) {
    console.error('Erro ao trackear form start:', error)
  }
}

export async function trackStepChange(sessionId: string, step: number) {
  try {
    await trackEvent({
      session_id: sessionId,
      event_name: 'step_change',
      event_category: 'form',
      event_data: { step },
    })
  } catch (error) {
    console.error('Erro ao trackear step change:', error)
  }
}

// ============================================
// EXEMPLO 5: Buscar Dados para Dashboard
// ============================================

export async function getDashboardData() {
  try {
    const [analyses, funnel] = await Promise.all([
      getRecentAnalyses(20),
      getConversionFunnel(30),
    ])

    return {
      analyses,
      funnel,
    }
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error)
    throw error
  }
}

// ============================================
// EXEMPLO 6: Query Customizada
// ============================================

export async function buscarAnalisesPorClassificacao(classification: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('analyses')
      .select('*')
      .eq('classification', classification)
      .order('score_total', { ascending: false })
      .limit(10)

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erro ao buscar análises:', error)
    throw error
  }
}

// ============================================
// EXEMPLO 7: Filtros Complexos
// ============================================

export async function buscarAnalisesAvancadas(filters: {
  minScore?: number
  maxScore?: number
  budgetRange?: string
  timeline?: string
  dateFrom?: Date
  dateTo?: Date
}) {
  try {
    let query = supabaseAdmin.from('analyses').select('*')

    if (filters.minScore) {
      query = query.gte('score_total', filters.minScore)
    }

    if (filters.maxScore) {
      query = query.lte('score_total', filters.maxScore)
    }

    if (filters.budgetRange) {
      query = query.eq('budget_range', filters.budgetRange)
    }

    if (filters.timeline) {
      query = query.eq('timeline', filters.timeline)
    }

    if (filters.dateFrom) {
      query = query.gte('created_at', filters.dateFrom.toISOString())
    }

    if (filters.dateTo) {
      query = query.lte('created_at', filters.dateTo.toISOString())
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erro ao buscar análises avançadas:', error)
    throw error
  }
}

// ============================================
// EXEMPLO 8: Estatísticas Agregadas
// ============================================

export async function getStatistics() {
  try {
    // Total de análises
    const { count: totalAnalyses } = await supabaseAdmin
      .from('analyses')
      .select('*', { count: 'exact', head: true })

    // Total de leads
    const { count: totalLeads } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null)

    // Score médio
    const { data: avgScore } = await supabaseAdmin
      .rpc('get_average_score') // Você precisaria criar essa função no Postgres

    // Análises hoje
    const { count: todayAnalyses } = await supabaseAdmin
      .from('analyses')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date().toISOString().split('T')[0])

    return {
      totalAnalyses,
      totalLeads,
      avgScore,
      todayAnalyses,
    }
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    throw error
  }
}
