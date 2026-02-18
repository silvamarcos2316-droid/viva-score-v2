-- =====================================================
-- PRISMA SCORE - DATABASE SCHEMA
-- Plataforma de diagnóstico estratégico AI-First
-- =====================================================
-- Versão: 1.0.0
-- Data: 2026-02-18
-- Autor: Dara (@data-engineer)
-- =====================================================

-- ============================================
-- EXTENSÕES
-- ============================================

-- UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Timestamp utilities
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";


-- ============================================
-- TABELA: users
-- Leads capturados da plataforma
-- ============================================

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Dados básicos
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    phone VARCHAR(50),
    company VARCHAR(255),
    job_title VARCHAR(255),

    -- Origem do lead
    source VARCHAR(100) DEFAULT 'prisma-web', -- prisma-web, whatsapp, api, etc
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_content VARCHAR(100),
    utm_term VARCHAR(100),

    -- Status do lead
    lead_status VARCHAR(50) DEFAULT 'new', -- new, contacted, qualified, converted, lost
    lead_score INTEGER DEFAULT 0, -- Score de qualificação do lead (0-100)

    -- Preferências
    newsletter_subscribed BOOLEAN DEFAULT false,
    marketing_consent BOOLEAN DEFAULT false,

    -- Metadata
    first_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Soft delete
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Índices para performance
CREATE INDEX idx_users_email ON public.users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_source ON public.users(source);
CREATE INDEX idx_users_lead_status ON public.users(lead_status);
CREATE INDEX idx_users_created_at ON public.users(created_at DESC);

-- Comentários
COMMENT ON TABLE public.users IS 'Usuários/leads capturados da plataforma PRISMA';
COMMENT ON COLUMN public.users.lead_score IS 'Score de qualificação baseado em comportamento e engajamento';


-- ============================================
-- TABELA: sessions
-- Sessões de navegação dos usuários
-- ============================================

CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,

    -- Identificadores de sessão
    session_id VARCHAR(255) UNIQUE NOT NULL, -- Frontend session ID
    anonymous_id VARCHAR(255), -- Para usuários não identificados

    -- Device & Browser Info
    user_agent TEXT,
    browser VARCHAR(100),
    browser_version VARCHAR(50),
    os VARCHAR(100),
    os_version VARCHAR(50),
    device_type VARCHAR(50), -- mobile, tablet, desktop
    device_vendor VARCHAR(100),
    device_model VARCHAR(100),

    -- Geolocalização
    ip_address INET,
    country VARCHAR(100),
    region VARCHAR(100),
    city VARCHAR(100),
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    timezone VARCHAR(100),

    -- Screen & Performance
    screen_width INTEGER,
    screen_height INTEGER,
    viewport_width INTEGER,
    viewport_height INTEGER,
    pixel_ratio DECIMAL(3, 2),

    -- Session metadata
    landing_page TEXT,
    referrer TEXT,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),

    -- Timestamps
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Duration (em segundos)
    duration_seconds INTEGER,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_sessions_session_id ON public.sessions(session_id);
CREATE INDEX idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX idx_sessions_started_at ON public.sessions(started_at DESC);
CREATE INDEX idx_sessions_device_type ON public.sessions(device_type);

COMMENT ON TABLE public.sessions IS 'Sessões de navegação com dados de device e geolocalização';


-- ============================================
-- TABELA: analyses
-- Diagnósticos completos gerados
-- ============================================

CREATE TABLE IF NOT EXISTS public.analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,

    -- Identificador único da análise
    analysis_id VARCHAR(100) UNIQUE NOT NULL, -- Frontend-generated ID

    -- ========================================
    -- FORM DATA - Dados do formulário V.I.V.A.
    -- ========================================

    -- DIMENSÃO 1: VISÃO
    project_name VARCHAR(255) NOT NULL,
    problem_statement TEXT NOT NULL,

    -- DIMENSÃO 2: INTEGRAÇÃO
    tech_stack JSONB NOT NULL, -- Array de tecnologias ["Next.js", "Supabase", etc]
    integration_needs TEXT NOT NULL,

    -- DIMENSÃO 3: VIABILIDADE
    budget_range VARCHAR(50) NOT NULL, -- "0-100", "100-500", "500-2000", "2000+"
    roi_expectation TEXT NOT NULL,

    -- DIMENSÃO 4: EXECUÇÃO
    timeline VARCHAR(50) NOT NULL, -- "1-week", "2-4-weeks", "1-3-months", "3-months+"
    blockers TEXT NOT NULL,

    -- ========================================
    -- ANALYSIS RESULTS - Resultado da análise Claude
    -- ========================================

    -- Scores (0-10 cada dimensão, 0-40 total)
    score_vision INTEGER CHECK (score_vision >= 0 AND score_vision <= 10),
    score_integration INTEGER CHECK (score_integration >= 0 AND score_integration <= 10),
    score_viability INTEGER CHECK (score_viability >= 0 AND score_viability <= 10),
    score_execution INTEGER CHECK (score_execution >= 0 AND score_execution <= 10),
    score_total INTEGER CHECK (score_total >= 0 AND score_total <= 40),

    -- Classificação do projeto
    classification VARCHAR(100), -- "Alto Potencial", "Necessita Refinamento", etc

    -- Análises detalhadas (arrays JSON)
    risks JSONB, -- Array de riscos identificados
    strengths JSONB, -- Array de pontos fortes
    next_steps JSONB, -- Array de próximos passos recomendados
    questions JSONB, -- Array de perguntas estratégicas
    missing_info JSONB, -- Array de informações faltantes

    -- Texto completo da análise Claude
    full_analysis_text TEXT,

    -- Metadata da análise
    analysis_version VARCHAR(50) DEFAULT '1.0.0', -- Versão do prompt/framework
    model_used VARCHAR(100), -- "claude-opus-4.6", etc
    tokens_used INTEGER,
    processing_time_ms INTEGER,

    -- Status
    status VARCHAR(50) DEFAULT 'completed', -- completed, failed, processing
    error_message TEXT,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_analyses_analysis_id ON public.analyses(analysis_id);
CREATE INDEX idx_analyses_user_id ON public.analyses(user_id);
CREATE INDEX idx_analyses_session_id ON public.analyses(session_id);
CREATE INDEX idx_analyses_score_total ON public.analyses(score_total DESC);
CREATE INDEX idx_analyses_classification ON public.analyses(classification);
CREATE INDEX idx_analyses_created_at ON public.analyses(created_at DESC);
CREATE INDEX idx_analyses_status ON public.analyses(status);

-- Índice GIN para busca em campos JSONB
CREATE INDEX idx_analyses_tech_stack ON public.analyses USING GIN (tech_stack);
CREATE INDEX idx_analyses_risks ON public.analyses USING GIN (risks);

COMMENT ON TABLE public.analyses IS 'Diagnósticos completos gerados pelo framework PRISMA';
COMMENT ON COLUMN public.analyses.score_total IS 'Score total (0-40) do diagnóstico V.I.V.A.';


-- ============================================
-- TABELA: tracking_events
-- Eventos de comportamento do usuário
-- ============================================

CREATE TABLE IF NOT EXISTS public.tracking_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,

    -- Identificação do evento
    event_name VARCHAR(255) NOT NULL, -- "page_view", "form_start", "field_focus", etc
    event_category VARCHAR(100), -- "navigation", "form", "engagement", etc

    -- Dados do evento
    event_data JSONB, -- Payload flexível para qualquer dado

    -- Contexto da página
    page_path TEXT,
    page_title VARCHAR(500),

    -- Timestamps
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_tracking_events_session_id ON public.tracking_events(session_id);
CREATE INDEX idx_tracking_events_user_id ON public.tracking_events(user_id);
CREATE INDEX idx_tracking_events_name ON public.tracking_events(event_name);
CREATE INDEX idx_tracking_events_category ON public.tracking_events(event_category);
CREATE INDEX idx_tracking_events_timestamp ON public.tracking_events(timestamp DESC);

-- Índice GIN para busca em event_data
CREATE INDEX idx_tracking_events_data ON public.tracking_events USING GIN (event_data);

COMMENT ON TABLE public.tracking_events IS 'Eventos de comportamento e interação do usuário';


-- ============================================
-- TABELA: form_interactions
-- Tracking detalhado de interações com formulários
-- ============================================

CREATE TABLE IF NOT EXISTS public.form_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
    analysis_id UUID REFERENCES public.analyses(id) ON DELETE CASCADE,

    -- Identificação do campo
    field_name VARCHAR(255) NOT NULL, -- "projectName", "problemStatement", etc
    field_label VARCHAR(255),
    field_type VARCHAR(100), -- "text", "textarea", "select", "multi-select"
    step_number INTEGER, -- Qual step do formulário (1-4)
    step_name VARCHAR(100), -- "vision", "integration", "viability", "execution"

    -- Interações
    focus_count INTEGER DEFAULT 0, -- Quantas vezes focou no campo
    blur_count INTEGER DEFAULT 0, -- Quantas vezes saiu do campo
    first_focus_at TIMESTAMP WITH TIME ZONE,
    last_blur_at TIMESTAMP WITH TIME ZONE,

    -- Tempo de interação
    total_time_seconds DECIMAL(10, 2) DEFAULT 0, -- Tempo total focado no campo
    typing_time_seconds DECIMAL(10, 2) DEFAULT 0, -- Tempo efetivamente digitando
    pause_time_seconds DECIMAL(10, 2) DEFAULT 0, -- Tempo de pausa

    -- Input tracking
    character_count INTEGER DEFAULT 0, -- Total de caracteres digitados
    word_count INTEGER DEFAULT 0,
    deletion_count INTEGER DEFAULT 0, -- Quantos caracteres foram deletados
    paste_count INTEGER DEFAULT 0, -- Quantas vezes colou texto

    -- Validação
    validation_errors INTEGER DEFAULT 0, -- Quantos erros de validação
    error_messages JSONB, -- Array de mensagens de erro

    -- Valor final
    final_value TEXT, -- Valor final submetido (pode ser grande)
    value_length INTEGER,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_form_interactions_session_id ON public.form_interactions(session_id);
CREATE INDEX idx_form_interactions_analysis_id ON public.form_interactions(analysis_id);
CREATE INDEX idx_form_interactions_field_name ON public.form_interactions(field_name);
CREATE INDEX idx_form_interactions_step ON public.form_interactions(step_number);

COMMENT ON TABLE public.form_interactions IS 'Tracking detalhado de interações com campos do formulário';
COMMENT ON COLUMN public.form_interactions.typing_time_seconds IS 'Tempo efetivamente digitando (sem pausas)';


-- ============================================
-- TABELA: whatsapp_conversations
-- Conversas via WhatsApp (preparação para n8n)
-- ============================================

CREATE TABLE IF NOT EXISTS public.whatsapp_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,

    -- Identificadores WhatsApp
    phone_number VARCHAR(50) NOT NULL,
    whatsapp_id VARCHAR(255), -- ID do WhatsApp Business API

    -- Metadata da conversa
    conversation_id VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'active', -- active, archived, blocked

    -- Context
    context JSONB, -- Dados de contexto da conversa
    last_message_at TIMESTAMP WITH TIME ZONE,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_whatsapp_conversations_phone ON public.whatsapp_conversations(phone_number);
CREATE INDEX idx_whatsapp_conversations_user_id ON public.whatsapp_conversations(user_id);
CREATE INDEX idx_whatsapp_conversations_status ON public.whatsapp_conversations(status);

COMMENT ON TABLE public.whatsapp_conversations IS 'Conversas via WhatsApp integradas com n8n';


-- ============================================
-- TABELA: whatsapp_messages
-- Mensagens individuais do WhatsApp
-- ============================================

CREATE TABLE IF NOT EXISTS public.whatsapp_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES public.whatsapp_conversations(id) ON DELETE CASCADE,

    -- Identificador da mensagem
    message_id VARCHAR(255) UNIQUE NOT NULL,

    -- Conteúdo
    direction VARCHAR(50) NOT NULL, -- inbound, outbound
    message_type VARCHAR(50) DEFAULT 'text', -- text, image, audio, video, document
    content TEXT,
    media_url TEXT,

    -- Status
    status VARCHAR(50) DEFAULT 'sent', -- sent, delivered, read, failed

    -- Metadata
    metadata JSONB,

    -- Timestamps
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_whatsapp_messages_conversation_id ON public.whatsapp_messages(conversation_id);
CREATE INDEX idx_whatsapp_messages_direction ON public.whatsapp_messages(direction);
CREATE INDEX idx_whatsapp_messages_sent_at ON public.whatsapp_messages(sent_at DESC);

COMMENT ON TABLE public.whatsapp_messages IS 'Mensagens individuais do WhatsApp';


-- ============================================
-- VIEWS - Visões analíticas úteis
-- ============================================

-- View: Análise de conversão
CREATE OR REPLACE VIEW public.conversion_funnel AS
SELECT
    DATE_TRUNC('day', s.started_at) as date,
    COUNT(DISTINCT s.id) as total_sessions,
    COUNT(DISTINCT CASE WHEN te.event_name = 'form_start' THEN s.id END) as form_starts,
    COUNT(DISTINCT a.id) as completed_analyses,
    COUNT(DISTINCT u.id) as leads_captured,
    ROUND(
        COUNT(DISTINCT CASE WHEN te.event_name = 'form_start' THEN s.id END)::NUMERIC
        / NULLIF(COUNT(DISTINCT s.id), 0) * 100,
        2
    ) as form_start_rate,
    ROUND(
        COUNT(DISTINCT a.id)::NUMERIC
        / NULLIF(COUNT(DISTINCT CASE WHEN te.event_name = 'form_start' THEN s.id END), 0) * 100,
        2
    ) as completion_rate
FROM public.sessions s
LEFT JOIN public.tracking_events te ON te.session_id = s.id
LEFT JOIN public.analyses a ON a.session_id = s.id
LEFT JOIN public.users u ON u.id = s.user_id
GROUP BY DATE_TRUNC('day', s.started_at)
ORDER BY date DESC;

COMMENT ON VIEW public.conversion_funnel IS 'Análise de funil de conversão diário';


-- View: Dashboard de análises
CREATE OR REPLACE VIEW public.analyses_dashboard AS
SELECT
    a.id,
    a.analysis_id,
    a.created_at,
    a.project_name,
    a.classification,
    a.score_total,
    a.score_vision,
    a.score_integration,
    a.score_viability,
    a.score_execution,
    u.email as user_email,
    u.name as user_name,
    u.company,
    s.device_type,
    s.os,
    s.browser,
    s.country
FROM public.analyses a
LEFT JOIN public.users u ON u.id = a.user_id
LEFT JOIN public.sessions s ON s.id = a.session_id
ORDER BY a.created_at DESC;

COMMENT ON VIEW public.analyses_dashboard IS 'Dashboard consolidado de análises com dados do usuário';


-- ============================================
-- FUNCTIONS - Funções úteis
-- ============================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Calcular duração da sessão
CREATE OR REPLACE FUNCTION public.calculate_session_duration()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.ended_at IS NOT NULL THEN
        NEW.duration_seconds = EXTRACT(EPOCH FROM (NEW.ended_at - NEW.started_at));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Atualizar last_seen_at do usuário
CREATE OR REPLACE FUNCTION public.update_user_last_seen()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.users
    SET last_seen_at = NOW()
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger: Auto-update updated_at em users
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger: Auto-update updated_at em sessions
DROP TRIGGER IF EXISTS update_sessions_updated_at ON public.sessions;
CREATE TRIGGER update_sessions_updated_at
    BEFORE UPDATE ON public.sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger: Auto-update updated_at em analyses
DROP TRIGGER IF EXISTS update_analyses_updated_at ON public.analyses;
CREATE TRIGGER update_analyses_updated_at
    BEFORE UPDATE ON public.analyses
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger: Calcular duração da sessão
DROP TRIGGER IF EXISTS calculate_session_duration_trigger ON public.sessions;
CREATE TRIGGER calculate_session_duration_trigger
    BEFORE UPDATE ON public.sessions
    FOR EACH ROW
    WHEN (NEW.ended_at IS NOT NULL AND OLD.ended_at IS NULL)
    EXECUTE FUNCTION public.calculate_session_duration();

-- Trigger: Atualizar last_seen_at do usuário ao criar sessão
DROP TRIGGER IF EXISTS update_user_last_seen_on_session ON public.sessions;
CREATE TRIGGER update_user_last_seen_on_session
    AFTER INSERT ON public.sessions
    FOR EACH ROW
    WHEN (NEW.user_id IS NOT NULL)
    EXECUTE FUNCTION public.update_user_last_seen();


-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
-- Nota: Desabilitado por padrão para uso com service_role_key
-- Habilitar apenas se necessário para acesso público

-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.tracking_events ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.form_interactions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.whatsapp_conversations ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;

-- Exemplo de policy (descomente se necessário):
-- CREATE POLICY "Users can read their own data"
--     ON public.users
--     FOR SELECT
--     USING (auth.uid() = id);


-- ============================================
-- GRANTS - Permissões
-- ============================================

-- Grant para authenticated users (se usar anon/authenticated keys)
-- GRANT SELECT, INSERT ON public.tracking_events TO authenticated;
-- GRANT SELECT, INSERT ON public.sessions TO authenticated;
-- GRANT SELECT, INSERT, UPDATE ON public.analyses TO authenticated;

-- Grant para service_role (usar no backend)
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role;


-- ============================================
-- SEED DATA (opcional - para desenvolvimento)
-- ============================================

-- Exemplo de usuário de teste
-- INSERT INTO public.users (email, name, company, source)
-- VALUES ('teste@prisma.ai', 'Usuário Teste', 'PRISMA Inc', 'prisma-web')
-- ON CONFLICT (email) DO NOTHING;


-- =====================================================
-- FIM DO SCHEMA
-- =====================================================

-- Verificar estrutura criada
SELECT
    schemaname,
    tablename,
    tableowner
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
