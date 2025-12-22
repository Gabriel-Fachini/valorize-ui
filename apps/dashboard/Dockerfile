# ============================================
# DOCKERFILE FOR DASHBOARD (React + Vite)
# ============================================
# Multi-stage build for optimal image size
# Final image: ~200MB (vs 1.2GB+ without multi-stage)
# ============================================

# ============================================
# STAGE 1: Dependencies
# ============================================
FROM node:22-alpine AS deps

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@10.17.1 --activate

WORKDIR /app

# Copy workspace configuration files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY turbo.json ./

# Copy dashboard package.json
COPY apps/dashboard/package.json ./apps/dashboard/

# Install dependencies (uses pnpm workspace)
RUN pnpm install --frozen-lockfile

# ============================================
# STAGE 2: Builder
# ============================================
# Using Debian-based image instead of Alpine for SWC compatibility
FROM node:22-slim AS builder

RUN corepack enable && corepack prepare pnpm@10.17.1 --activate

WORKDIR /app

# Copy dependencies from previous stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/dashboard/node_modules ./apps/dashboard/node_modules

# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy dashboard source code
COPY apps/dashboard ./apps/dashboard

# Copy shared configs if they exist
COPY tsconfig.json ./
COPY eslint.config.ts ./

# Build arguments for environment variables
# Note: Using ARG only (not ENV) to avoid exposing in image layers
ARG VITE_API_BASE_URL
ARG VITE_API_URL

# Build the dashboard with build arguments
RUN --mount=type=cache,target=/app/.pnpm-store \
  VITE_API_BASE_URL=${VITE_API_BASE_URL} \
  VITE_API_URL=${VITE_API_URL} \
  pnpm build

# ============================================
# STAGE 3: Production Runner (Nginx)
# ============================================
FROM nginx:alpine AS runner

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy custom nginx configuration
COPY apps/dashboard/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/apps/dashboard/dist /usr/share/nginx/html

# Expose port (Cloud Run uses 8080 by default)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/ || exit 1

# Nginx runs in foreground by default
