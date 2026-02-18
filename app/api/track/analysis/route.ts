import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export const runtime = 'nodejs'

interface AnalysisSubmission {
  id: string
  timestamp: string
  sessionId?: string
  formData: {
    projectName: string
    problemStatement: string
    techStack: string[]
    integrationNeeds: string
    budgetRange: string
    roiExpectation: string
    timeline: string
    blockers: string
  }
  analysis: {
    scores: {
      vision: number
      integration: number
      viability: number
      execution: number
      total: number
    }
    classification: string
    risks: string[]
    strengths: string[]
    nextSteps: string[]
    questions: string[]
    missingInfo: string[]
  }
  userEmail?: string
  userName?: string
}

export async function POST(request: NextRequest) {
  try {
    const submission: AnalysisSubmission = await request.json()

    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), 'data', 'analyses')
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true })
    }

    // Save analysis to file (one file per submission)
    const filename = path.join(dataDir, `analysis-${submission.id}.json`)
    await writeFile(filename, JSON.stringify(submission, null, 2))

    // Also append to daily log for easy querying
    const date = new Date().toISOString().split('T')[0]
    const logFilename = path.join(dataDir, `analyses-${date}.jsonl`)
    const logLine = JSON.stringify(submission) + '\n'
    await writeFile(logFilename, logLine, { flag: 'a' })

    return NextResponse.json({ success: true, id: submission.id })
  } catch (error) {
    console.error('Analysis tracking error:', error)
    return NextResponse.json({ success: false, error: 'Failed to track analysis' }, { status: 500 })
  }
}
