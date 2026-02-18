# n8n Integration Guide - PRISMA Score

## Overview

This guide explains how to integrate PRISMA Score with n8n for automated WhatsApp messaging and lead management.

## Architecture

```
┌─────────────────┐
│  PRISMA Score   │
│   (Vercel)      │
└────────┬────────┘
         │
         │ 1. User submits form
         │
         ▼
┌─────────────────┐
│   Supabase DB   │
│  - leads table  │
│  - analyses     │
└────────┬────────┘
         │
         │ 2. Database triggers webhook
         │
         ▼
┌─────────────────┐
│ Webhook Handler │
│   /api/webhooks │
└────────┬────────┘
         │
         │ 3. Sends payload to n8n
         │
         ▼
┌─────────────────┐       ┌──────────────┐
│      n8n        │───────│  WhatsApp    │
│  - Workflows    │   4.  │     API      │
│  - Automation   │       └──────────────┘
└─────────────────┘
```

## Webhook Flow

### Flow 1: New Lead Captured

**Trigger:** User fills in contact info (Step 0 of form)

**Event:** `INSERT` on `public.leads` table

**Webhook Endpoint:** `POST /api/webhooks/new-lead`

**Payload:**
```json
{
  "event": "lead_captured",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "lead_id": "uuid-here",
  "lead": {
    "fullName": "João Silva",
    "email": "joao@example.com",
    "phone": "11999887766",
    "company": "Tech Startup"
  },
  "source": "website",
  "utm": {
    "source": "google",
    "medium": "cpc",
    "campaign": "ia-projects"
  },
  "whatsapp_message": {
    "phone": "5511999887766",
    "message": "Olá, João! 👋\n\nObrigado por compartilhar...",
    "metadata": {
      "type": "welcome",
      "leadName": "João Silva",
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Action:** Send welcome message immediately to WhatsApp

---

### Flow 2: Analysis Completed

**Trigger:** PRISMA Score analysis finishes processing

**Event:** `INSERT` on `public.analyses` table

**Webhook Endpoint:** `POST /api/webhooks/new-analysis`

**Payload:**
```json
{
  "event": "analysis_completed",
  "timestamp": "2024-01-15T10:35:00.000Z",
  "analysis_id": "uuid-here",
  "lead_id": "uuid-here",
  "lead": {
    "fullName": "João Silva",
    "email": "joao@example.com",
    "phone": "11999887766",
    "company": "Tech Startup",
    "projectName": "AI Chatbot for Support"
  },
  "analysis": {
    "scores": {
      "visao": { "score": 8, "analysis": "..." },
      "integracao": { "score": 7, "analysis": "..." },
      "viabilidade": { "score": 9, "analysis": "..." },
      "execucao": { "score": 8, "analysis": "..." },
      "total": 32
    },
    "classification": "potencial-alto",
    "risks": ["Risk 1", "Risk 2", "Risk 3"],
    "strengths": ["Strength 1", "Strength 2", "Strength 3"],
    "nextSteps": ["Step 1", "Step 2", "Step 3"],
    "questions": ["Question 1", "Question 2"],
    "missingInfo": ["Missing info 1"]
  },
  "whatsapp_message": {
    "phone": "5511999887766",
    "message": "👍 Ótimo trabalho, João!\n\nSeu projeto...",
    "metadata": {
      "type": "medium_high_score",
      "score": 32,
      "classification": "potencial-alto",
      "leadName": "João Silva",
      "projectName": "AI Chatbot for Support",
      "timestamp": "2024-01-15T10:35:00.000Z"
    }
  }
}
```

**Action:** Send personalized analysis message based on score

---

## n8n Workflow Setup

### Workflow 1: Lead Welcome Message

**Nodes:**

1. **Webhook Trigger**
   - URL: `https://your-n8n.com/webhook/prisma-lead`
   - Method: POST
   - Authentication: None (handled by webhook signature)

2. **Code Node: Validate Signature** (Optional)
   ```javascript
   const crypto = require('crypto');

   const signature = $input.item.headers['x-webhook-signature'];
   const secret = $env('WEBHOOK_SECRET');
   const payload = JSON.stringify($input.item.json);

   const hmac = crypto.createHmac('sha256', secret);
   const expectedSignature = hmac.update(payload).digest('hex');

   if (signature !== expectedSignature) {
     throw new Error('Invalid webhook signature');
   }

   return { json: $input.item.json };
   ```

3. **WhatsApp Node: Send Message**
   - To: `{{ $json.whatsapp_message.phone }}`
   - Message: `{{ $json.whatsapp_message.message }}`
   - API: Evolution API / WAPI / Meta Business API

4. **Supabase Node: Update Lead** (Mark message as sent)
   - Operation: UPDATE
   - Table: leads
   - Update Fields:
     - `whatsapp_message_sent = true`
     - `whatsapp_message_sent_at = {{ $now }}`

---

### Workflow 2: Analysis Result Message

**Nodes:**

1. **Webhook Trigger**
   - URL: `https://your-n8n.com/webhook/prisma-analysis`
   - Method: POST

2. **Code Node: Validate Signature** (same as above)

3. **WhatsApp Node: Send Analysis**
   - To: `{{ $json.whatsapp_message.phone }}`
   - Message: `{{ $json.whatsapp_message.message }}`

4. **Supabase Node: Update Analysis**
   - Operation: UPDATE
   - Table: analyses
   - Update Fields:
     - `whatsapp_message_sent = true`
     - `whatsapp_message_sent_at = {{ $now }}`

5. **Switch Node: Score-based Actions**
   - Route 1: Score >= 36 (High Viability)
     - Action: Add to "Hot Leads" list
     - Action: Send group invitation
     - Action: Notify sales team

   - Route 2: Score 26-35 (High Potential)
     - Action: Schedule follow-up in 24h
     - Action: Add to nurture sequence

   - Route 3: Score 16-25 (Moderate)
     - Action: Schedule follow-up in 48h
     - Action: Send discovery workshop offer

   - Route 4: Score 0-15 (Low)
     - Action: Schedule follow-up in 7 days
     - Action: Add to educational content sequence

---

### Workflow 3: Follow-up Messages (Scheduled)

**Nodes:**

1. **Schedule Trigger**
   - Interval: Daily at 9:00 AM

2. **HTTP Request: Get Non-responders**
   - Method: GET
   - URL: `https://prisma-score.vercel.app/api/admin/analyses?minScore=26&responded=false&daysAgo=1`
   - Headers:
     - `x-api-key: {{ $env('ADMIN_API_KEY') }}`

3. **Loop Node: For Each Lead**

4. **Code Node: Generate Follow-up Message**
   ```javascript
   const lead = $json;
   const name = lead.full_name.split(' ')[0];

   const message = `${name}, tudo bem? 😊

Vi que você recebeu o diagnóstico do seu projeto "${lead.project_name}" (${lead.score_total}/40 pontos) ontem.

Ficou com alguma dúvida sobre os resultados?

Responda com sua dúvida principal ou "AGENDAR" para marcar uma conversa!`;

   return {
     json: {
       phone: lead.phone,
       message: message,
       lead_id: lead.lead_id,
       analysis_id: lead.id
     }
   };
   ```

5. **WhatsApp Node: Send Follow-up**

6. **Supabase Node: Update Analysis**
   - Set `follow_up_sent = true`

---

## Admin API Endpoints

### GET /api/admin/analyses

**Purpose:** List all analyses with filtering

**Authentication:** Required (`x-api-key` header)

**Query Parameters:**
- `limit` (number, 1-100, default: 50)
- `offset` (number, default: 0)
- `classification` (string: baixa-viabilidade, potencial-moderado, potencial-alto, alta-viabilidade)
- `minScore` (number, 0-40)
- `maxScore` (number, 0-40)
- `dateFrom` (ISO date string)
- `dateTo` (ISO date string)

**Example Request:**
```bash
curl -X GET 'https://prisma-score.vercel.app/api/admin/analyses?minScore=26&limit=20' \
  -H 'x-api-key: your-api-key-here'
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "total": 45,
  "limit": 20,
  "offset": 0,
  "filters": {
    "minScore": 26
  }
}
```

---

### GET /api/admin/stats

**Purpose:** Get aggregated statistics

**Authentication:** Required (`x-api-key` header)

**Query Parameters:**
- `dateFrom` (ISO date string)
- `dateTo` (ISO date string)

**Example Request:**
```bash
curl -X GET 'https://prisma-score.vercel.app/api/admin/stats?dateFrom=2024-01-01' \
  -H 'x-api-key: your-api-key-here'
```

**Response:**
```json
{
  "success": true,
  "timestamp": "2024-01-15T10:00:00.000Z",
  "period": {
    "from": "2024-01-01",
    "to": "now"
  },
  "stats": {
    "overview": {
      "total_leads": 150,
      "total_analyses": 142,
      "conversion_rate": 94.67,
      "avg_score": 24.5
    },
    "by_classification": {
      "baixa-viabilidade": { "count": 25, "percentage": 17.6 },
      "potencial-moderado": { "count": 50, "percentage": 35.2 },
      "potencial-alto": { "count": 45, "percentage": 31.7 },
      "alta-viabilidade": { "count": 22, "percentage": 15.5 }
    },
    ...
  }
}
```

---

## Supabase Webhook Configuration

### Step-by-Step Setup

1. **Go to Supabase Dashboard** → Database → Webhooks

2. **Create Webhook: New Lead**
   - Name: `prisma-new-lead`
   - Table: `public.leads`
   - Events: ☑ INSERT
   - Type: HTTP Request
   - Method: POST
   - URL: `https://prisma-score.vercel.app/api/webhooks/new-lead`
   - HTTP Headers:
     ```
     Content-Type: application/json
     x-webhook-signature: your-webhook-secret
     ```

3. **Create Webhook: New Analysis**
   - Name: `prisma-new-analysis`
   - Table: `public.analyses`
   - Events: ☑ INSERT
   - Type: HTTP Request
   - Method: POST
   - URL: `https://prisma-score.vercel.app/api/webhooks/new-analysis`
   - HTTP Headers:
     ```
     Content-Type: application/json
     x-webhook-signature: your-webhook-secret
     ```

4. **Test Webhooks**
   - Insert a test record in Supabase
   - Check webhook logs in Supabase Dashboard
   - Verify payload received in Vercel logs

---

## Environment Variables Setup

### Vercel Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
SUPABASE_WEBHOOK_SECRET=your-secret-here

# n8n
N8N_WEBHOOK_URL=https://your-n8n.com/webhook/prisma-analysis
N8N_WEBHOOK_URL_LEAD=https://your-n8n.com/webhook/prisma-lead
N8N_API_KEY=your-n8n-api-key

# Admin API
WEBHOOK_API_KEY=your-webhook-api-key
ADMIN_API_KEY=your-admin-api-key
```

### n8n Environment Variables

Add these in n8n Settings → Variables:

```bash
WEBHOOK_SECRET=same-as-supabase-webhook-secret
ADMIN_API_KEY=same-as-vercel-admin-api-key
WHATSAPP_API_URL=your-whatsapp-api-url
WHATSAPP_API_TOKEN=your-whatsapp-token
```

---

## Testing

### Test Webhook Endpoints

**Test New Lead Webhook:**
```bash
curl -X POST https://prisma-score.vercel.app/api/webhooks/new-lead \
  -H 'Content-Type: application/json' \
  -H 'x-webhook-signature: your-secret' \
  -d '{
    "type": "INSERT",
    "table": "leads",
    "record": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "created_at": "2024-01-15T10:00:00Z",
      "full_name": "Test User",
      "email": "test@example.com",
      "phone": "11999887766",
      "company": "Test Co",
      "source": "website"
    },
    "schema": "public",
    "old_record": null
  }'
```

**Test Admin API:**
```bash
curl -X GET https://prisma-score.vercel.app/api/admin/analyses \
  -H 'x-api-key: your-admin-api-key'
```

**Test Health Checks:**
```bash
curl -X GET https://prisma-score.vercel.app/api/webhooks/new-lead
curl -X GET https://prisma-score.vercel.app/api/webhooks/new-analysis
```

---

## Security Considerations

1. **Webhook Signature Verification**
   - Always verify signatures in production
   - Use strong, random secrets (32+ characters)
   - Rotate secrets periodically

2. **API Key Management**
   - Generate unique API keys for each service
   - Never commit keys to version control
   - Use environment variables

3. **Rate Limiting**
   - Webhooks are rate-limited (20 req/sec per IP)
   - Admin APIs require authentication
   - Consider adding IP allowlists for n8n

4. **Data Privacy**
   - WhatsApp messages contain PII
   - Log only essential data
   - Comply with LGPD/GDPR

---

## Troubleshooting

### Webhook Not Firing

1. Check Supabase webhook logs: Database → Webhooks → View logs
2. Verify table triggers are enabled
3. Check Vercel function logs
4. Test webhook endpoint with curl

### n8n Not Receiving Data

1. Verify n8n webhook URL is correct
2. Check n8n execution logs
3. Test with n8n "Test Workflow" feature
4. Verify network connectivity

### WhatsApp Messages Not Sending

1. Check WhatsApp API credentials in n8n
2. Verify phone number format (must include country code)
3. Check WhatsApp API rate limits
4. Review n8n node configuration

---

## Next Steps

1. ✅ Set up Supabase database (run `supabase-setup.sql`)
2. ✅ Configure Supabase webhooks
3. ✅ Add environment variables to Vercel
4. ✅ Create n8n workflows
5. ✅ Test end-to-end flow
6. ✅ Monitor webhook logs
7. ✅ Set up alerts for failures

---

## Support

For issues or questions:
- Check Vercel logs: `vercel logs`
- Check Supabase logs: Database → Webhooks
- Check n8n executions: n8n → Executions
- Review this documentation
- Contact: [your-email@example.com]
