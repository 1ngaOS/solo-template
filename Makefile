.PHONY: help install up down restart logs watch build test clean frontend-dev backend-dev docs-dev

# Default target
help:
	@echo "Solo Monorepo Template - Available Commands:"
	@echo ""
	@echo "  make install       - Install all dependencies"
	@echo "  make up            - Start all services using docker compose"
	@echo "  make down          - Stop all services"
	@echo "  make restart       - Restart all services"
	@echo "  make logs          - View logs from all services"
	@echo "  make watch         - Start all services in watch mode"
	@echo "  make build         - Build all services"
	@echo "  make test          - Run tests for all services"
	@echo "  make clean         - Clean build artifacts"
	@echo ""
	@echo "Service-specific commands:"
	@echo "  make frontend-dev  - Start frontend in development mode"
	@echo "  make backend-dev   - Start backend in development mode"
	@echo "  make docs-dev      - Start docs in development mode"
	@echo "  make frontend-test - Run frontend tests"
	@echo "  make backend-test  - Run backend tests"
	@echo "  make frontend-build - Build frontend"
	@echo "  make backend-build - Build backend"

# Install dependencies
install:
	pnpm install

# Docker Compose commands
up:
	@echo "Starting all services with docker compose..."
	docker compose -f infra/compose.yml up -d

down:
	@echo "Stopping all services..."
	docker compose -f infra/compose.yml down

restart: down up

logs:
	docker compose -f infra/compose.yml logs -f

logs-%:
	docker compose -f infra/compose.yml logs -f $*

watch:
	docker compose -f infra/compose.yml up --watch

watch-%:
	docker compose -f infra/compose.yml up --watch $*

# Build commands
build: frontend-build backend-build docs-build

frontend-build:
	@echo "Building frontend..."
	pnpm frontend build

backend-build:
	@echo "Building backend..."
	pnpm backend build

docs-build:
	@echo "Building docs..."
	pnpm docs build

# Development commands
frontend-dev:
	@echo "Starting frontend development server..."
	pnpm frontend dev

backend-dev:
	@echo "Starting backend development server..."
	pnpm backend dev

docs-dev:
	@echo "Starting docs development server..."
	pnpm docs dev

# Test commands
test: frontend-test backend-test

frontend-test:
	@echo "Running frontend tests..."
	pnpm frontend test

backend-test:
	@echo "Running backend tests..."
	pnpm backend test

# Clean commands
clean:
	@echo "Cleaning build artifacts..."
	rm -rf apps/frontend/build
	rm -rf apps/docs/build
	rm -rf apps/backend/target
	rm -rf node_modules
	rm -rf apps/*/node_modules
	rm -rf shared/*/node_modules

# Service-specific commands for shared services
utils-build:
	cd shared/utils && pnpm build

utils-test:
	cd shared/utils && pnpm test

utils-dev:
	cd shared/utils && pnpm dev

