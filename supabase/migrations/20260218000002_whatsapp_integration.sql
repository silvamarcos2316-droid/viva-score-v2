-- =====================================================
-- MIGRATION: WhatsApp Integration Tables
-- =====================================================
-- Versão: 1.0.0
-- Data: 2026-02-18
-- Descrição: Tabelas para integração com WhatsApp via n8n
-- =====================================================

-- Tabela de conversas WhatsApp
CREATE TABLE IF NOT EXISTS public.whatsapp_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    phone_number VARCHAR(50) NOT NULL,
    whatsapp_id VARCHAR(255),
    conversation_id VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    context JSONB,
    last_message_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_whatsapp_conversations_phone ON public.whatsapp_conversations(phone_number);
CREATE INDEX idx_whatsapp_conversations_user_id ON public.whatsapp_conversations(user_id);
CREATE INDEX idx_whatsapp_conversations_status ON public.whatsapp_conversations(status);

-- Tabela de mensagens WhatsApp
CREATE TABLE IF NOT EXISTS public.whatsapp_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES public.whatsapp_conversations(id) ON DELETE CASCADE,
    message_id VARCHAR(255) UNIQUE NOT NULL,
    direction VARCHAR(50) NOT NULL,
    message_type VARCHAR(50) DEFAULT 'text',
    content TEXT,
    media_url TEXT,
    status VARCHAR(50) DEFAULT 'sent',
    metadata JSONB,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_whatsapp_messages_conversation_id ON public.whatsapp_messages(conversation_id);
CREATE INDEX idx_whatsapp_messages_direction ON public.whatsapp_messages(direction);
CREATE INDEX idx_whatsapp_messages_sent_at ON public.whatsapp_messages(sent_at DESC);

COMMENT ON TABLE public.whatsapp_conversations IS 'Conversas via WhatsApp integradas com n8n';
COMMENT ON TABLE public.whatsapp_messages IS 'Mensagens individuais do WhatsApp';
