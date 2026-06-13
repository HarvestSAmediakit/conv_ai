# ==============================================================================
#                 CONVOMAG AI - PRODUCTION HARDENED DOCKERFILE
# ==============================================================================
# A 4-stage production build designed for high performance, minimal image size,
# full-stack Express + Vite integration, and strict security standards.
#
# Stages:
# 1. base       - Sets up environment and base workspace.
# 2. build-deps - Installs dev + prod dependencies and pre-compiles native extensions.
# 3. builder    - Compiles the frontend (Vite) and bundles the backend (esbuild).
# 4. runtime    - Lightweight final production image with lowest privilege level.
# ==============================================================================

ARG NODE_VERSION=20.18-alpine3.20

# ------------------------------------------------------------------------------
# Stage 1: Base Environment
# ------------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS base

# Install core runtime utils (tini is essential for proper signal propagation)
RUN apk add --no-cache tini

WORKDIR /app

# Enable automatic source maps and tune garbage collection for Cloud Run / Container limits
ENV NODE_OPTIONS="--enable-source-maps --max-old-space-size=1024"
ENV NODE_ENV=production

# ------------------------------------------------------------------------------
# Stage 2: Install Dependencies (Including Native Build Tools)
# ------------------------------------------------------------------------------
FROM base AS build-deps

# Install build dependencies required for compiling native C/C++ addons (like better-sqlite3)
RUN apk add --no-cache --virtual .build-deps \
    python3 \
    make \
    g++ \
    gcc \
    libc-dev

COPY package.json package-lock.json ./

# Run clean install for both dependencies and devDependencies (needed to build frontend/backend bundles)
RUN npm ci --include=dev --cache /root/.npm --prefer-offline

# ------------------------------------------------------------------------------
# Stage 3: Codebase Compilation
# ------------------------------------------------------------------------------
FROM build-deps AS builder

COPY . .

# Run build step: compiles Vite static assets into /dist and bundles src/server.ts into server.js
RUN npm run build

# Remove development dependencies to keep production node_modules as lean as possible
RUN npm prune --omit=dev

# ------------------------------------------------------------------------------
# Stage 4: Production Runtime Image
# ------------------------------------------------------------------------------
FROM base AS runtime

# Create secure system group and user with explicit UID/GID (least privilege principles)
RUN addgroup -g 1001 -S convomag && \
    adduser -u 1001 -S convomag -G convomag

# Pre-create writable persistent and temporary directories with correct owner permissions
RUN mkdir -p /app/data /app/uploads /app/logs && \
    chown -R convomag:convomag /app

# Copy production dependencies (including pre-built binary better-sqlite3)
COPY --from=builder --chown=convomag:convomag /app/node_modules ./node_modules

# Copy compiled backend bundled server file and frontend static index/assets (/dist)
COPY --from=builder --chown=convomag:convomag /app/dist ./dist
COPY --from=builder --chown=convomag:convomag /app/package.json ./package.json
EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production
USER convomag
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/api/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/server.cjs"]
