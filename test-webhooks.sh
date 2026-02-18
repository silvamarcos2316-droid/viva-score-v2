#!/bin/bash
# ============================================================================
# PRISMA Score - Webhook Testing Script
# ============================================================================
# This script contains curl commands to test all webhook endpoints
# Usage: bash test-webhooks.sh
# ============================================================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="https://prisma-score.vercel.app"
# BASE_URL="http://localhost:3000" # Uncomment for local testing

# Get secrets from .env.local or prompt
if [ -f .env.local ]; then
  source .env.local
fi

# API Keys (will be prompted if not set)
if [ -z "$ADMIN_API_KEY" ]; then
  read -p "Enter ADMIN_API_KEY: " ADMIN_API_KEY
fi

if [ -z "$SUPABASE_WEBHOOK_SECRET" ]; then
  read -p "Enter SUPABASE_WEBHOOK_SECRET: " SUPABASE_WEBHOOK_SECRET
fi

echo -e "${YELLOW}============================================================================${NC}"
echo -e "${YELLOW}PRISMA Score - Webhook Testing${NC}"
echo -e "${YELLOW}============================================================================${NC}\n"

# ============================================================================
# Test 1: Health Check - New Lead Webhook
# ============================================================================
echo -e "${YELLOW}Test 1: Health Check - New Lead Webhook${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/api/webhooks/new-lead")

if [ "$response" = "200" ]; then
  echo -e "${GREEN}✓ Health check passed (HTTP $response)${NC}\n"
else
  echo -e "${RED}✗ Health check failed (HTTP $response)${NC}\n"
fi

# ============================================================================
# Test 2: Health Check - New Analysis Webhook
# ============================================================================
echo -e "${YELLOW}Test 2: Health Check - New Analysis Webhook${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/api/webhooks/new-analysis")

if [ "$response" = "200" ]; then
  echo -e "${GREEN}✓ Health check passed (HTTP $response)${NC}\n"
else
  echo -e "${RED}✗ Health check failed (HTTP $response)${NC}\n"
fi

# ============================================================================
# Test 3: New Lead Webhook (with valid payload)
# ============================================================================
echo -e "${YELLOW}Test 3: New Lead Webhook (POST with valid payload)${NC}"

payload='{
  "type": "INSERT",
  "table": "leads",
  "record": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "created_at": "2024-01-15T10:00:00.000Z",
    "full_name": "João Silva Teste",
    "email": "joao.teste@example.com",
    "phone": "11999887766",
    "company": "Tech Startup Teste",
    "source": "website",
    "utm_source": "google",
    "utm_medium": "cpc",
    "utm_campaign": "test"
  },
  "schema": "public",
  "old_record": null
}'

response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "$BASE_URL/api/webhooks/new-lead" \
  -H "Content-Type: application/json" \
  -H "x-webhook-signature: $SUPABASE_WEBHOOK_SECRET" \
  -d "$payload")

http_code=$(echo "$response" | grep "HTTP_CODE" | cut -d: -f2)
body=$(echo "$response" | sed '/HTTP_CODE/d')

if [ "$http_code" = "200" ]; then
  echo -e "${GREEN}✓ Webhook accepted (HTTP $http_code)${NC}"
  echo -e "Response: $body\n"
else
  echo -e "${RED}✗ Webhook failed (HTTP $http_code)${NC}"
  echo -e "Response: $body\n"
fi

# ============================================================================
# Test 4: New Analysis Webhook (with valid payload - High Score)
# ============================================================================
echo -e "${YELLOW}Test 4: New Analysis Webhook - High Score (36-40)${NC}"

payload='{
  "type": "INSERT",
  "table": "analyses",
  "record": {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "created_at": "2024-01-15T10:05:00.000Z",
    "lead_id": "550e8400-e29b-41d4-a716-446655440000",
    "full_name": "João Silva Teste",
    "email": "joao.teste@example.com",
    "phone": "11999887766",
    "company": "Tech Startup Teste",
    "project_name": "AI Chatbot para Suporte",
    "problem_statement": "Reduzir tempo de resposta no suporte",
    "tech_stack": ["OpenAI", "Node.js", "PostgreSQL"],
    "integration_needs": "Integração com Zendesk",
    "budget_range": "R$ 150k - R$ 300k",
    "roi_expectation": "ROI positivo em 6-12 meses",
    "timeline": "3-6 meses",
    "blockers": "Nenhum bloqueador significativo",
    "score_vision": 9,
    "score_integration": 8,
    "score_viability": 10,
    "score_execution": 9,
    "classification": "alta-viabilidade",
    "risks": [
      "Dependência de API externa (OpenAI)",
      "Necessidade de treinamento de modelo customizado",
      "Integração com sistema legado pode ter complexidade"
    ],
    "strengths": [
      "Problema bem definido e quantificável",
      "Budget adequado para escopo",
      "Timeline realista e viável"
    ],
    "next_steps": [
      "Realizar discovery workshop para detalhamento técnico",
      "Definir arquitetura de integração com Zendesk",
      "Criar protótipo funcional (MVP) para validação"
    ],
    "questions": [
      "Qual o volume atual de tickets de suporte?",
      "Existem dados históricos para treinamento?"
    ],
    "missing_info": [
      "Métricas atuais de tempo de resposta",
      "Estrutura de dados do Zendesk"
    ],
    "vision_analysis": "Visão clara e bem articulada do problema.",
    "integration_analysis": "Integração técnica viável com stack moderna.",
    "viability_analysis": "Budget e ROI expectation muito bem alinhados.",
    "execution_analysis": "Timeline realista e sem bloqueadores críticos."
  },
  "schema": "public",
  "old_record": null
}'

response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "$BASE_URL/api/webhooks/new-analysis" \
  -H "Content-Type: application/json" \
  -H "x-webhook-signature: $SUPABASE_WEBHOOK_SECRET" \
  -d "$payload")

http_code=$(echo "$response" | grep "HTTP_CODE" | cut -d: -f2)
body=$(echo "$response" | sed '/HTTP_CODE/d')

if [ "$http_code" = "200" ]; then
  echo -e "${GREEN}✓ Webhook accepted (HTTP $http_code)${NC}"
  echo -e "Response: $body\n"
else
  echo -e "${RED}✗ Webhook failed (HTTP $http_code)${NC}"
  echo -e "Response: $body\n"
fi

# ============================================================================
# Test 5: New Analysis Webhook (Medium Score)
# ============================================================================
echo -e "${YELLOW}Test 5: New Analysis Webhook - Medium Score (26-35)${NC}"

payload='{
  "type": "INSERT",
  "table": "analyses",
  "record": {
    "id": "770e8400-e29b-41d4-a716-446655440000",
    "created_at": "2024-01-15T10:10:00.000Z",
    "lead_id": "550e8400-e29b-41d4-a716-446655440000",
    "full_name": "Maria Santos Teste",
    "email": "maria.teste@example.com",
    "phone": "21988776655",
    "company": "E-commerce XYZ",
    "project_name": "Sistema de Recomendação",
    "problem_statement": "Aumentar conversão com recomendações personalizadas",
    "tech_stack": ["Python", "TensorFlow", "AWS"],
    "integration_needs": "Integração com plataforma e-commerce",
    "budget_range": "R$ 50k - R$ 150k",
    "roi_expectation": "ROI positivo em 12 meses",
    "timeline": "6-12 meses",
    "blockers": "Limitação de dados históricos",
    "score_vision": 7,
    "score_integration": 6,
    "score_viability": 8,
    "score_execution": 7,
    "classification": "potencial-alto",
    "risks": [
      "Dados históricos insuficientes para treinamento",
      "Complexidade de integração com plataforma legada",
      "Necessidade de infraestrutura robusta para ML"
    ],
    "strengths": [
      "Problema comum com soluções validadas no mercado",
      "ROI potencialmente alto",
      "Stack tecnológico adequado"
    ],
    "next_steps": [
      "Avaliar qualidade e quantidade dos dados disponíveis",
      "Definir MVP com escopo reduzido",
      "Validar viabilidade técnica da integração"
    ],
    "questions": [
      "Quantos usuários e transações por mês?",
      "Qual a plataforma de e-commerce utilizada?",
      "Existem dados de comportamento de usuários?"
    ],
    "missing_info": [
      "Volume de dados disponível",
      "Infraestrutura atual",
      "Equipe técnica interna"
    ],
    "vision_analysis": "Visão clara mas falta detalhamento técnico.",
    "integration_analysis": "Integração possível mas requer validação.",
    "viability_analysis": "Budget pode ser limitante para escopo completo.",
    "execution_analysis": "Timeline adequado considerando complexidade."
  },
  "schema": "public",
  "old_record": null
}'

response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "$BASE_URL/api/webhooks/new-analysis" \
  -H "Content-Type: application/json" \
  -H "x-webhook-signature: $SUPABASE_WEBHOOK_SECRET" \
  -d "$payload")

http_code=$(echo "$response" | grep "HTTP_CODE" | cut -d: -f2)
body=$(echo "$response" | sed '/HTTP_CODE/d')

if [ "$http_code" = "200" ]; then
  echo -e "${GREEN}✓ Webhook accepted (HTTP $http_code)${NC}"
  echo -e "Response: $body\n"
else
  echo -e "${RED}✗ Webhook failed (HTTP $http_code)${NC}"
  echo -e "Response: $body\n"
fi

# ============================================================================
# Test 6: Admin API - List Analyses
# ============================================================================
echo -e "${YELLOW}Test 6: Admin API - List Analyses${NC}"

response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X GET "$BASE_URL/api/admin/analyses?limit=10" \
  -H "x-api-key: $ADMIN_API_KEY")

http_code=$(echo "$response" | grep "HTTP_CODE" | cut -d: -f2)
body=$(echo "$response" | sed '/HTTP_CODE/d')

if [ "$http_code" = "200" ]; then
  echo -e "${GREEN}✓ Admin API accessible (HTTP $http_code)${NC}"
  echo -e "Response: $body\n"
else
  echo -e "${RED}✗ Admin API failed (HTTP $http_code)${NC}"
  echo -e "Response: $body\n"
fi

# ============================================================================
# Test 7: Admin API - Statistics
# ============================================================================
echo -e "${YELLOW}Test 7: Admin API - Statistics${NC}"

response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X GET "$BASE_URL/api/admin/stats" \
  -H "x-api-key: $ADMIN_API_KEY")

http_code=$(echo "$response" | grep "HTTP_CODE" | cut -d: -f2)
body=$(echo "$response" | sed '/HTTP_CODE/d')

if [ "$http_code" = "200" ]; then
  echo -e "${GREEN}✓ Admin API accessible (HTTP $http_code)${NC}"
  echo -e "Response: $body\n"
else
  echo -e "${RED}✗ Admin API failed (HTTP $http_code)${NC}"
  echo -e "Response: $body\n"
fi

# ============================================================================
# Test 8: Admin API - Unauthorized Access (should fail)
# ============================================================================
echo -e "${YELLOW}Test 8: Admin API - Unauthorized Access (should fail with 401)${NC}"

response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X GET "$BASE_URL/api/admin/analyses" \
  -H "x-api-key: invalid-key-12345")

http_code=$(echo "$response" | grep "HTTP_CODE" | cut -d: -f2)
body=$(echo "$response" | sed '/HTTP_CODE/d')

if [ "$http_code" = "401" ]; then
  echo -e "${GREEN}✓ Authorization working correctly (HTTP $http_code)${NC}"
  echo -e "Response: $body\n"
else
  echo -e "${RED}✗ Authorization not working (HTTP $http_code - expected 401)${NC}"
  echo -e "Response: $body\n"
fi

# ============================================================================
# Test 9: Rate Limiting (send 25 requests quickly)
# ============================================================================
echo -e "${YELLOW}Test 9: Rate Limiting (sending 25 requests quickly)${NC}"

success_count=0
rate_limited_count=0

for i in {1..25}; do
  response=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/api/webhooks/new-lead")

  if [ "$response" = "200" ]; then
    ((success_count++))
  elif [ "$response" = "429" ]; then
    ((rate_limited_count++))
  fi
done

echo -e "Success: $success_count, Rate Limited: $rate_limited_count"

if [ "$rate_limited_count" -gt 0 ]; then
  echo -e "${GREEN}✓ Rate limiting working (some requests blocked)${NC}\n"
else
  echo -e "${YELLOW}⚠ Rate limiting might not be configured${NC}\n"
fi

# ============================================================================
# Summary
# ============================================================================
echo -e "${YELLOW}============================================================================${NC}"
echo -e "${YELLOW}Testing Complete!${NC}"
echo -e "${YELLOW}============================================================================${NC}\n"

echo -e "${GREEN}Next Steps:${NC}"
echo "1. Review any failed tests above"
echo "2. Configure Supabase webhooks (see N8N-INTEGRATION.md)"
echo "3. Set up n8n workflows (see N8N-INTEGRATION.md)"
echo "4. Test end-to-end with real form submission"
echo ""
echo -e "${YELLOW}For detailed documentation, see:${NC}"
echo "- N8N-INTEGRATION.md"
echo "- WHATSAPP-FLOW.md"
echo ""
