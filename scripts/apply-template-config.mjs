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
    __TEMPLATE_FRONTEND_STAGING_SERVICE_FILE__: deployment.frontendStagingServiceFile || `${nameSlug}-frontend-staging.service`,
    __TEMPLATE_FRONTEND_PRODUCTION_SERVICE_FILE__: deployment.frontendProductionServiceFile || `${nameSlug}-frontend-production.service`,
    __TEMPLATE_BACKEND_STAGING_SERVICE_FILE__: deployment.backendStagingServiceFile || `${nameSlug}-backend-staging.service`,
    __TEMPLATE_BACKEND_PRODUCTION_SERVICE_FILE__: deployment.backendProductionServiceFile || `${nameSlug}-backend-production.service`,
    __TEMPLATE_FRONTEND_STAGING_PORT__: String(deployment.frontendStagingPort || 6200),
    __TEMPLATE_FRONTEND_PRODUCTION_PORT__: String(deployment.frontendProductionPort || 6400),
    __TEMPLATE_BACKEND_STAGING_PORT__: String(deployment.backendStagingPort || 6100),
    __TEMPLATE_BACKEND_PRODUCTION_PORT__: String(deployment.backendProductionPort || 6300),
    __TEMPLATE_DATABASE_NAME__: deployment.databaseName || 'app_db',
    __TEMPLATE_DATABASE_TEST_NAME__: deployment.databaseTestName || 'app_db_test',
    __TEMPLATE_DOCS_URL__: urls.docs || 'https://your-docs-site.com',
    __TEMPLATE_APP_URL__: urls.app || 'https://your-app.com',
  };
}

const FILES = [
  'package.json',
  'README.md',
  'apps/frontend/src/routes/+page.svelte',
  'apps/frontend/src/routes/+page.ts',
  'apps/docs/docusaurus.config.ts',
  'apps/backend/src/main.rs',
  'infra/compose.yml',
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

/** Create systemd service files from .example templates (with replacements applied). */
function createSystemdServiceFiles(replacements) {
  const systemdDir = path.join(rootDir, 'infra/systemd');
  if (!fs.existsSync(systemdDir)) {
    console.warn('Skip creating systemd files: infra/systemd not found');
    return;
  }

  const mappings = [
    { example: 'frontend-staging.service.example', outputKey: '__TEMPLATE_FRONTEND_STAGING_SERVICE_FILE__' },
    { example: 'frontend-production.service.example', outputKey: '__TEMPLATE_FRONTEND_PRODUCTION_SERVICE_FILE__' },
    { example: 'backend-staging.service.example', outputKey: '__TEMPLATE_BACKEND_STAGING_SERVICE_FILE__' },
    { example: 'backend-production.service.example', outputKey: '__TEMPLATE_BACKEND_PRODUCTION_SERVICE_FILE__' },
  ];

  for (const { example, outputKey } of mappings) {
    const examplePath = path.join(systemdDir, example);
    const outputFileName = replacements[outputKey];
    if (!outputFileName) continue;
    if (!fs.existsSync(examplePath)) {
      console.warn(`Skip (not found): ${example}`);
      continue;
    }
    let content = fs.readFileSync(examplePath, 'utf8');
    for (const [placeholder, value] of Object.entries(replacements)) {
      if (placeholder === '__KEYWORDS_ARRAY_FOR_PACKAGE_JSON__') continue;
      if (content.includes(placeholder)) {
        content = content.split(placeholder).join(value);
      }
    }
    const outputPath = path.join(systemdDir, outputFileName);
    fs.writeFileSync(outputPath, content, 'utf8');
    console.log(`Created: infra/systemd/${outputFileName}`);
  }
}

/**
 * Create env files from .example templates (with replacements applied).
 * Writes to envs/<name>.env (no .example suffix) so you can fill in secrets and use with `cgs`.
 */
function createEnvFiles(replacements) {
  const envsDir = path.join(rootDir, 'envs');
  if (!fs.existsSync(envsDir)) {
    console.warn('Skip creating env files: envs directory not found');
    return;
  }

  const mappings = [
    { example: 'env.env.example', output: 'env.env' },
    { example: 'staging.env.example', output: 'staging.env' },
    { example: 'prod.env.example', output: 'prod.env' },
  ];

  for (const { example, output } of mappings) {
    const examplePath = path.join(envsDir, example);
    if (!fs.existsSync(examplePath)) {
      console.warn(`Skip (not found): envs/${example}`);
      continue;
    }
    let content = fs.readFileSync(examplePath, 'utf8');
    for (const [placeholder, value] of Object.entries(replacements)) {
      if (placeholder === '__KEYWORDS_ARRAY_FOR_PACKAGE_JSON__') continue;
      if (content.includes(placeholder)) {
        content = content.split(placeholder).join(value);
      }
    }
    const outputPath = path.join(envsDir, output);
    fs.writeFileSync(outputPath, content, 'utf8');
    console.log(`Created: envs/${output}`);
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
  createSystemdServiceFiles(replacements);
  createEnvFiles(replacements);
  console.log('Done.');
  console.log('');
  console.log('Next: fill in secrets in envs/env.env, envs/staging.env, envs/prod.env then run (from envs/):');
  console.log('  cd envs');
  console.log('  cgs env.env                                    # create repo secrets from env.env');
  console.log('  cgs staging.env                                # create staging environment + secrets from staging.env');
  console.log('  cgs prod.env env production                     # create production environment + secrets from prod.env');
}

main();
