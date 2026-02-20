/**
 * Supabase Client Configuration
 * PRISMA Score - Data Infrastructure
 */

import { createClient } from '@supabase/supabase-js'

// Validar variáveis de ambiente (trim para remover \n e outros caracteres extras)
const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co').trim().replace(/\\n/g, '')
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key').trim().replace(/\\n/g, '')
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim().replace(/\\n/g, '')

// Log warning if using placeholder values
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.warn('[Supabase] Warning: NEXT_PUBLIC_SUPABASE_URL not configured, using placeholder')
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('[Supabase] Warning: NEXT_PUBLIC_SUPABASE_ANON_KEY not configured, using placeholder')
}

/**
 * Cliente Supabase para uso no frontend (browser)
 * Usa anon key - permissões limitadas via RLS
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
})

/**
 * Cliente Supabase para uso no backend (API routes)
 * Usa service role key - permissões completas
 * ATENÇÃO: Usar apenas em server-side!
 */
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
)

/**
 * Helper: Verificar se está no servidor
 */
export const isServer = typeof window === 'undefined'

/**
 * Helper: Obter cliente apropriado baseado no contexto
 */
export function getSupabaseClient() {
  return isServer ? supabaseAdmin : supabase
}

/**
 * Salvar lead no banco de dados
 */
export async function saveLeadToDatabase(data: {
  fullName?: string
  email?: string
  phone?: string
  company?: string
}) {
  try {
    if (!data.email || !data.fullName) {
      return false
    }

    const { error } = await supabase
      .from('users')
      .upsert(
        {
          name: data.fullName,
          email: data.email,
          phone: data.phone,
          company: data.company,
          last_seen_at: new Date().toISOString(),
        },
        {
          onConflict: 'email',
        }
      )

    if (error) {
      console.error('Error saving lead:', error)
      return false
    }

    return true
  } catch (err) {
    console.error('Exception saving lead:', err)
    return false
  }
}
