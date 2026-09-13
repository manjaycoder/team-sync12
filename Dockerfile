# ==============================================================================
# Multi-Stage Production Dockerfile for Team-Sync Single-Instance Deployment
# Compatible with Render Docker Web Services, AWS ECS, GCP Cloud Run, and Local Docker
# ==============================================================================

# Stage 1: Build Phase
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies for native modules if needed
RUN apk add --no-cache python3 make g++

# Copy root package manifests and install root dependencies
COPY package*.json ./
RUN npm ci

# Copy server package manifests and install server dependencies
COPY server/package*.json ./server/
RUN cd server && npm ci

# Copy entire source tree
COPY . .

# Build Vite React SPA into /app/dist
RUN npm run build:client

# Build Express TypeScript server into /app/server/dist
RUN cd server && npm run build

# ==============================================================================
# Stage 2: Minimal Production Runtime
# ==============================================================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5001

# Create non-root user for cloud security
RUN addgroup -S teamsync && adduser -S teamsync -G teamsync

# Copy root manifest & compiled frontend assets
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Copy server manifest & compiled backend JavaScript
COPY --from=builder /app/server/package*.json ./server/
COPY --from=builder /app/server/dist ./server/dist

# Install production-only server dependencies
RUN cd server && npm ci --only=production && npm cache clean --force

# Set file ownership
RUN chown -R teamsync:teamsync /app

USER teamsync

EXPOSE 5001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/api/health || exit 1

CMD ["node", "server/dist/index.js"]
