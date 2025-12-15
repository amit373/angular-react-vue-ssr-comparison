FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/nuxt-ssr/package.json ./apps/nuxt-ssr/
COPY packages ./packages

# Install dependencies
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy everything from deps stage
COPY --from=deps /app ./

# Copy app source
COPY apps/nuxt-ssr ./apps/nuxt-ssr

# Build Nuxt app from workspace root
RUN NODE_ENV=production pnpm --filter nuxt-ssr build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nuxt

COPY --from=builder --chown=nuxt:nodejs /app/apps/nuxt-ssr/.output/public ./public
COPY --from=builder --chown=nuxt:nodejs /app/apps/nuxt-ssr/.output/server ./server

USER nuxt

EXPOSE 5000

ENV PORT 5000
ENV NITRO_PORT 5000
ENV NITRO_HOST 0.0.0.0

CMD ["node", "server/index.mjs"]

