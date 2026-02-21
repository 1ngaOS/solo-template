#!/usr/bin/env node
/**
 * Production entry point for SvelteKit adapter-node build on VM (systemd).
 * Loads .env from the current directory, then starts the built server (build/index.js).
 * Usage: node serve.mjs (run from deploy dir: /opt/<app>/frontend/staging|production)
 */

import { createRequire } from 'node:module';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env if present (PORT, PUBLIC_API_URL, etc.)
const envPath = join(__dirname, '.env');
if (existsSync(envPath)) {
  const content = readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eq = trimmed.indexOf('=');
      if (eq > 0) {
        const key = trimmed.slice(0, eq).trim();
        let value = trimmed.slice(eq + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        process.env[key] = value;
      }
    }
  }
}

// Default port for frontend (override via .env or systemd EnvironmentFile)
if (!process.env.PORT) {
  process.env.PORT = '3000';
}

const require = createRequire(import.meta.url);
require('./build/index.js');
