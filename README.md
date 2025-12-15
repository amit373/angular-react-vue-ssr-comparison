# ⚡ SSR Comparison Suite

![SSR](https://img.shields.io/badge/SSR-100%25-success)
![SEO](https://img.shields.io/badge/SEO-Optimized-brightgreen)
![Monorepo](https://img.shields.io/badge/Monorepo-Turborepo-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED)
![Node](https://img.shields.io/badge/Node-20+-339933)
![License](https://img.shields.io/badge/License-MIT-yellow)

A **production-grade Server-Side Rendering (SSR) comparison** between **Next.js 16**, **Angular 21**, and **Nuxt 4.2**, built using a **Turbo monorepo**.

This repository implements the **same real-world application** across all three frameworks to objectively compare **performance, SEO, architecture, and developer experience** — based on **real metrics, not opinions**.

---

## 🔍 What this repository proves

This project exists to answer one practical question:

> **Which SSR framework should I choose — and why?**

Instead of demos or opinion-driven examples, this repository compares frameworks by enforcing:

- Identical routes and features
- Identical UI and shared design system
- Identical data source (JSONPlaceholder)
- 100% server-side data fetching
- Same performance constraints

All conclusions are backed by **measured Web Vitals and runtime metrics**.

---

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install
# or
make install

# Development
make dev

# Build
make build

# Start production
make start

# Test
make test

# Lint & format
make lint
make format
```

---

## 🐳 Docker

```bash
make docker-build
make docker-up
make docker-logs
make docker-down
make docker-clean
```

**Ports**
- Next.js → http://localhost:3000
- Angular → http://localhost:4000
- Nuxt → http://localhost:5000

---

## 📦 Monorepo Structure

```text
apps/
  next-ssr/        # Next.js 16 App Router
  angular-ssr/     # Angular 21 Universal SSR
  nuxt-ssr/        # Nuxt 4.2 Full SSR

packages/
  ui/              # Shared UI components
  api/             # Server-side API clients
  types/           # TypeScript types
  utils/           # Shared helpers
  tailwind-config/ # Tailwind config
  eslint-config/   # ESLint rules
  tsconfig/        # TS configs
```

---

## 🎯 Features

- ✅ 100% Server-Side Rendering
- 🔍 SEO optimized (Meta, OG, JSON-LD, Canonical)
- 🎨 Tailwind CSS + Dark Mode
- 📱 Fully responsive UI
- ♿ WCAG 2.2 AA accessibility
- ⚡ High performance & minimal hydration
- 🚨 Error handling & fallback UI
- 🧪 Unit testing (Vitest)
- 🐳 Docker multi-stage builds
- 🚀 Turborepo caching

---

## 📊 Routes

- / – Landing + metrics
- /posts – Posts list
- /posts/:id – Post details + comments
- /users – Users
- /users/:id – User profile
- /albums – Albums
- /albums/:id – Album details
- /photos – Photo gallery
- /todos – Todos
- /about – Framework comparison

---

## 📈 Performance & SEO Strategy

- SSR-only data fetching
- Streaming SSR
- Route-level code splitting
- HTTP caching (ETag / Cache-Control)
- Lazy images
- CDN-ready assets

### Measured Metrics
- TTFB
- FCP
- LCP
- Hydration time
- JS bundle size

Metrics are displayed on each landing page.

---

## 🛠️ Tech Stack

### Frameworks
- Next.js 16
- Angular 21
- Nuxt 4.2

### Core
- TypeScript 5+
- Tailwind CSS
- PNPM
- Turborepo
- Docker
- Node.js 20+

---

## 🎯 When to choose which framework

| Scenario | Recommended |
|--------|------------|
| Content-heavy SEO | Next.js / Nuxt |
| Enterprise-scale apps | Angular |
| Hybrid DX + performance | Next.js |
| Vue ecosystem | Nuxt |

---

## 📝 License

MIT
