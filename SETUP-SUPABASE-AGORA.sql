-- =====================================================
-- PRISMA SCORE - DATABASE SCHEMA
-- Execute este arquivo no SQL Editor do Supabase
-- =====================================================

-- EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- TABELA: users (Leads capturados)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    phone VARCHAR(50),
    company VARCHAR(255),
    job_title VARCHAR(255),
    source VARCHAR(100) DEFAULT 'prisma-web',
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_content VARCHAR(100),
    utm_term VARCHAR(100),
    lead_status VARCHAR(50) DEFAULT 'new',
    lead_score INTEGER DEFAULT 0,
    newsletter_subscribed BOOLEAN DEFAULT false,
    marketing_consent BOOLEAN DEFAULT false,
    first_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_email ON public.users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_source ON public.users(source);
CREATE INDEX idx_users_lead_status ON public.users(lead_status);
CREATE INDEX idx_users_created_at ON public.users(created_at DESC);

-- TABELA: sessions (Sessões de navegação)
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    anonymous_id VARCHAR(255),
    user_agent TEXT,
    browser VARCHAR(100),
    browser_version VARCHAR(50),
    os VARCHAR(100),
    os_version VARCHAR(50),
    device_type VARCHAR(50),
    device_vendor VARCHAR(100),
    device_model VARCHAR(100),
    ip_address INET,
    country VARCHAR(100),
    region VARCHAR(100),
    city VARCHAR(100),
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    timezone VARCHAR(100),
    screen_width INTEGER,
    screen_height INTEGER,
    viewport_width INTEGER,
    viewport_height INTEGER,
    pixel_ratio DECIMAL(3, 2),
    landing_page TEXT,
    referrer TEXT,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    duration_seconds INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sessions_session_id ON public.sessions(session_id);
CREATE INDEX idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX idx_sessions_started_at ON public.sessions(started_at DESC);
CREATE INDEX idx_sessions_device_type ON public.sessions(device_type);

-- TABELA: analyses (Diagnósticos PRISMA)
CREATE TABLE IF NOT EXISTS public.analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
    analysis_id VARCHAR(100) UNIQUE NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    problem_statement TEXT NOT NULL,
    tech_stack JSONB NOT NULL,
    integration_needs TEXT NOT NULL,
    budget_range VARCHAR(50) NOT NULL,
    roi_expectation TEXT NOT NULL,
    timeline VARCHAR(50) NOT NULL,
    blockers TEXT NOT NULL,
    score_vision INTEGER CHECK (score_vision >= 0 AND score_vision <= 10),
    score_integration INTEGER CHECK (score_integration >= 0 AND score_integration <= 10),
    score_viability INTEGER CHECK (score_viability >= 0 AND score_viability <= 10),
    score_execution INTEGER CHECK (score_execution >= 0 AND score_execution <= 10),
    score_total INTEGER CHECK (score_total >= 0 AND score_total <= 40),
    classification VARCHAR(100),
    risks JSONB,
    strengths JSONB,
    next_steps JSONB,
    questions JSONB,
    missing_info JSONB,
    vision_analysis TEXT,
    integration_analysis TEXT,
    viability_analysis TEXT,
    execution_analysis TEXT,
    full_analysis_text TEXT,
    analysis_version VARCHAR(50) DEFAULT '1.0.0',
    model_used VARCHAR(100),
    tokens_used INTEGER,
    processing_time_ms INTEGER,
    status VARCHAR(50) DEFAULT 'completed',
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_analyses_analysis_id ON public.analyses(analysis_id);
CREATE INDEX idx_analyses_user_id ON public.analyses(user_id);
CREATE INDEX idx_analyses_session_id ON public.analyses(session_id);
CREATE INDEX idx_analyses_score_total ON public.analyses(score_total DESC);
CREATE INDEX idx_analyses_classification ON public.analyses(classification);
CREATE INDEX idx_analyses_created_at ON public.analyses(created_at DESC);
CREATE INDEX idx_analyses_status ON public.analyses(status);
CREATE INDEX idx_analyses_tech_stack ON public.analyses USING GIN (tech_stack);
CREATE INDEX idx_analyses_risks ON public.analyses USING GIN (risks);

-- TABELA: tracking_events (Eventos de tracking)
CREATE TABLE IF NOT EXISTS public.tracking_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
    event_name VARCHAR(255) NOT NULL,
    event_category VARCHAR(100),
    event_data JSONB,
    page_path TEXT,
    page_title VARCHAR(500),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_tracking_events_session_id ON public.tracking_events(session_id);
CREATE INDEX idx_tracking_events_user_id ON public.tracking_events(user_id);
CREATE INDEX idx_tracking_events_name ON public.tracking_events(event_name);
CREATE INDEX idx_tracking_events_category ON public.tracking_events(event_category);
CREATE INDEX idx_tracking_events_timestamp ON public.tracking_events(timestamp DESC);
CREATE INDEX idx_tracking_events_data ON public.tracking_events USING GIN (event_data);

-- TABELA: leads (para webhooks)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) NOT NULL,
    company VARCHAR(255),
    source VARCHAR(100) DEFAULT 'website',
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_leads_email ON public.leads(email);
CREATE INDEX idx_leads_created_at ON public.leads(created_at DESC);

-- FUNCTIONS
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- TRIGGERS
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_sessions_updated_at ON public.sessions;
CREATE TRIGGER update_sessions_updated_at
    BEFORE UPDATE ON public.sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_analyses_updated_at ON public.analyses;
CREATE TRIGGER update_analyses_updated_at
    BEFORE UPDATE ON public.analyses
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_leads_updated_at ON public.leads;
CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- GRANTS
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- Verificar estrutura criada
SELECT
    schemaname,
    tablename,
    tableowner
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
