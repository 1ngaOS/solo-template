# __TEMPLATE_APP_NAME__

__TEMPLATE_APP_DESCRIPTION__

## 📋 Using this template (customize your new repo)

When you create a repo from this template, customize it in one go with a **config file**:

1. **Copy the example config** and edit it with your app details:
   ```bash
   cp template.config.example.yaml template.config.yaml
   # Edit template.config.yaml: app name, description, SEO, logo, repo, deployment (systemd names, env paths)
   ```

2. **Apply the config** across the repo (package.json, frontend, docs, systemd, CI/CD):
   ```bash
   pnpm install   # for the apply-template script
   pnpm run apply-template
   ```

3. **Optional**: Add your logo under `apps/frontend/static/` and `apps/docs/static/img/` (paths set in config: `branding.logoPath`, `seo.favicon`, `seo.ogImage`).

The config drives:

- **App identity**: name, short name, description, slug
- **SEO**: title, description, keywords, favicon, OG image
- **Branding**: logo path and alt text
- **Repo**: GitHub org/repo for links and edit URLs
- **Deployment**: `appName` for `/opt/<name>/...`, systemd service names (staging/production)

See `template.config.example.yaml` for every option. After applying, commit the changes and set up GitHub Environments and secrets as in `infra/systemd/README.md`.

## 🚀 Features

- **Backend**: Rust-based API server with base endpoints
- **Frontend**: SvelteKit application with SSR
- **Documentation**: Docusaurus documentation site
- **Shared Modules**: Reusable services and utilities
- **Monorepo**: Managed with pnpm workspaces
- **CI/CD**: GitHub Actions workflows ready (staging/production environments)
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

