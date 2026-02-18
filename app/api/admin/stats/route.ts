/**
 * Admin API: Statistics
 *
 * Protected endpoint to get aggregated statistics
 * Used for dashboards and reporting
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyApiKey } from '@/lib/webhook-security'

export const runtime = 'edge'

// Mock statistics - replace with actual Supabase queries
// TODO: Implement Supabase aggregation queries
async function getStats(dateFrom?: string, dateTo?: string) {
  console.log('[Admin API] Fetching stats:', { dateFrom, dateTo })

  // This is a placeholder. In production, this would query Supabase
  return {
    overview: {
      total_leads: 0,
      total_analyses: 0,
      conversion_rate: 0,
      avg_score: 0,
    },
    by_classification: {
      'baixa-viabilidade': { count: 0, percentage: 0 },
      'potencial-moderado': { count: 0, percentage: 0 },
      'potencial-alto': { count: 0, percentage: 0 },
      'alta-viabilidade': { count: 0, percentage: 0 },
    },
    by_score_range: {
      '0-10': 0,
      '11-20': 0,
      '21-30': 0,
      '31-40': 0,
    },
    dimension_averages: {
      vision: 0,
      integration: 0,
      viability: 0,
      execution: 0,
    },
    top_tech_stacks: [],
    top_industries: [],
    timeline_distribution: {
      '< 3 meses': 0,
      '3-6 meses': 0,
      '6-12 meses': 0,
      '> 12 meses': 0,
    },
    budget_distribution: {
      '< R$ 50k': 0,
      'R$ 50k - R$ 150k': 0,
      'R$ 150k - R$ 300k': 0,
      '> R$ 300k': 0,
    },
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify API key
    const apiKey = request.headers.get('x-api-key')
    if (!verifyApiKey(apiKey)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const dateFrom = searchParams.get('dateFrom') || undefined
    const dateTo = searchParams.get('dateTo') || undefined

    // Fetch statistics
    const stats = await getStats(dateFrom, dateTo)

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      period: {
        from: dateFrom || 'all-time',
        to: dateTo || 'now',
      },
      stats,
    })
  } catch (error) {
    console.error('[Admin API] Error fetching stats:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch statistics',
      },
      { status: 500 }
    )
  }
}

// Health check without auth
export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'X-Service': 'admin-stats',
      'X-Status': 'ok',
    },
  })
}
