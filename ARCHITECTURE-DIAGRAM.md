# PRISMA Score - Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           PRISMA Score System                            │
│                     WhatsApp Integration Architecture                   │
└─────────────────────────────────────────────────────────────────────────┘


┌───────────────┐
│               │
│  End User     │  1. Fills form on website
│  (Browser)    │     https://prisma-score.vercel.app
│               │
└───────┬───────┘
        │
        │ HTTPS
        │
        ▼
┌───────────────────────────────────────────────────────────────────────┐
│                                                                        │
│  VERCEL (Edge Runtime)                                                 │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Next.js App                                                  │   │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │   │
│  │  │  Form Page     │  │  API Routes    │  │  Edge Functions│ │   │
│  │  │  /             │  │  /api/analyze  │  │  (Runtime)     │ │   │
│  │  │  (React)       │  │  /api/track    │  │                │ │   │
│  │  └────────────────┘  └────────────────┘  └────────────────┘ │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                        │
└────────────────┬───────────────────────────┬───────────────────────────┘
                 │                           │
                 │ 2. Save lead/analysis     │ 5. Receive webhook
                 │                           │
                 ▼                           ▼
        ┌─────────────────┐         ┌──────────────────┐
        │   SUPABASE      │         │  Webhook Handler │
        │   PostgreSQL    │         │  /api/webhooks/  │
        │                 │         │                  │
        │  ┌───────────┐  │         │  ┌────────────┐ │
        │  │  leads    │  │◄────────┤  │ new-lead   │ │
        │  │  table    │  │ 6.Query │  └────────────┘ │
        │  └───────────┘  │         │                  │
        │                 │         │  ┌────────────┐ │
        │  ┌───────────┐  │◄────────┤  │new-analysis│ │
        │  │ analyses  │  │         │  └────────────┘ │
        │  │  table    │  │         │                  │
        │  └───────────┘  │         │  Security:       │
        │                 │         │  • HMAC-SHA256   │
        │  ┌───────────┐  │         │  • API Keys      │
        │  │ whatsapp_ │  │         │  • Rate Limit    │
        │  │ messages  │  │         └──────────────────┘
        │  └───────────┘  │
        └────────┬────────┘
                 │
                 │ 3. Database Trigger (INSERT)
                 │    Fires webhook to Vercel
                 │
                 ▼
        ┌─────────────────────────────────────────┐
        │  Supabase Webhooks                      │
        │  ┌────────────────┐  ┌────────────────┐│
        │  │ Trigger: leads │  │Trigger:analyses││
        │  │ Event: INSERT  │  │ Event: INSERT  ││
        │  └────────┬───────┘  └────────┬───────┘│
        └───────────┼──────────────────┼─────────┘
                    │                  │
                    │ 4. HTTP POST     │
                    │    (Webhook)     │
                    │                  │
                    └──────────┬───────┘
                               │
                               ▼
                ┌──────────────────────────────────┐
                │  Vercel Edge Function            │
                │  /api/webhooks/new-lead          │
                │  /api/webhooks/new-analysis      │
                │                                   │
                │  1. Verify signature (HMAC)      │
                │  2. Validate payload (Zod)       │
                │  3. Generate WhatsApp message    │
                │  4. Send to n8n webhook          │
                └──────────────┬───────────────────┘
                               │
                               │ 7. HTTP POST
                               │    (JSON payload)
                               │
                               ▼
        ┌──────────────────────────────────────────────────┐
        │  n8n (Workflow Automation)                       │
        │  ┌────────────────────────────────────────────┐ │
        │  │  Workflow 1: Welcome Message               │ │
        │  │  ┌──────────┐  ┌────────┐  ┌───────────┐  │ │
        │  │  │ Webhook  │─▶│WhatsApp│─▶│Update DB │  │ │
        │  │  │ Trigger  │  │  Send  │  │(Supabase)│  │ │
        │  │  └──────────┘  └────────┘  └───────────┘  │ │
        │  └────────────────────────────────────────────┘ │
        │                                                  │
        │  ┌────────────────────────────────────────────┐ │
        │  │  Workflow 2: Analysis Results              │ │
        │  │  ┌──────────┐  ┌────────┐  ┌───────────┐  │ │
        │  │  │ Webhook  │─▶│Switch  │─▶│WhatsApp   │  │ │
        │  │  │ Trigger  │  │(Score) │  │Send       │  │ │
        │  │  └──────────┘  └────┬───┘  └───────────┘  │ │
        │  │                     │                       │ │
        │  │                     ├─▶ High: Send + Invite│ │
        │  │                     ├─▶ Medium: Send + Tag │ │
        │  │                     └─▶ Low: Send + Nurture│ │
        │  └────────────────────────────────────────────┘ │
        │                                                  │
        │  ┌────────────────────────────────────────────┐ │
        │  │  Workflow 3: Follow-up (Scheduled)         │ │
        │  │  ┌──────────┐  ┌────────┐  ┌───────────┐  │ │
        │  │  │Schedule  │─▶│Admin   │─▶│Loop       │  │ │
        │  │  │(Daily)   │  │API Call│  │& Send     │  │ │
        │  │  └──────────┘  └────────┘  └───────────┘  │ │
        │  └────────────────────────────────────────────┘ │
        └──────────────────────┬───────────────────────────┘
                               │
                               │ 8. Call WhatsApp API
                               │
                               ▼
        ┌──────────────────────────────────────────┐
        │  WhatsApp Business API / Evolution API   │
        │  ┌────────────────────────────────────┐ │
        │  │  Message Delivery                  │ │
        │  │  • Phone: 5511999887766            │ │
        │  │  • Message: Personalized text      │ │
        │  │  • Type: text/image/document       │ │
        │  └────────────────────────────────────┘ │
        └──────────────────┬───────────────────────┘
                           │
                           │ 9. Deliver message
                           │
                           ▼
                  ┌────────────────┐
                  │                │
                  │   End User     │
                  │  (WhatsApp)    │
                  │                │
                  └────────────────┘
```

---

## Data Flow Sequence

### Flow 1: New Lead Captured

```
User → Form → Vercel → Supabase → Webhook → Vercel → n8n → WhatsApp → User
(fills) (save)          (trigger)  (notify)  (process) (send)     (receives)

Timeline: 0s → 1s → 2s → 3s → 5s → 7s → 10s → 15-30s
```

**Breakdown:**
1. **T+0s:** User submits form (step 0 - contact info)
2. **T+1s:** Vercel API saves to Supabase `leads` table
3. **T+2s:** Supabase INSERT trigger fires webhook
4. **T+3s:** Vercel webhook handler receives notification
5. **T+5s:** Webhook generates welcome message template
6. **T+7s:** Payload sent to n8n webhook
7. **T+10s:** n8n workflow executes WhatsApp send
8. **T+15-30s:** User receives welcome message on WhatsApp

---

### Flow 2: Analysis Completed

```
Claude API → Vercel → Supabase → Webhook → Vercel → n8n → WhatsApp → User
(finishes)   (save)              (trigger)  (notify)  (route)  (send)  (receives)

Timeline: Analysis complete → 1s → 2s → 3s → 5s → 10s → 15-30s
```

**Breakdown:**
1. **Analysis completes:** Claude API returns scores + insights
2. **T+1s:** Vercel saves to Supabase `analyses` table
3. **T+2s:** Supabase INSERT trigger fires webhook
4. **T+3s:** Vercel webhook handler receives notification
5. **T+5s:** Generate score-based message template
6. **T+10s:** n8n routes based on score (switch node)
7. **T+15-30s:** User receives personalized analysis on WhatsApp

---

### Flow 3: Follow-up Messages (Scheduled)

```
n8n Schedule → Admin API → Supabase → n8n Process → WhatsApp → Users
(daily 9am)    (query)                  (loop)        (batch)

Timeline: Daily 9:00 AM → continuous processing (batch)
```

**Breakdown:**
1. **9:00 AM:** n8n schedule trigger fires
2. **Query:** Call `/api/admin/analyses?responded=false&daysAgo=1`
3. **Loop:** For each non-responder, generate follow-up message
4. **Send:** Batch send via WhatsApp (respecting rate limits)
5. **Update:** Mark `follow_up_sent = true` in Supabase

---

## Component Details

### 1. Frontend (Next.js + React)

```
app/
├── page.tsx                    # Main form page
├── components/
│   ├── VivaForm.tsx           # Multi-step form component
│   ├── ScoreDisplay.tsx       # Analysis results display
│   └── ConsentBanner.tsx      # LGPD consent
└── api/
    ├── analyze/route.ts       # Claude API integration
    └── track/route.ts         # Analytics tracking
```

**Technologies:**
- Next.js 16 (App Router)
- React 19
- TailwindCSS 4
- Framer Motion (animations)
- Zod (validation)

---

### 2. Backend APIs (Vercel Edge Functions)

```
app/api/
├── webhooks/
│   ├── new-lead/route.ts       # Receives lead notifications
│   └── new-analysis/route.ts   # Receives analysis notifications
└── admin/
    ├── analyses/route.ts       # List/filter analyses
    └── stats/route.ts          # Aggregated statistics
```

**Technologies:**
- Vercel Edge Runtime
- TypeScript
- Zod validation
- HMAC-SHA256 signature verification
- Token bucket rate limiting

---

### 3. Database (Supabase PostgreSQL)

```
Tables:
├── leads
│   ├── id (uuid, pk)
│   ├── full_name (text)
│   ├── email (text)
│   ├── phone (text)
│   ├── company (text, nullable)
│   ├── utm_* (tracking)
│   └── timestamps
│
├── analyses
│   ├── id (uuid, pk)
│   ├── lead_id (uuid, fk → leads)
│   ├── project_name (text)
│   ├── score_* (integers 0-10)
│   ├── score_total (computed 0-40)
│   ├── classification (enum)
│   ├── risks[] (text array)
│   ├── strengths[] (text array)
│   ├── next_steps[] (text array)
│   └── engagement tracking flags
│
└── whatsapp_messages (optional)
    ├── id (uuid, pk)
    ├── lead_id (uuid, fk)
    ├── analysis_id (uuid, fk)
    ├── message_type (enum)
    ├── status (enum)
    └── timestamps
```

**Features:**
- Row Level Security (RLS)
- Automatic webhooks (INSERT triggers)
- Helper functions for analytics
- Indexes for performance

---

### 4. Automation Layer (n8n)

```
Workflows:
├── 1. Welcome Message
│   └── Webhook → WhatsApp → Update DB
│
├── 2. Analysis Results
│   └── Webhook → Score Switch → WhatsApp → Actions
│       ├── High (36-40): Send + Group Invite
│       ├── Medium-High (26-35): Send + Tag
│       ├── Medium (16-25): Send + Nurture
│       └── Low (0-15): Send + Education
│
└── 3. Follow-ups (Scheduled)
    └── Cron → Admin API → Loop → WhatsApp → Update DB
```

**Features:**
- Webhook triggers
- HTTP requests to admin APIs
- Conditional routing (Switch nodes)
- Loops for batch processing
- Error handling & retries

---

### 5. Messaging Layer (WhatsApp)

**Options:**
1. **WhatsApp Business API** (Official)
   - Requires Meta Business verification
   - Higher reliability
   - Official support

2. **Evolution API** (Open source)
   - Self-hosted
   - No verification needed
   - Free but requires maintenance

**Message Format:**
```
{
  "phone": "5511999887766",      // Country + DDD + Number
  "message": "Text with *bold*", // Markdown-like formatting
  "metadata": {
    "type": "analysis_result",
    "score": 32,
    "lead_id": "uuid"
  }
}
```

---

## Security Architecture

### Layer 1: Webhook Authentication

```
Supabase → Webhook → Vercel

Headers:
  x-webhook-signature: HMAC-SHA256(payload, secret)

Verification:
  1. Extract signature from header
  2. Compute expected = HMAC(payload, env.WEBHOOK_SECRET)
  3. Compare using crypto.timingSafeEqual()
  4. Reject if mismatch
```

### Layer 2: API Key Authentication

```
n8n → Admin API → Vercel

Headers:
  x-api-key: <secret-api-key>

Verification:
  1. Extract API key from header
  2. Compare against env.ADMIN_API_KEY / N8N_API_KEY
  3. Reject if not in allowed list
```

### Layer 3: Rate Limiting

```
Token Bucket Algorithm:
  - Max tokens: 20
  - Refill rate: 2 tokens/second
  - Identifier: Client IP
  - Storage: In-memory Map
  - Cleanup: Every 1 hour

Result:
  - Allows burst of 20 requests
  - Then sustained 2 req/sec
  - Prevents DoS attacks
```

### Layer 4: Input Validation

```typescript
// All webhook payloads validated with Zod
const schema = z.object({
  type: z.literal('INSERT'),
  table: z.enum(['leads', 'analyses']),
  record: z.object({
    // ... specific fields
  })
})

// Rejects malformed requests before processing
```

---

## Scalability Considerations

### Current Architecture (MVP)

**Capacity:**
- ~100 requests/second (Vercel Edge)
- ~1000 concurrent workflows (n8n cloud)
- Unlimited DB storage (Supabase)

**Bottlenecks:**
- WhatsApp API rate limits (80 msg/sec Business API)
- n8n workflow execution time
- In-memory rate limiter (single instance)

### Scaling Plan

**Phase 1: 100 leads/day**
- Current setup is sufficient
- No changes needed

**Phase 2: 1000 leads/day**
- Switch to Upstash Redis for rate limiting
- Add caching layer (Redis) for admin APIs
- Optimize n8n workflows (parallel processing)

**Phase 3: 10,000+ leads/day**
- Horizontal scaling of n8n (self-hosted)
- Message queue (SQS/RabbitMQ) for WhatsApp
- Database read replicas (Supabase Pro)
- CDN for static assets

---

## Monitoring & Observability

### Metrics Collection Points

```
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│ Vercel  │   │Supabase │   │   n8n   │   │WhatsApp │
│  Logs   │   │  Logs   │   │  Logs   │   │   API   │
└────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘
     │             │             │             │
     └─────────────┴─────────────┴─────────────┘
                        │
                        ▼
              ┌──────────────────┐
              │  Analytics       │
              │  Dashboard       │
              │  (Future)        │
              └──────────────────┘
```

**Key Metrics:**
- Lead capture rate
- Analysis completion rate
- Message delivery rate
- Response rate by score tier
- Conversion to consultation
- Error rate per component
- P95 latency per flow

---

## Disaster Recovery

### Backup Strategy

**Database (Supabase):**
- Automatic daily backups (retained 7 days)
- Point-in-time recovery (PITR)
- Manual snapshots before major changes

**Code (Vercel):**
- Git repository (GitHub)
- Automatic deploys from main branch
- Rollback capability (instant)

**n8n Workflows:**
- Export workflows as JSON (weekly)
- Version control recommended
- Store in Git repo

### Failure Scenarios

| Component | Failure | Impact | Recovery Time | Mitigation |
|-----------|---------|--------|---------------|------------|
| Vercel | Service down | No new leads | ~5 min | Status page monitoring |
| Supabase | DB down | No saves | ~5 min | Health check endpoint |
| n8n | Workflow fails | No messages | Manual | Error notifications |
| WhatsApp API | Rate limit | Delayed msgs | Auto | Queue + retry logic |

---

## Cost Estimation

### Monthly Operating Costs (100 leads/day = 3000/month)

| Service | Plan | Cost | Usage |
|---------|------|------|-------|
| Vercel | Pro | $20 | Edge functions, hosting |
| Supabase | Free→Pro | $0-$25 | DB, auth, storage |
| n8n | Cloud Starter | $20 | Workflows (5k executions) |
| WhatsApp API | Evolution (self) | $0-$10 | VPS hosting |
| **Total** | | **$40-$75** | |

### At Scale (1000 leads/day = 30,000/month)

| Service | Plan | Cost | Usage |
|---------|------|------|-------|
| Vercel | Pro | $20 | Edge functions |
| Supabase | Pro | $25 | DB + extensions |
| n8n | Cloud Pro | $50 | 50k executions |
| WhatsApp API | Business API | $50-$100 | Official API |
| Upstash Redis | Pay-as-go | $10 | Rate limiting |
| **Total** | | **$155-$205** | |

---

**Last Updated:** 2026-02-18
**Version:** 1.0
**Maintained by:** Aria (@architect) - AIOS
