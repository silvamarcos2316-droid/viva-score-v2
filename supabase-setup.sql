-- ============================================================================
-- PRISMA Score - Supabase Database Setup
-- ============================================================================
-- This script creates all necessary tables, indexes, and webhooks for the
-- PRISMA Score application with WhatsApp/n8n integration.
--
-- Run this script in the Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- 1. LEADS TABLE
-- ============================================================================
-- Stores lead information captured before the analysis

CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Lead contact information
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,

  -- Tracking information
  source TEXT DEFAULT 'website',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,

  -- Session tracking
  session_id TEXT,
  user_agent TEXT,
  ip_address INET,

  -- Engagement tracking
  whatsapp_message_sent BOOLEAN DEFAULT false,
  whatsapp_message_sent_at TIMESTAMPTZ,
  responded_to_whatsapp BOOLEAN DEFAULT false,
  responded_at TIMESTAMPTZ,

  CONSTRAINT leads_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS leads_email_idx ON public.leads (email);
CREATE INDEX IF NOT EXISTS leads_phone_idx ON public.leads (phone);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_source_idx ON public.leads (source);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 2. ANALYSES TABLE
-- ============================================================================
-- Stores complete PRISMA Score analyses

CREATE TABLE IF NOT EXISTS public.analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Foreign key to leads
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,

  -- Lead information (denormalized for easy querying)
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,

  -- Project information
  project_name TEXT NOT NULL,
  problem_statement TEXT NOT NULL,
  tech_stack TEXT[] NOT NULL DEFAULT '{}',
  integration_needs TEXT NOT NULL,
  budget_range TEXT NOT NULL,
  roi_expectation TEXT NOT NULL,
  timeline TEXT NOT NULL,
  blockers TEXT NOT NULL,

  -- Scores (0-10 for each dimension, 0-40 total)
  score_vision INTEGER NOT NULL CHECK (score_vision >= 0 AND score_vision <= 10),
  score_integration INTEGER NOT NULL CHECK (score_integration >= 0 AND score_integration <= 10),
  score_viability INTEGER NOT NULL CHECK (score_viability >= 0 AND score_viability <= 10),
  score_execution INTEGER NOT NULL CHECK (score_execution >= 0 AND score_execution <= 10),
  score_total INTEGER GENERATED ALWAYS AS (
    score_vision + score_integration + score_viability + score_execution
  ) STORED,

  -- Classification
  classification TEXT NOT NULL CHECK (classification IN (
    'baixa-viabilidade',
    'potencial-moderado',
    'potencial-alto',
    'alta-viabilidade'
  )),

  -- Analysis results (arrays)
  risks TEXT[] NOT NULL DEFAULT '{}',
  strengths TEXT[] NOT NULL DEFAULT '{}',
  next_steps TEXT[] NOT NULL DEFAULT '{}',
  questions TEXT[] NOT NULL DEFAULT '{}',
  missing_info TEXT[] NOT NULL DEFAULT '{}',

  -- Detailed analysis text for each dimension
  vision_analysis TEXT NOT NULL,
  integration_analysis TEXT NOT NULL,
  viability_analysis TEXT NOT NULL,
  execution_analysis TEXT NOT NULL,

  -- Engagement tracking
  whatsapp_message_sent BOOLEAN DEFAULT false,
  whatsapp_message_sent_at TIMESTAMPTZ,
  whatsapp_response_received BOOLEAN DEFAULT false,
  whatsapp_response_at TIMESTAMPTZ,
  follow_up_sent BOOLEAN DEFAULT false,
  follow_up_sent_at TIMESTAMPTZ,
  invited_to_group BOOLEAN DEFAULT false,
  invited_to_group_at TIMESTAMPTZ,
  joined_group BOOLEAN DEFAULT false,
  joined_group_at TIMESTAMPTZ,

  -- Consultation status
  consultation_scheduled BOOLEAN DEFAULT false,
  consultation_scheduled_at TIMESTAMPTZ,
  consultation_completed BOOLEAN DEFAULT false,
  consultation_completed_at TIMESTAMPTZ,

  -- Full raw data (for backup/debugging)
  raw_analysis_json JSONB
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS analyses_lead_id_idx ON public.analyses (lead_id);
CREATE INDEX IF NOT EXISTS analyses_email_idx ON public.analyses (email);
CREATE INDEX IF NOT EXISTS analyses_created_at_idx ON public.analyses (created_at DESC);
CREATE INDEX IF NOT EXISTS analyses_score_total_idx ON public.analyses (score_total DESC);
CREATE INDEX IF NOT EXISTS analyses_classification_idx ON public.analyses (classification);
CREATE INDEX IF NOT EXISTS analyses_tech_stack_idx ON public.analyses USING GIN (tech_stack);

-- Auto-update updated_at timestamp
CREATE TRIGGER analyses_updated_at
  BEFORE UPDATE ON public.analyses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 3. WHATSAPP MESSAGES LOG (Optional - for tracking)
-- ============================================================================
-- Logs all WhatsApp messages sent via n8n

CREATE TABLE IF NOT EXISTS public.whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- References
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  analysis_id UUID REFERENCES public.analyses(id) ON DELETE SET NULL,

  -- Message details
  phone TEXT NOT NULL,
  message_type TEXT NOT NULL CHECK (message_type IN (
    'welcome',
    'high_score',
    'medium_high_score',
    'medium_score',
    'low_score',
    'follow_up',
    'group_invite',
    'custom'
  )),
  message_text TEXT NOT NULL,

  -- Status tracking
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  replied_at TIMESTAMPTZ,

  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending',
    'sent',
    'delivered',
    'read',
    'replied',
    'failed'
  )),

  error_message TEXT,

  -- Metadata
  metadata JSONB
);

-- Indexes
CREATE INDEX IF NOT EXISTS whatsapp_messages_lead_id_idx ON public.whatsapp_messages (lead_id);
CREATE INDEX IF NOT EXISTS whatsapp_messages_analysis_id_idx ON public.whatsapp_messages (analysis_id);
CREATE INDEX IF NOT EXISTS whatsapp_messages_phone_idx ON public.whatsapp_messages (phone);
CREATE INDEX IF NOT EXISTS whatsapp_messages_created_at_idx ON public.whatsapp_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS whatsapp_messages_status_idx ON public.whatsapp_messages (status);

-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
-- Enable RLS on all tables

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Allow INSERT for anonymous users (form submission)
CREATE POLICY "Allow anonymous inserts on leads"
  ON public.leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Allow SELECT for authenticated users only
CREATE POLICY "Allow authenticated read on leads"
  ON public.leads
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Allow UPDATE for authenticated users
CREATE POLICY "Allow authenticated update on leads"
  ON public.leads
  FOR UPDATE
  TO authenticated
  USING (true);

-- Similar policies for analyses (only service role can insert via API)
CREATE POLICY "Allow service role all access on analyses"
  ON public.analyses
  FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Allow authenticated read on analyses"
  ON public.analyses
  FOR SELECT
  TO authenticated
  USING (true);

-- WhatsApp messages - service role only
CREATE POLICY "Allow service role all access on whatsapp_messages"
  ON public.whatsapp_messages
  FOR ALL
  TO service_role
  USING (true);

-- ============================================================================
-- 5. WEBHOOK CONFIGURATION
-- ============================================================================
-- These webhooks need to be configured in the Supabase Dashboard:
-- Database > Webhooks > Create a new hook
--
-- WEBHOOK 1: New Lead Captured
-- ----------------------------------------------------------------------------
-- Table: public.leads
-- Events: INSERT
-- Type: HTTP Request
-- URL: https://prisma-score.vercel.app/api/webhooks/new-lead
-- HTTP Headers:
--   Content-Type: application/json
--   x-webhook-signature: ${WEBHOOK_SECRET} (configure in Vercel env)
--
-- WEBHOOK 2: New Analysis Completed
-- ----------------------------------------------------------------------------
-- Table: public.analyses
-- Events: INSERT
-- Type: HTTP Request
-- URL: https://prisma-score.vercel.app/api/webhooks/new-analysis
-- HTTP Headers:
--   Content-Type: application/json
--   x-webhook-signature: ${WEBHOOK_SECRET} (configure in Vercel env)
--
-- ============================================================================

-- ============================================================================
-- 6. HELPER FUNCTIONS
-- ============================================================================

-- Function to get recent high-potential leads (for manual follow-up)
CREATE OR REPLACE FUNCTION get_high_potential_leads(days_ago INTEGER DEFAULT 7)
RETURNS TABLE (
  lead_id UUID,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  project_name TEXT,
  score_total INTEGER,
  classification TEXT,
  created_at TIMESTAMPTZ,
  whatsapp_message_sent BOOLEAN,
  responded_to_whatsapp BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.lead_id,
    a.full_name,
    a.email,
    a.phone,
    a.project_name,
    a.score_total,
    a.classification,
    a.created_at,
    a.whatsapp_message_sent,
    a.whatsapp_response_received
  FROM public.analyses a
  WHERE
    a.created_at >= now() - (days_ago || ' days')::INTERVAL
    AND a.score_total >= 26
    AND a.whatsapp_response_received = false
  ORDER BY a.score_total DESC, a.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get conversion funnel metrics
CREATE OR REPLACE FUNCTION get_conversion_metrics(days_ago INTEGER DEFAULT 30)
RETURNS TABLE (
  total_leads INTEGER,
  total_analyses INTEGER,
  messages_sent INTEGER,
  messages_replied INTEGER,
  consultations_scheduled INTEGER,
  consultations_completed INTEGER,
  conversion_to_analysis NUMERIC,
  conversion_to_reply NUMERIC,
  conversion_to_consultation NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH metrics AS (
    SELECT
      COUNT(DISTINCT l.id) AS lead_count,
      COUNT(DISTINCT a.id) AS analysis_count,
      COUNT(DISTINCT a.id) FILTER (WHERE a.whatsapp_message_sent) AS msg_sent_count,
      COUNT(DISTINCT a.id) FILTER (WHERE a.whatsapp_response_received) AS msg_replied_count,
      COUNT(DISTINCT a.id) FILTER (WHERE a.consultation_scheduled) AS consult_scheduled_count,
      COUNT(DISTINCT a.id) FILTER (WHERE a.consultation_completed) AS consult_completed_count
    FROM public.leads l
    LEFT JOIN public.analyses a ON l.id = a.lead_id
    WHERE l.created_at >= now() - (days_ago || ' days')::INTERVAL
  )
  SELECT
    lead_count::INTEGER,
    analysis_count::INTEGER,
    msg_sent_count::INTEGER,
    msg_replied_count::INTEGER,
    consult_scheduled_count::INTEGER,
    consult_completed_count::INTEGER,
    ROUND((analysis_count::NUMERIC / NULLIF(lead_count, 0)) * 100, 2) AS conversion_to_analysis,
    ROUND((msg_replied_count::NUMERIC / NULLIF(msg_sent_count, 0)) * 100, 2) AS conversion_to_reply,
    ROUND((consult_scheduled_count::NUMERIC / NULLIF(msg_replied_count, 0)) * 100, 2) AS conversion_to_consultation
  FROM metrics;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- SETUP COMPLETE
-- ============================================================================
-- Next steps:
-- 1. Configure webhooks in Supabase Dashboard
-- 2. Add environment variables to Vercel
-- 3. Test webhook endpoints with curl
-- 4. Set up n8n workflows
-- ============================================================================

-- Verify tables were created
SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) AS column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_name IN ('leads', 'analyses', 'whatsapp_messages')
ORDER BY table_name;
