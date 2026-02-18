/**
 * Webhook: New Lead Captured
 *
 * Receives notification when a new lead is captured (before analysis)
 * Sends welcome WhatsApp message immediately
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import {
  verifyWebhookSignature,
  webhookRateLimiter,
} from '@/lib/webhook-security'
import { generateWelcomeMessage } from '@/lib/whatsapp-templates'

export const runtime = 'edge'

// Validation schema for webhook payload
const LeadWebhookSchema = z.object({
  type: z.literal('INSERT'),
  table: z.literal('leads'),
  record: z.object({
    id: z.string().uuid(),
    created_at: z.string(),
    full_name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    company: z.string().nullable(),
    source: z.string().optional(),
    utm_source: z.string().nullable().optional(),
    utm_medium: z.string().nullable().optional(),
    utm_campaign: z.string().nullable().optional(),
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
    const validatedData = LeadWebhookSchema.parse(payload)

    const { record } = validatedData

    // Build lead data
    const leadData = {
      fullName: record.full_name,
      email: record.email,
      phone: record.phone,
      company: record.company,
    }

    // Generate welcome WhatsApp message
    const whatsappMessage = generateWelcomeMessage(leadData)

    // Prepare payload for n8n
    const n8nPayload = {
      event: 'lead_captured',
      timestamp: record.created_at,
      lead_id: record.id,
      lead: leadData,
      source: record.source || 'website',
      utm: {
        source: record.utm_source,
        medium: record.utm_medium,
        campaign: record.utm_campaign,
      },
      whatsapp_message: whatsappMessage,
    }

    // Send to n8n webhook
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL_LEAD
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
      console.warn(
        '[Webhook] N8N_WEBHOOK_URL_LEAD not configured, skipping n8n call'
      )
    }

    // Log the webhook event
    console.log('[Webhook] New lead:', {
      id: record.id,
      name: record.full_name,
      email: record.email,
      source: record.source,
    })

    return NextResponse.json({
      success: true,
      message: 'Lead webhook processed',
      lead_id: record.id,
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
    webhook: 'new-lead',
    timestamp: new Date().toISOString(),
  })
}
