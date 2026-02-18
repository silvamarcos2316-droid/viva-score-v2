/**
 * Supabase Queries - Reusable database operations
 * PRISMA Score - Data Layer
 */

import { supabaseAdmin } from './supabase'

// ============================================
// TYPES
// ============================================

export interface UserData {
  email: string
  name?: string
  phone?: string
  company?: string
  job_title?: string
  source?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}

export interface SessionData {
  session_id: string
  user_id?: string
  anonymous_id?: string
  user_agent?: string
  browser?: string
  browser_version?: string
  os?: string
  os_version?: string
  device_type?: string
  device_vendor?: string
  device_model?: string
  ip_address?: string
  country?: string
  region?: string
  city?: string
  screen_width?: number
  screen_height?: number
  viewport_width?: number
  viewport_height?: number
  landing_page?: string
  referrer?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}

export interface AnalysisData {
  analysis_id: string
  user_id?: string
  session_id?: string
  project_name: string
  problem_statement: string
  tech_stack: string[]
  integration_needs: string
  budget_range: string
  roi_expectation: string
  timeline: string
  blockers: string
  score_vision?: number
  score_integration?: number
  score_viability?: number
  score_execution?: number
  score_total?: number
  classification?: string
  risks?: string[]
  strengths?: string[]
  next_steps?: string[]
  questions?: string[]
  missing_info?: string[]
  full_analysis_text?: string
  model_used?: string
  tokens_used?: number
  processing_time_ms?: number
}

export interface TrackingEventData {
  session_id: string
  user_id?: string
  event_name: string
  event_category?: string
  event_data?: Record<string, any>
  page_path?: string
  page_title?: string
}

// ============================================
// USER OPERATIONS
// ============================================

/**
 * Criar ou atualizar usuário (lead)
 */
export async function upsertUser(data: UserData) {
  const { data: user, error } = await supabaseAdmin
    .from('users')
    .upsert(
      {
        ...data,
        last_seen_at: new Date().toISOString(),
      },
      {
        onConflict: 'email',
        ignoreDuplicates: false,
      }
    )
    .select()
    .single()

  if (error) throw error
  return user
}

/**
 * Buscar usuário por email
 */
export async function getUserByEmail(email: string) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email', email)
    .is('deleted_at', null)
    .single()

  if (error && error.code !== 'PGRST116') throw error // PGRST116 = not found
  return data
}

// ============================================
// SESSION OPERATIONS
// ============================================

/**
 * Criar nova sessão
 */
export async function createSession(data: SessionData) {
  const { data: session, error } = await supabaseAdmin
    .from('sessions')
    .insert(data)
    .select()
    .single()

  if (error) throw error
  return session
}

/**
 * Atualizar sessão (ex: ended_at)
 */
export async function updateSession(
  sessionId: string,
  updates: Partial<SessionData>
) {
  const { data, error } = await supabaseAdmin
    .from('sessions')
    .update(updates)
    .eq('session_id', sessionId)
    .select()
    .single()

  if (error) throw error
  return data
}

// ============================================
// ANALYSIS OPERATIONS
// ============================================

/**
 * Salvar análise completa
 */
export async function saveAnalysis(data: AnalysisData) {
  const { data: analysis, error } = await supabaseAdmin
    .from('analyses')
    .insert(data)
    .select()
    .single()

  if (error) throw error
  return analysis
}

/**
 * Buscar análise por ID
 */
export async function getAnalysis(analysisId: string) {
  const { data, error } = await supabaseAdmin
    .from('analyses')
    .select(
      `
      *,
      users (email, name, company),
      sessions (device_type, os, country)
    `
    )
    .eq('analysis_id', analysisId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

/**
 * Listar análises recentes
 */
export async function getRecentAnalyses(limit = 10) {
  const { data, error } = await supabaseAdmin
    .from('analyses')
    .select(
      `
      *,
      users (email, name, company),
      sessions (device_type, os, country)
    `
    )
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

// ============================================
// TRACKING OPERATIONS
// ============================================

/**
 * Registrar evento de tracking
 */
export async function trackEvent(data: TrackingEventData) {
  const { error } = await supabaseAdmin.from('tracking_events').insert(data)

  if (error) throw error
}

/**
 * Registrar múltiplos eventos
 */
export async function trackEvents(events: TrackingEventData[]) {
  const { error } = await supabaseAdmin.from('tracking_events').insert(events)

  if (error) throw error
}

// ============================================
// FORM INTERACTIONS
// ============================================

/**
 * Salvar interação com campo do formulário
 */
export async function saveFormInteraction(data: {
  session_id: string
  analysis_id?: string
  field_name: string
  field_label?: string
  field_type?: string
  step_number?: number
  step_name?: string
  focus_count?: number
  total_time_seconds?: number
  typing_time_seconds?: number
  character_count?: number
  word_count?: number
  final_value?: string
}) {
  const { error } = await supabaseAdmin
    .from('form_interactions')
    .upsert(data, {
      onConflict: 'session_id,field_name',
    })

  if (error) throw error
}

// ============================================
// ANALYTICS QUERIES
// ============================================

/**
 * Obter funil de conversão
 */
export async function getConversionFunnel(days = 30) {
  const { data, error } = await supabaseAdmin
    .from('conversion_funnel')
    .select('*')
    .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
    .order('date', { ascending: false })

  if (error) throw error
  return data
}

/**
 * Obter dashboard de análises
 */
export async function getAnalysesDashboard(limit = 50) {
  const { data, error } = await supabaseAdmin
    .from('analyses_dashboard')
    .select('*')
    .limit(limit)

  if (error) throw error
  return data
}

/**
 * Obter estatísticas de dispositivos
 */
export async function getDeviceAnalytics(days = 7) {
  const { data, error } = await supabaseAdmin
    .from('device_analytics')
    .select('*')
    .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
    .order('date', { ascending: false })

  if (error) throw error
  return data
}

/**
 * Obter distribuição de scores
 */
export async function getScoreDistribution() {
  const { data, error } = await supabaseAdmin
    .from('score_distribution')
    .select('*')
    .order('score_range')

  if (error) throw error
  return data
}

/**
 * Obter análise de tráfego
 */
export async function getTrafficSourceAnalysis() {
  const { data, error } = await supabaseAdmin
    .from('traffic_source_analysis')
    .select('*')
    .order('sessions', { ascending: false })

  if (error) throw error
  return data
}
