#!/bin/bash

# ============================================
# SCRIPT DE CONFIGURAÇÃO RÁPIDA CI/CD
# ============================================
# Este script automatiza a configuração inicial
# Use: ./scripts/setup-cicd.sh
# ============================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════╗"
echo "║   🚀 Configuração de CI/CD - Google Cloud Run       ║"
echo "╔═══════════════════════════════════════════════════════╗"
echo -e "${NC}\n"

# Check gcloud
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI não encontrado${NC}"
    echo "Instale: brew install --cask google-cloud-sdk"
    exit 1
fi

# Get project
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ Nenhum projeto GCP configurado${NC}"
    echo "Execute: gcloud config set project SEU-PROJECT-ID"
    exit 1
fi

echo -e "${GREEN}✅ Projeto: ${PROJECT_ID}${NC}\n"

# Step 1: Enable APIs
echo -e "${YELLOW}📋 Passo 1/3: Ativando APIs necessárias...${NC}"
echo ""

APIs=(
    "cloudbuild.googleapis.com"
    "run.googleapis.com"
    "containerregistry.googleapis.com"
)

for api in "${APIs[@]}"; do
    echo -n "   Ativando ${api}... "
    if gcloud services enable "$api" 2>/dev/null; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${YELLOW}(já ativa)${NC}"
    fi
done

echo ""

# Step 2: Grant permissions
echo -e "${YELLOW}🔐 Passo 2/3: Concedendo permissões ao Cloud Build...${NC}"
echo ""

PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
SERVICE_ACCOUNT="$PROJECT_NUMBER@cloudbuild.gserviceaccount.com"

echo "   Service Account: ${SERVICE_ACCOUNT}"

# Cloud Run Admin
echo -n "   Concedendo Cloud Run Admin... "
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/run.admin" \
  --quiet > /dev/null 2>&1
echo -e "${GREEN}✓${NC}"

# Service Account User
echo -n "   Concedendo Service Account User... "
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/iam.serviceAccountUser" \
  --quiet > /dev/null 2>&1
echo -e "${GREEN}✓${NC}"

echo ""

# Step 3: Instructions for triggers
echo -e "${YELLOW}📝 Passo 3/3: Configurar triggers no Console${NC}"
echo ""
echo -e "${BLUE}Agora você precisa configurar os triggers manualmente:${NC}"
echo ""
echo "1️⃣  Acesse: ${BLUE}https://console.cloud.google.com/cloud-build/triggers?project=${PROJECT_ID}${NC}"
echo ""
echo "2️⃣  Clique em 'Connect Repository' e conecte o GitHub"
echo ""
echo "3️⃣  Crie dois triggers:"
echo ""
echo "    ${GREEN}Trigger 1: deploy-dashboard${NC}"
echo "    - Repository: Gabriel-Fachini/valorize-ui"
echo "    - Branch: ^main$"
echo "    - Config file: /cloudbuild-dashboard.yaml"
echo "    - Included files: apps/dashboard/**"
echo "    - Variables:"
echo "      • _REGION = us-central1"
echo "      • _VITE_API_BASE_URL = https://api.valorize.com"
echo "      • _VITE_API_URL = https://api.valorize.com"
echo ""
echo "    ${GREEN}Trigger 2: deploy-landing${NC}"
echo "    - Repository: Gabriel-Fachini/valorize-ui"
echo "    - Branch: ^main$"
echo "    - Config file: /cloudbuild-landing.yaml"
echo "    - Included files: apps/landing/**"
echo "    - Variables:"
echo "      • _REGION = us-central1"
echo "      • _PUBLIC_SITE_URL = https://valorize.com"
echo ""
echo "4️⃣  Faça o primeiro deploy manual antes dos triggers:"
echo ""
echo "    ${BLUE}./scripts/deploy-dashboard.sh${NC}"
echo "    ${BLUE}./scripts/deploy-landing.sh${NC}"
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Configuração base concluída!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo ""
echo -e "📖 Guia completo: ${BLUE}docs/DEPLOY_AUTOMATICO_CI_CD.md${NC}"
echo ""
