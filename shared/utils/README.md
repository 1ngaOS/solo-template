# Shared Utils

Shared utility functions for the Solo Monorepo Template.

## Installation

This package is part of the monorepo and can be used by other packages:

```typescript
import { formatDate, isValidEmail } from '@solo-template/utils';
```

## Available Functions

### `formatDate(date: Date | string): string`

Formats a date to a readable string.

### `generateRandomString(length: number): string`

Generates a random string of specified length.

### `isValidEmail(email: string): boolean`

Validates an email address format.

### `debounce(func: Function, wait: number): Function`

Creates a debounced version of a function.

### `sleep(ms: number): Promise<void>`

Utility function to sleep for a specified number of milliseconds.

## Development

```bash
# Build
pnpm build

# Watch mode
pnpm dev

# Run tests
pnpm test
```

