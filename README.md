# Solo Monorepo Template

A production-ready monorepo template for solo projects featuring backend, frontend, and documentation components.

## 🚀 Features

- **Backend**: Rust-based API server with base endpoints
- **Frontend**: SvelteKit application with SSR
- **Documentation**: Docusaurus documentation site
- **Shared Modules**: Reusable services and utilities
- **Monorepo**: Managed with pnpm workspaces
- **CI/CD**: GitHub Actions workflows ready
- **Development**: Makefile commands for quick development

## 📁 Structure

```
.
├── apps/
│   ├── backend/          # Rust backend API
│   ├── frontend/         # SvelteKit frontend
│   └── docs/             # Docusaurus documentation
├── shared/               # Shared services and utilities
├── infra/                # Infrastructure configuration
└── .github/workflows/    # CI/CD workflows
```

## 🛠️ Technology Stack

- **Package Manager**: pnpm
- **Backend**: Rust (Axum)
- **Frontend**: SvelteKit with Tailwind CSS v4
- **Documentation**: Docusaurus
- **Containerization**: Docker & Docker Compose

## 🚦 Quick Start

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 10.0.0
- Rust (for backend development)
- Docker & Docker Compose (for infrastructure)

### Installation

```bash
# Install dependencies
pnpm install

# Start all services in development mode
make up

# Or start individual services
make frontend-dev
make backend-dev
make docs-dev
```

### Development

```bash
# Frontend development
pnpm frontend dev

# Backend development
pnpm backend dev

# Documentation development
pnpm docs dev
```

## 📝 Available Commands

### Makefile Commands

- `make up` - Start all services
- `make down` - Stop all services
- `make frontend-dev` - Start frontend in dev mode
- `make backend-dev` - Start backend in dev mode
- `make docs-dev` - Start docs in dev mode
- `make build` - Build all services
- `make test` - Run all tests

### pnpm Commands

- `pnpm frontend dev` - Run frontend development server
- `pnpm backend dev` - Run backend development server
- `pnpm docs dev` - Run documentation development server
- `pnpm frontend build` - Build frontend for production
- `pnpm backend build` - Build backend for production

## 🏗️ Project Structure Details

### Backend (`apps/backend`)

Rust-based API server with base endpoints:
- Health check endpoint
- API versioning
- CORS configuration
- Error handling

### Frontend (`apps/frontend`)

SvelteKit application with:
- Server-side rendering (SSR)
- Tailwind CSS v4 for styling
- Responsive design
- SEO optimization

### Documentation (`apps/docs`)

Docusaurus documentation site with:
- Getting started guides
- API documentation
- Architecture overview
- Deployment guides

### Shared (`shared/`)

Reusable services and utilities:
- Sample shared service module
- Common utilities
- Shared types and interfaces

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [SvelteKit](https://kit.svelte.dev/)
- [Rust](https://www.rust-lang.org/)
- [Docusaurus](https://docusaurus.io/)
- [pnpm](https://pnpm.io/)

