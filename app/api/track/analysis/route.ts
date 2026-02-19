import { NextRequest, NextResponse } from 'next/server'

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

    // TODO: Save to Supabase analyses table
    // For now, just log the submission (filesystem operations don't work on Vercel)
    console.log('[Track Analysis] Submission received:', {
      id: submission.id,
      timestamp: submission.timestamp,
      projectName: submission.formData?.projectName,
      score: submission.analysis?.scores?.total,
      classification: submission.analysis?.classification,
    })

    return NextResponse.json({
      success: true,
      id: submission.id,
      message: 'Analysis tracking temporarily disabled - will be migrated to Supabase'
    })
  } catch (error) {
    console.error('[Track Analysis] Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to track analysis'
    }, { status: 500 })
  }
}
