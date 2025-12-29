# Getting Started

Welcome to the Solo Monorepo Template! This guide will help you get started with the template.

## Prerequisites

Before you begin, make sure you have the following installed:

- Node.js >= 20.0.0
- pnpm >= 10.0.0
- Rust (for backend development)
- Docker & Docker Compose (for infrastructure)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-org/solo-template.git
cd solo-template
```

2. Install dependencies:

```bash
pnpm install
```

3. Start all services:

```bash
make up
```

## Development

### Frontend Development

```bash
# Start frontend development server
pnpm frontend dev
```

The frontend will be available at `http://localhost:5173`.

### Backend Development

```bash
# Start backend development server
pnpm backend dev
```

The backend API will be available at `http://localhost:3000`.

### Documentation Development

```bash
# Start documentation development server
pnpm docs dev
```

The documentation will be available at `http://localhost:3000`.

## Next Steps

- Read the [Architecture](./architecture.md) guide to understand the project structure
- Check out the [API Reference](./api-reference.md) for backend endpoints
- Learn about [Deployment](./deployment.md) options

