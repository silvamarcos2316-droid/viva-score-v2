-- =====================================================
-- MIGRATION: Initial Schema Setup
-- =====================================================
-- Versão: 1.0.0
-- Data: 2026-02-18
-- Descrição: Criação inicial de todas as tabelas do PRISMA
-- =====================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Tabela de usuários/leads
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

-- Tabela de sessões
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

-- Tabela de análises
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

-- Tabela de eventos de tracking
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

-- Tabela de interações com formulários
CREATE TABLE IF NOT EXISTS public.form_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
    analysis_id UUID REFERENCES public.analyses(id) ON DELETE CASCADE,
    field_name VARCHAR(255) NOT NULL,
    field_label VARCHAR(255),
    field_type VARCHAR(100),
    step_number INTEGER,
    step_name VARCHAR(100),
    focus_count INTEGER DEFAULT 0,
    blur_count INTEGER DEFAULT 0,
    first_focus_at TIMESTAMP WITH TIME ZONE,
    last_blur_at TIMESTAMP WITH TIME ZONE,
    total_time_seconds DECIMAL(10, 2) DEFAULT 0,
    typing_time_seconds DECIMAL(10, 2) DEFAULT 0,
    pause_time_seconds DECIMAL(10, 2) DEFAULT 0,
    character_count INTEGER DEFAULT 0,
    word_count INTEGER DEFAULT 0,
    deletion_count INTEGER DEFAULT 0,
    paste_count INTEGER DEFAULT 0,
    validation_errors INTEGER DEFAULT 0,
    error_messages JSONB,
    final_value TEXT,
    value_length INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_form_interactions_session_id ON public.form_interactions(session_id);
CREATE INDEX idx_form_interactions_analysis_id ON public.form_interactions(analysis_id);
CREATE INDEX idx_form_interactions_field_name ON public.form_interactions(field_name);
CREATE INDEX idx_form_interactions_step ON public.form_interactions(step_number);
