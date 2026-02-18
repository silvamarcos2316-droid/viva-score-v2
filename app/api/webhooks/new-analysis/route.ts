/**
 * Webhook: New Analysis Completed
 *
 * Receives notification when a new PRISMA Score analysis is completed
 * Triggers n8n workflow for WhatsApp message sending
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import {
  verifyWebhookSignature,
  webhookRateLimiter,
} from '@/lib/webhook-security'
import {
  generateAnalysisMessage,
  generateWelcomeMessage,
  type WhatsAppMessage,
} from '@/lib/whatsapp-templates'

export const runtime = 'edge'

// Validation schema for webhook payload
const AnalysisWebhookSchema = z.object({
  type: z.literal('INSERT'),
  table: z.literal('analyses'),
  record: z.object({
    id: z.string().uuid(),
    created_at: z.string(),
    // Lead data
    lead_id: z.string().uuid(),
    full_name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    company: z.string().nullable(),
    // Project data
    project_name: z.string(),
    problem_statement: z.string(),
    tech_stack: z.array(z.string()),
    integration_needs: z.string(),
    budget_range: z.string(),
    roi_expectation: z.string(),
    timeline: z.string(),
    blockers: z.string(),
    // Analysis results
    score_vision: z.number(),
    score_integration: z.number(),
    score_viability: z.number(),
    score_execution: z.number(),
    score_total: z.number(),
    classification: z.enum([
      'baixa-viabilidade',
      'potencial-moderado',
      'potencial-alto',
      'alta-viabilidade',
    ]),
    risks: z.array(z.string()),
    strengths: z.array(z.string()),
    next_steps: z.array(z.string()),
    questions: z.array(z.string()),
    missing_info: z.array(z.string()),
    vision_analysis: z.string(),
    integration_analysis: z.string(),
    viability_analysis: z.string(),
    execution_analysis: z.string(),
  }),
  schema: z.string(),
  old_record: z.null(),
})

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown'

    // Check rate limit
    if (!webhookRateLimiter.checkLimit(clientIp)) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    // Get raw body for signature verification
    const rawBody = await request.text()
    const signature = request.headers.get('x-webhook-signature')

    // Verify webhook signature (if configured)
    const webhookSecret = process.env.SUPABASE_WEBHOOK_SECRET
    if (webhookSecret && signature) {
      const isValid = verifyWebhookSignature(rawBody, signature, webhookSecret)
      if (!isValid) {
        console.error('[Webhook] Invalid signature')
        return NextResponse.json(
          { success: false, error: 'Invalid signature' },
          { status: 401 }
        )
      }
    }

    // Parse and validate payload
    const payload = JSON.parse(rawBody)
    const validatedData = AnalysisWebhookSchema.parse(payload)

    const { record } = validatedData

    // Build structured data for n8n
    const leadData = {
      fullName: record.full_name,
      email: record.email,
      phone: record.phone,
      company: record.company,
      projectName: record.project_name,
    }

    const analysis = {
      scores: {
        visao: {
          score: record.score_vision,
          analysis: record.vision_analysis,
        },
        integracao: {
          score: record.score_integration,
          analysis: record.integration_analysis,
        },
        viabilidade: {
          score: record.score_viability,
          analysis: record.viability_analysis,
        },
        execucao: {
          score: record.score_execution,
          analysis: record.execution_analysis,
        },
        total: record.score_total,
      },
      classification: record.classification,
      risks: record.risks,
      strengths: record.strengths,
      nextSteps: record.next_steps,
      questions: record.questions,
      missingInfo: record.missing_info,
    }

    // Generate WhatsApp message
    const whatsappMessage = generateAnalysisMessage(leadData, analysis)

    // Prepare payload for n8n
    const n8nPayload = {
      event: 'analysis_completed',
      timestamp: record.created_at,
      analysis_id: record.id,
      lead_id: record.lead_id,
      lead: leadData,
      analysis: analysis,
      whatsapp_message: whatsappMessage,
    }

    // Send to n8n webhook
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL
    if (n8nWebhookUrl) {
      const n8nResponse = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Source': 'prisma-score',
        },
        body: JSON.stringify(n8nPayload),
      })

      if (!n8nResponse.ok) {
        console.error(
          '[Webhook] Failed to send to n8n:',
          n8nResponse.status,
          await n8nResponse.text()
        )
      } else {
        console.log('[Webhook] Successfully sent to n8n:', record.id)
      }
    } else {
      console.warn('[Webhook] N8N_WEBHOOK_URL not configured, skipping n8n call')
    }

    // Log the webhook event
    console.log('[Webhook] New analysis:', {
      id: record.id,
      lead: record.full_name,
      score: record.score_total,
      classification: record.classification,
    })

    return NextResponse.json({
      success: true,
      message: 'Analysis webhook processed',
      analysis_id: record.id,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[Webhook] Validation error:', error.issues)
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid webhook payload',
          details: error.issues,
        },
        { status: 400 }
      )
    }

    console.error('[Webhook] Processing error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process webhook',
      },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    webhook: 'new-analysis',
    timestamp: new Date().toISOString(),
  })
}
