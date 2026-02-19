import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

interface TrackingEvent {
  event: string
  timestamp: string
  sessionId?: string
  data?: Record<string, any>
}

export async function POST(request: NextRequest) {
  try {
    const event: TrackingEvent = await request.json()

    // TODO: Save to Supabase tracking_events table
    // For now, just log the event (filesystem operations don't work on Vercel)
    console.log('[Track] Event received:', {
      event: event.event,
      timestamp: event.timestamp,
      sessionId: event.sessionId,
    })

    return NextResponse.json({
      success: true,
      message: 'Tracking temporarily disabled - will be migrated to Supabase'
    })
  } catch (error) {
    console.error('[Track] Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to track event'
    }, { status: 500 })
  }
}
