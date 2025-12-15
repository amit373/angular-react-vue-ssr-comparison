.PHONY: help dev build start test clean docker-up docker-down docker-build lint format install

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install all dependencies
	pnpm install

dev: ## Start all apps in development mode
	@echo "Killing existing processes on ports 3000, 4000, 5000..."
	@for p in 3000 4000 5000; do \
		if lsof -ti:$$p >/dev/null 2>&1; then \
			lsof -ti:$$p | xargs kill -9 2>/dev/null || true; \
			echo "Killed processes on port $$p"; \
		fi; \
	done
	@sleep 2
	@echo "Starting all development servers..."
	@pnpm dev

build: ## Build all apps for production
	pnpm build

start: ## Start all apps in production mode
	pnpm start

test: ## Run all tests
	pnpm test

lint: ## Lint all code
	pnpm lint

format: ## Format all code
	pnpm format

clean: ## Clean all build artifacts and node_modules
	@echo "Cleaning build artifacts and node_modules..."
	@find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
	@find . -name "dist" -type d -prune -exec rm -rf '{}' +
	@find . -name ".angular" -type d -prune -exec rm -rf '{}' +
	@find . -name ".next" -type d -prune -exec rm -rf '{}' +
	@find . -name ".nuxt" -type d -prune -exec rm -rf '{}' +
	@find . -name ".turbo" -type d -prune -exec rm -rf '{}' +
	@find . -name ".output" -type d -prune -exec rm -rf '{}' +
	@find . -name ".cursor" -type d -prune -exec rm -rf '{}' +
	@echo "Clean complete!"

docker-build: ## Build all Docker images
	docker-compose build

docker-up: ## Start all services with Docker Compose
	docker-compose up -d

docker-down: ## Stop all Docker services
	docker-compose down

docker-logs: ## View logs from all Docker services
	docker-compose logs -f

docker-clean: ## Remove all Docker containers and images
	docker-compose down -v --rmi all

# Individual app targets
dev-next: ## Start Next.js app in development
	@lsof -ti:3000 | xargs kill -9 2>/dev/null || true
	@sleep 1
	@pnpm --filter next-ssr dev

dev-angular: ## Start Angular app in development
	@lsof -ti:4000 | xargs kill -9 2>/dev/null || true
	@sleep 1
	@pnpm --filter angular-ssr dev

dev-nuxt: ## Start Nuxt app in development
	@lsof -ti:5000 | xargs kill -9 2>/dev/null || true
	@sleep 1
	@pnpm --filter nuxt-ssr dev

build-next: ## Build Next.js app
	pnpm --filter next-ssr build

build-angular: ## Build Angular app
	pnpm --filter angular-ssr build:ssr

build-nuxt: ## Build Nuxt app
	pnpm --filter nuxt-ssr build

start-next: ## Start Next.js app in production
	pnpm --filter next-ssr start

start-angular: ## Start Angular app in production
	pnpm --filter angular-ssr start

start-nuxt: ## Start Nuxt app in production
	pnpm --filter nuxt-ssr start

