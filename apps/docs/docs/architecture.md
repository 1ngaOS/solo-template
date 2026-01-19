# Architecture

This document describes the architecture of the Solo Monorepo Template.

## Overview

The template is organized as a monorepo using pnpm workspaces. It consists of:

- **Backend**: Rust-based API server
- **Frontend**: SvelteKit application
- **Documentation**: Docusaurus site
- **Shared**: Reusable services and utilities

## Project Structure

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

## Backend Architecture

The backend is built with:

- **Framework**: Axum (Rust)
- **Features**:
  - RESTful API endpoints
  - CORS support
  - Request tracing and logging
  - Health check endpoints
  - API versioning

## Frontend Architecture

The frontend is built with:

- **Framework**: SvelteKit
- **Features**:
  - Server-side rendering (SSR)
  - Tailwind CSS v4 for styling
  - TypeScript support
  - SEO optimization

## Documentation Architecture

The documentation is built with:

- **Framework**: Docusaurus
- **Features**:
  - Markdown-based content
  - API documentation
  - Search functionality
  - Dark mode support

## Shared Services

Shared services provide reusable functionality across the monorepo:

- Common utilities
- Shared types and interfaces
- Reusable components

## Deployment

See the [Deployment](./deployment.md) guide for deployment options and configurations.

