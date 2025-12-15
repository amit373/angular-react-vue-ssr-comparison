FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/next-ssr/package.json ./apps/next-ssr/
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
COPY apps/next-ssr ./apps/next-ssr

# Build Next.js app from workspace root
RUN NODE_ENV=production pnpm --filter next-ssr build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/next-ssr/public ./apps/next-ssr/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/next-ssr/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/next-ssr/.next/static ./apps/next-ssr/.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "apps/next-ssr/server.js"]

