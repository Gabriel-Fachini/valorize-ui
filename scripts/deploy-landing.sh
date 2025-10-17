#!/bin/bash

# ============================================
# SCRIPT DE DEPLOY MANUAL - LANDING PAGE
# ============================================
# Este script facilita o deploy manual da landing page
# Use: ./scripts/deploy-landing.sh
# ============================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting Landing Page Deploy to Cloud Run${NC}\n"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI not found. Please install it first.${NC}"
    echo "Visit: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo -e "${RED}❌ Docker is not running. Please start Docker.${NC}"
    exit 1
fi

# Get project ID
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ No GCP project configured.${NC}"
    echo "Run: gcloud config set project YOUR-PROJECT-ID"
    exit 1
fi

echo -e "${YELLOW}📦 Project ID: ${PROJECT_ID}${NC}"

# Set region
REGION=${REGION:-"us-central1"}
echo -e "${YELLOW}🌎 Region: ${REGION}${NC}\n"

# Environment variables
PUBLIC_SITE_URL=${PUBLIC_SITE_URL:-"https://valorize.com"}

echo -e "${YELLOW}🔧 Environment Variables:${NC}"
echo "   PUBLIC_SITE_URL: ${PUBLIC_SITE_URL}"
echo ""

# Confirmation
read -p "Continue with deploy? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Deploy cancelled.${NC}"
    exit 0
fi

# Step 1: Build Docker image for AMD64
echo -e "${GREEN}📦 Step 1/4: Building Docker image for AMD64...${NC}"
docker buildx build \
  --platform linux/amd64 \
  -f apps/landing/Dockerfile \
  --build-arg PUBLIC_SITE_URL=${PUBLIC_SITE_URL} \
  -t gcr.io/${PROJECT_ID}/valorize-landing:latest \
  --load \
  .

echo -e "${GREEN}✅ Image built successfully${NC}\n"

# Step 2: Push to Container Registry
echo -e "${GREEN}☁️  Step 2/4: Pushing image to GCR...${NC}"
docker push gcr.io/${PROJECT_ID}/valorize-landing:latest

echo -e "${GREEN}✅ Image pushed successfully${NC}\n"

# Step 3: Deploy to Cloud Run
echo -e "${GREEN}🚀 Step 3/4: Deploying to Cloud Run...${NC}"
gcloud run deploy valorize-landing \
  --image gcr.io/${PROJECT_ID}/valorize-landing:latest \
  --region ${REGION} \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 256Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 5 \
  --set-env-vars PUBLIC_SITE_URL=${PUBLIC_SITE_URL}

echo -e "${GREEN}✅ Deployed successfully${NC}\n"

# Step 4: Get service URL
echo -e "${GREEN}🔗 Step 4/4: Getting service URL...${NC}"
SERVICE_URL=$(gcloud run services describe valorize-landing \
  --region ${REGION} \
  --format 'value(status.url)')

echo -e "${GREEN}✅ Landing page deployed successfully!${NC}"
echo -e "${GREEN}🌐 URL: ${SERVICE_URL}${NC}\n"

# Open in browser (optional)
read -p "Open URL in browser? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    open ${SERVICE_URL} 2>/dev/null || xdg-open ${SERVICE_URL} 2>/dev/null || echo "Please open: ${SERVICE_URL}"
fi

echo -e "${GREEN}🎉 Deploy complete!${NC}"
