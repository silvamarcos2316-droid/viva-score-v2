import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { analyzeProject } from '@/lib/anthropic'
import { FormDataSchema } from '@/lib/validation'

export const runtime = 'edge' // Use Edge Runtime for faster response

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validatedData = FormDataSchema.parse(body)

    // Call Claude API and get analysis
    const analysis = await analyzeProject(validatedData)

    // Return success response
    return NextResponse.json({
      success: true,
      analysis,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Dados inválidos',
          details: error.issues,
        },
        { status: 400 }
      )
    }

    console.error('Analysis error:', error)

    // Return more descriptive error message
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    )
  }
}
