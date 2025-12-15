# SSR Comparison Suite

Production-ready Server-Side Rendering comparison between Next.js 16, Angular 21, and Nuxt 4.2.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install
# or
make install

# Development (all apps)
make dev
# or
pnpm dev

# Build all apps
make build
# or
pnpm build

# Start production servers
make start
# or
pnpm start

# Run tests
make test
# or
pnpm test

# Lint & Format
make lint
make format
```

## 🐳 Docker

```bash
# Build Docker images
make docker-build

# Start all services
make docker-up

# View logs
make docker-logs

# Stop services
make docker-down

# Clean up
make docker-clean
```

**Ports:**
- Next.js: `http://localhost:3000`
- Angular: `http://localhost:4000`
- Nuxt: `http://localhost:5000`

## 🎯 Individual App Commands

### Next.js
```bash
make dev-next        # Development
make build-next      # Build
make start-next      # Production
```

### Angular
```bash
make dev-angular     # Development
make build-angular   # Build
make start-angular   # Production
```

### Nuxt
```bash
make dev-nuxt        # Development
make build-nuxt      # Build
make start-nuxt      # Production
```

## 📦 Monorepo Structure

```
├── apps/
│   ├── next-ssr/          # Next.js 16 App Router (Port 3000)
│   ├── angular-ssr/       # Angular 21 SSR (Port 4000)
│   └── nuxt-ssr/          # Nuxt 4.2 Full SSR (Port 5000)
├── packages/
│   ├── ui/                # Shared design system & components
│   ├── api/               # API clients & data fetchers
│   ├── types/             # TypeScript interfaces & types
│   ├── utils/             # Shared utilities & helpers
│   ├── tailwind-config/   # Shared Tailwind configuration
│   ├── eslint-config/     # Shared ESLint configuration
│   └── tsconfig/          # Shared TypeScript configurations
```

## 🎯 Features

- ✅ 100% Server-Side Rendering
- ✅ SEO Optimized (Meta tags, OG, Twitter cards, JSON-LD)
- ✅ Dark Mode Support
- ✅ Fully Responsive Design
- ✅ WCAG 2.2 AA Accessibility
- ✅ Performance Optimized
- ✅ Error Handling & Fallbacks
- ✅ Docker Support with Multi-Stage Builds
- ✅ Comprehensive Testing (Vitest)
- ✅ Shared Component Library
- ✅ Monorepo with Turborepo

## 📊 Routes

All three apps implement identical routes:
- `/` - Landing page with framework metrics
- `/posts` - Posts list with pagination
- `/posts/:id` - Individual post details
- `/users` - Users directory
- `/users/:id` - User profile with posts
- `/albums` - Albums gallery
- `/albums/:id` - Album details with photos
- `/photos` - Photo gallery with lightbox
- `/todos` - Interactive todos list
- `/about` - About page with framework info

## 🛠️ Tech Stack

### Frameworks
- **Next.js**: 16.0.8 (App Router, React Server Components)
- **Angular**: 21 (Standalone Components, SSR)
- **Nuxt**: 4.2 (Vue 3, Full SSR)

### Core Technologies
- **Language**: TypeScript 5.4+
- **Styling**: Tailwind CSS 3.4
- **Animations**: Framer Motion
- **Package Manager**: PNPM 9.0+
- **Monorepo**: Turborepo 2.0
- **Testing**: Vitest 1.2
- **Runtime**: Node.js 20+

### Shared Packages
- `@ssr-comparison/ui` - Shared component library
- `@ssr-comparison/api` - API clients & data fetching
- `@ssr-comparison/types` - TypeScript definitions
- `@ssr-comparison/utils` - Common utilities
- `@ssr-comparison/tailwind-config` - Tailwind configuration
- `@ssr-comparison/eslint-config` - ESLint rules
- `@ssr-comparison/tsconfig` - TypeScript configs

## 🔧 Development

### Prerequisites
- Node.js 20 or higher
- PNPM 9.0 or higher

### Environment
All apps run in development mode with hot reload enabled. Ports are automatically cleaned before starting to avoid conflicts.

### Project Commands
```bash
make help           # Show all available commands
make clean          # Clean build artifacts
pnpm format         # Format code with Prettier
```

## 📝 License

MIT

