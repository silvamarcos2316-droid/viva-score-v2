-- =====================================================
-- MIGRATION: Analytics Views
-- =====================================================
-- Versão: 1.0.0
-- Data: 2026-02-18
-- Descrição: Views analíticas para dashboards e relatórios
-- =====================================================

-- View: Funil de conversão
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
    a.budget_range,
    a.timeline,
    u.email as user_email,
    u.name as user_name,
    u.company,
    u.lead_status,
    s.device_type,
    s.os,
    s.browser,
    s.country,
    s.city
FROM public.analyses a
LEFT JOIN public.users u ON u.id = a.user_id
LEFT JOIN public.sessions s ON s.id = a.session_id
ORDER BY a.created_at DESC;

COMMENT ON VIEW public.analyses_dashboard IS 'Dashboard consolidado de análises com dados do usuário';


-- View: Device analytics
CREATE OR REPLACE VIEW public.device_analytics AS
SELECT
    DATE_TRUNC('day', started_at) as date,
    device_type,
    os,
    browser,
    COUNT(*) as session_count,
    COUNT(DISTINCT user_id) as unique_users,
    AVG(duration_seconds) as avg_duration_seconds,
    AVG(duration_seconds) / 60 as avg_duration_minutes
FROM public.sessions
WHERE started_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', started_at), device_type, os, browser
ORDER BY date DESC, session_count DESC;

COMMENT ON VIEW public.device_analytics IS 'Análise de dispositivos, OS e browsers';


-- View: Form completion stats
CREATE OR REPLACE VIEW public.form_completion_stats AS
SELECT
    fi.field_name,
    fi.step_number,
    fi.step_name,
    COUNT(*) as total_interactions,
    AVG(fi.total_time_seconds) as avg_time_seconds,
    AVG(fi.character_count) as avg_characters,
    AVG(fi.validation_errors) as avg_errors,
    SUM(fi.validation_errors) as total_errors,
    AVG(fi.focus_count) as avg_focus_count
FROM public.form_interactions fi
GROUP BY fi.field_name, fi.step_number, fi.step_name
ORDER BY fi.step_number, fi.field_name;

COMMENT ON VIEW public.form_completion_stats IS 'Estatísticas de completude do formulário';


-- View: User engagement summary
CREATE OR REPLACE VIEW public.user_engagement_summary AS
SELECT
    u.id,
    u.email,
    u.name,
    u.company,
    u.lead_status,
    u.lead_score,
    u.created_at as user_created_at,
    COUNT(DISTINCT s.id) as total_sessions,
    COUNT(DISTINCT a.id) as total_analyses,
    COUNT(DISTINCT te.id) as total_events,
    MAX(s.started_at) as last_session_at,
    MAX(a.created_at) as last_analysis_at
FROM public.users u
LEFT JOIN public.sessions s ON s.user_id = u.id
LEFT JOIN public.analyses a ON a.user_id = u.id
LEFT JOIN public.tracking_events te ON te.user_id = u.id
WHERE u.deleted_at IS NULL
GROUP BY u.id, u.email, u.name, u.company, u.lead_status, u.lead_score, u.created_at
ORDER BY total_sessions DESC;

COMMENT ON VIEW public.user_engagement_summary IS 'Resumo de engajamento por usuário';


-- View: Score distribution
CREATE OR REPLACE VIEW public.score_distribution AS
SELECT
    CASE
        WHEN score_total BETWEEN 0 AND 10 THEN '0-10'
        WHEN score_total BETWEEN 11 AND 20 THEN '11-20'
        WHEN score_total BETWEEN 21 AND 30 THEN '21-30'
        WHEN score_total BETWEEN 31 AND 40 THEN '31-40'
    END as score_range,
    classification,
    COUNT(*) as count,
    AVG(score_vision) as avg_vision,
    AVG(score_integration) as avg_integration,
    AVG(score_viability) as avg_viability,
    AVG(score_execution) as avg_execution
FROM public.analyses
WHERE status = 'completed'
GROUP BY score_range, classification
ORDER BY score_range;

COMMENT ON VIEW public.score_distribution IS 'Distribuição de scores e classificações';


-- View: Traffic source analysis
CREATE OR REPLACE VIEW public.traffic_source_analysis AS
SELECT
    COALESCE(utm_source, 'direct') as source,
    COALESCE(utm_medium, 'none') as medium,
    COALESCE(utm_campaign, 'none') as campaign,
    COUNT(DISTINCT s.id) as sessions,
    COUNT(DISTINCT s.user_id) as users,
    COUNT(DISTINCT a.id) as analyses,
    ROUND(
        COUNT(DISTINCT a.id)::NUMERIC / NULLIF(COUNT(DISTINCT s.id), 0) * 100,
        2
    ) as conversion_rate
FROM public.sessions s
LEFT JOIN public.analyses a ON a.session_id = s.id
GROUP BY utm_source, utm_medium, utm_campaign
ORDER BY sessions DESC;

COMMENT ON VIEW public.traffic_source_analysis IS 'Análise de fontes de tráfego e conversão';
