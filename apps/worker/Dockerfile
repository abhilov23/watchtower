# Multi-region Watchtower Worker Dockerfile
FROM node:22-alpine AS base

# Install OpenSSL for Prisma and ca-certificates for HTTPS checks
RUN apk add --no-cache openssl ca-certificates libc6-compat
RUN npm install -g pnpm@11.25.0

WORKDIR /app

# Copy root workspace manifests
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json* ./

# Copy required package manifests and sources
COPY packages/db ./packages/db
COPY packages/queue ./packages/queue
COPY packages/typescript-config ./packages/typescript-config
COPY apps/worker ./apps/worker

# Install dependencies
RUN pnpm install --frozen-lockfile

# Generate Prisma Client for PostgreSQL
RUN pnpm --filter @watchtower/db db:generate

# Build packages and worker
RUN pnpm --filter @watchtower/queue check-types
RUN pnpm --filter @watchtower/worker build

ENV NODE_ENV=production

# Default command to run the worker
CMD ["node", "apps/worker/dist/index.js"]
