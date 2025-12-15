FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/angular-ssr/package.json ./apps/angular-ssr/
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
COPY apps/angular-ssr ./apps/angular-ssr

# Build Angular app from workspace root
RUN NODE_ENV=production pnpm --filter angular-ssr build:ssr

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 angular

COPY --from=builder --chown=angular:nodejs /app/apps/angular-ssr/dist ./dist

USER angular

EXPOSE 4000

ENV PORT 4000

CMD ["node", "dist/angular-ssr/browser/server/server.mjs"]

