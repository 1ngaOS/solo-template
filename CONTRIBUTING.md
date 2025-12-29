# Contributing to Solo Monorepo Template

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/solo-template.git
   cd solo-template
   ```

3. **Install dependencies**
   ```bash
   pnpm install
   ```

4. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running the Project

```bash
# Start all services
make up

# Or start individually
make frontend-dev
make backend-dev
make docs-dev
```

### Making Changes

1. Make your changes in the appropriate directory
2. Test your changes locally
3. Ensure all tests pass
4. Build the project to verify no errors

### Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Example:
```
feat(frontend): add new landing page component

Implemented a new landing page component with responsive design
and improved accessibility features.
```

### Testing

```bash
# Run all tests
make test

# Run frontend tests
pnpm frontend test

# Run backend tests
pnpm backend test
```

### Building

```bash
# Build all services
make build

# Build individual services
pnpm frontend build
pnpm backend build
```

## Pull Request Process

1. **Update documentation** if you've changed functionality
2. **Update tests** to cover new functionality
3. **Ensure all tests pass** and builds succeed
4. **Create a pull request** with a clear description:
   - What changes were made
   - Why the changes were made
   - How to test the changes
   - Screenshots (if UI changes)

5. **Link related issues** using keywords (e.g., `Closes #123`)

## Code Style

### Rust (Backend)

- Follow Rust standard formatting: `cargo fmt`
- Use `cargo clippy` for linting
- Follow Rust API design guidelines

### TypeScript/JavaScript (Frontend)

- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Use meaningful variable and function names

### Documentation

- Update relevant documentation files
- Add JSDoc comments for public APIs
- Keep examples up to date

## Project Structure

- `apps/backend/` - Rust backend API
- `apps/frontend/` - SvelteKit frontend
- `apps/docs/` - Docusaurus documentation
- `shared/` - Shared services and utilities

## Questions?

If you have questions or need help, please:
- Open an issue with the `question` label
- Check existing issues and discussions

Thank you for contributing! 🎉

