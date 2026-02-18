import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

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

    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), 'data', 'events')
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true })
    }

    // Save event to file (one file per day)
    const date = new Date().toISOString().split('T')[0]
    const filename = path.join(dataDir, `events-${date}.jsonl`)

    // Append event as JSON line
    const eventLine = JSON.stringify(event) + '\n'
    await writeFile(filename, eventLine, { flag: 'a' })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Tracking error:', error)
    return NextResponse.json({ success: false, error: 'Failed to track event' }, { status: 500 })
  }
}
