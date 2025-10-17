# ============================================
# DOCKERFILE FOR LANDING PAGE (Astro SSG)
# ============================================
# Multi-stage build for optimal image size
# ============================================

# ============================================
# STAGE 1: Dependencies
# ============================================
FROM node:22-alpine AS deps

RUN corepack enable && corepack prepare pnpm@10.17.1 --activate

WORKDIR /app

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY turbo.json ./

# Copy landing package.json
COPY apps/landing/package.json ./apps/landing/

# Install dependencies
RUN pnpm install --frozen-lockfile

# ============================================
# STAGE 2: Builder
# ============================================
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@10.17.1 --activate

WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/landing/node_modules ./apps/landing/node_modules

# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy landing source
COPY apps/landing ./apps/landing

# Copy shared configs
COPY tsconfig.json ./
COPY eslint.config.ts ./

# Build arguments (if needed for landing)
ARG PUBLIC_SITE_URL
ENV PUBLIC_SITE_URL=$PUBLIC_SITE_URL

# Build the landing page (SSG - generates static files)
RUN pnpm build:landing

# ============================================
# STAGE 3: Production Runner (Nginx)
# ============================================
FROM nginx:alpine AS runner

RUN apk add --no-cache curl

# Copy nginx config for landing
COPY apps/landing/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files from builder
COPY --from=builder /app/apps/landing/dist /usr/share/nginx/html

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/ || exit 1
