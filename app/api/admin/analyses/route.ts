/**
 * Admin API: List Analyses
 *
 * Protected endpoint to list all analyses with filtering and pagination
 * Used by n8n for follow-ups and reporting
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyApiKey } from '@/lib/webhook-security'

export const runtime = 'edge'

// Mock data for now - replace with actual Supabase query
// TODO: Implement Supabase client and query
async function getAnalyses(params: {
  limit?: number
  offset?: number
  classification?: string
  minScore?: number
  maxScore?: number
  dateFrom?: string
  dateTo?: string
}) {
  // This is a placeholder. In production, this would query Supabase
  console.log('[Admin API] Fetching analyses with params:', params)

  // Mock response
  return {
    data: [],
    total: 0,
    limit: params.limit || 50,
    offset: params.offset || 0,
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
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const classification = searchParams.get('classification') || undefined
    const minScore = searchParams.get('minScore')
      ? parseInt(searchParams.get('minScore')!)
      : undefined
    const maxScore = searchParams.get('maxScore')
      ? parseInt(searchParams.get('maxScore')!)
      : undefined
    const dateFrom = searchParams.get('dateFrom') || undefined
    const dateTo = searchParams.get('dateTo') || undefined

    // Validate parameters
    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        { success: false, error: 'Limit must be between 1 and 100' },
        { status: 400 }
      )
    }

    if (offset < 0) {
      return NextResponse.json(
        { success: false, error: 'Offset must be non-negative' },
        { status: 400 }
      )
    }

    // Fetch analyses
    const result = await getAnalyses({
      limit,
      offset,
      classification,
      minScore,
      maxScore,
      dateFrom,
      dateTo,
    })

    return NextResponse.json({
      success: true,
      ...result,
      filters: {
        classification,
        minScore,
        maxScore,
        dateFrom,
        dateTo,
      },
    })
  } catch (error) {
    console.error('[Admin API] Error fetching analyses:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch analyses',
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
      'X-Service': 'admin-analyses',
      'X-Status': 'ok',
    },
  })
}
