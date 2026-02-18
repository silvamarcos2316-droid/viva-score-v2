# Supabase Database Schema

## Quick Start

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Wait ~2 minutes for provisioning

### 2. Run Schema

**Option A: All at once (recommended)**
```sql
-- Copy content from schema.sql and paste in SQL Editor
-- Run entire file
```

**Option B: Migrations in order**
```sql
-- Run these in order:
1. migrations/20260218000001_initial_schema.sql
2. migrations/20260218000002_whatsapp_integration.sql
3. migrations/20260218000003_functions_and_triggers.sql
4. migrations/20260218000004_analytics_views.sql
```

### 3. Configure Environment

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
```

### 4. Install Dependencies

```bash
npm install @supabase/supabase-js
```

---

## Files

- **`schema.sql`** - Complete schema (800+ lines)
- **`migrations/`** - Individual migrations
  - `001` - Initial schema (core tables)
  - `002` - WhatsApp integration
  - `003` - Functions & triggers
  - `004` - Analytics views

---

## Tables

### Core Tables
1. **users** - Leads/users captured
2. **sessions** - Navigation sessions with tracking
3. **analyses** - Complete V.I.V.A. diagnostics
4. **tracking_events** - User behavior events
5. **form_interactions** - Detailed form tracking

### Integration Tables
6. **whatsapp_conversations** - WhatsApp conversations (n8n)
7. **whatsapp_messages** - Individual messages

---

## Views

1. **conversion_funnel** - Daily conversion funnel
2. **analyses_dashboard** - Consolidated analyses dashboard
3. **device_analytics** - Device/OS/browser analysis
4. **form_completion_stats** - Form statistics
5. **user_engagement_summary** - User engagement summary
6. **score_distribution** - V.I.V.A. score distribution
7. **traffic_source_analysis** - Traffic source analysis

---

## Auto-Triggers

1. **Auto-update `updated_at`** - On all tables
2. **Calculate session duration** - When session ends
3. **Update user `last_seen_at`** - On new session

---

## Usage

See `../lib/supabase-queries.ts` for examples:

```typescript
import { saveAnalysis, getRecentAnalyses } from '@/lib/supabase-queries'

// Save analysis
await saveAnalysis({ ... })

// Get recent analyses
const analyses = await getRecentAnalyses(10)
```

---

## Documentation

- Complete guide: `../SUPABASE-SETUP.md`
- Implementation checklist: `../IMPLEMENTATION-CHECKLIST.md`
- Summary: `../DATA-INFRASTRUCTURE-SUMMARY.md`

---

Created: 2026-02-18
Author: Dara (@data-engineer / AIOS)
