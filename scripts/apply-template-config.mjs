#!/usr/bin/env node
/**
 * Apply template.config.yaml to the repo: replace all __TEMPLATE_*__ placeholders
 * in package.json, frontend, docs, systemd, and CI/CD workflow files.
 *
 * Usage: node scripts/apply-template-config.mjs [path-to-config]
 *        Default config path: template.config.yaml (falls back to template.config.example.yaml)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

function loadConfig(configPath) {
  const p = path.isAbsolute(configPath) ? configPath : path.join(rootDir, configPath);
  if (!fs.existsSync(p)) {
    if (configPath === 'template.config.yaml') {
      const example = path.join(rootDir, 'template.config.example.yaml');
      if (fs.existsSync(example)) {
        console.warn('template.config.yaml not found; using template.config.example.yaml');
        return yaml.parse(fs.readFileSync(example, 'utf8'));
      }
    }
    throw new Error(`Config file not found: ${p}`);
  }
  return yaml.parse(fs.readFileSync(p, 'utf8'));
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function buildReplacements(config) {
  const app = config.app || {};
  const seo = config.seo || {};
  const branding = config.branding || {};
  const repo = config.repo || {};
  const deployment = config.deployment || {};
  const urls = config.urls || {};

  const nameSlug = app.nameSlug || slugify(app.name || 'app');
  const nameShort = app.nameShort || app.name || 'App';
  const keywordsStr = typeof seo.keywords === 'string' ? seo.keywords : (seo.keywords || []).join(', ');
  const keywordsArray = keywordsStr
    ? JSON.stringify(keywordsStr.split(',').map((s) => s.trim()).filter(Boolean))
    : '["monorepo","template","sveltekit","rust","docusaurus"]';

  return {
    __TEMPLATE_APP_NAME__: app.name || 'Solo Monorepo Template',
    __TEMPLATE_APP_NAME_SHORT__: nameShort,
    __TEMPLATE_APP_DESCRIPTION__: app.description || 'A production-ready monorepo template for solo projects',
    __TEMPLATE_APP_NAME_SLUG__: nameSlug,
    __TEMPLATE_SEO_TITLE__: seo.title || app.name || 'Solo Monorepo Template',
    __TEMPLATE_SEO_DESCRIPTION__: seo.description || app.description || 'A production-ready monorepo template for solo projects',
    __TEMPLATE_SEO_KEYWORDS__: keywordsStr || 'monorepo, template, sveltekit, rust, docusaurus',
    __KEYWORDS_ARRAY_FOR_PACKAGE_JSON__: keywordsArray,
    __TEMPLATE_FAVICON__: seo.favicon || '/favicon.ico',
    __TEMPLATE_OG_IMAGE__: seo.ogImage || '/og-image.png',
    __TEMPLATE_LOGO_PATH__: branding.logoPath || '/logo.svg',
    __TEMPLATE_LOGO_ALT__: branding.logoAlt || nameShort + ' Logo',
    __TEMPLATE_REPO_ORG__: repo.organization || 'your-org',
    __TEMPLATE_REPO_NAME__: repo.name || nameSlug,
    __TEMPLATE_DEPLOY_APP_NAME__: deployment.appName || 'app',
    __TEMPLATE_SYSTEMD_BACKEND_STAGING__: deployment.backendStagingService || 'backend-staging',
    __TEMPLATE_SYSTEMD_BACKEND_PRODUCTION__: deployment.backendProductionService || 'backend-production',
    __TEMPLATE_SYSTEMD_FRONTEND_STAGING__: deployment.frontendStagingService || 'frontend-staging',
    __TEMPLATE_SYSTEMD_FRONTEND_PRODUCTION__: deployment.frontendProductionService || 'frontend-production',
    __TEMPLATE_DOCS_URL__: urls.docs || 'https://your-docs-site.com',
    __TEMPLATE_APP_URL__: urls.app || 'https://your-app.com',
  };
}

const FILES = [
  'package.json',
  'apps/frontend/src/routes/+page.svelte',
  'apps/frontend/src/routes/+page.ts',
  'apps/docs/docusaurus.config.ts',
  'infra/systemd/README.md',
  'infra/systemd/backend-staging.service.example',
  'infra/systemd/backend-production.service.example',
  'infra/systemd/frontend-staging.service.example',
  'infra/systemd/frontend-production.service.example',
  '.github/workflows/backend.yml',
  '.github/workflows/frontend.yml',
];

function applyToFile(filePath, replacements) {
  const fullPath = path.join(rootDir, filePath);
  if (!fs.existsSync(fullPath)) {
    console.warn(`Skip (not found): ${filePath}`);
    return;
  }
  let content = fs.readFileSync(fullPath, 'utf8');
  let changed = false;
  for (const [placeholder, value] of Object.entries(replacements)) {
    if (placeholder === '__KEYWORDS_ARRAY_FOR_PACKAGE_JSON__') continue;
    if (content.includes(placeholder)) {
      content = content.split(placeholder).join(value);
      changed = true;
    }
  }
  // package.json: replace keywords array placeholder with actual array (valid JSON)
  if (filePath === 'package.json' && replacements.__KEYWORDS_ARRAY_FOR_PACKAGE_JSON__) {
    const before = content;
    content = content.replace(
      /"keywords":\s*\[[^\]]*\]/,
      `"keywords": ${replacements.__KEYWORDS_ARRAY_FOR_PACKAGE_JSON__}`
    );
    if (content !== before) changed = true;
  }
  if (changed) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function main() {
  const configPath = process.argv[2] || 'template.config.yaml';
  const config = loadConfig(configPath);
  const replacements = buildReplacements(config);
  console.log('Applying template config from', configPath);
  for (const file of FILES) {
    applyToFile(file, replacements);
  }
  console.log('Done.');
}

main();
