#!/usr/bin/env node
/**
 * Scaffolds a new Vite + React workbench app under apps/<name> from templates/workbench-app.
 *
 * Usage (from idp-ui root):
 *   node scripts/create-app.mjs <app-dir-name> [--product loms] [--port 5175]
 *
 * Example:
 *   node scripts/create-app.mjs acme-web --product prism --port 5180
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const TEMPLATE = path.join(ROOT, 'templates', 'workbench-app');

const VALID_PRODUCTS = new Set([
  'loms',
  'oms',
  'prism',
  'gatekeeper',
  'rulemesh',
  'ledgermesh',
  'phi',
  'sagapai',
]);

function parseArgs(argv) {
  const out = { name: null, port: 5175, product: 'loms' };
  const args = argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--port') {
      out.port = Number(args[++i]);
      if (!Number.isFinite(out.port) || out.port < 1) {
        console.error('Invalid --port');
        process.exit(1);
      }
    } else if (a === '--product') {
      out.product = args[++i];
    } else if (!a.startsWith('-') && !out.name) {
      out.name = a;
    }
  }
  return out;
}

function validateName(name) {
  if (!name || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) {
    console.error('App name must be kebab-case, e.g. acme-web or ops-console');
    process.exit(1);
  }
}

function toDisplayTitle(name) {
  return name
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function toStorybookTitle(name) {
  const parts = name.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1));
  return `Apps/${parts.join('')}`;
}

function replaceInString(s, map) {
  let out = s;
  for (const [k, v] of Object.entries(map)) {
    out = out.split(k).join(v);
  }
  return out;
}

function walkReplaceFiles(dir, map) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      walkReplaceFiles(full, map);
    } else if (e.isFile()) {
      const raw = fs.readFileSync(full, 'utf8');
      const next = replaceInString(raw, map);
      if (next !== raw) {
        fs.writeFileSync(full, next, 'utf8');
      }
    }
  }
}

function main() {
  const { name, port, product } = parseArgs(process.argv);
  validateName(name);

  if (!VALID_PRODUCTS.has(product)) {
    console.error(`Unknown --product "${product}". Valid: ${[...VALID_PRODUCTS].join(', ')}`);
    process.exit(1);
  }

  const target = path.join(ROOT, 'apps', name);
  if (fs.existsSync(target)) {
    console.error(`Target already exists: ${target}`);
    process.exit(1);
  }

  if (!fs.existsSync(TEMPLATE)) {
    console.error(`Template missing: ${TEMPLATE}`);
    process.exit(1);
  }

  const packageName = `@idpxyz/${name}`;
  const appTitle = `${toDisplayTitle(name)} Workbench`;
  const map = {
    __PACKAGE_NAME__: packageName,
    __APP_DIR__: name,
    __APP_TITLE__: appTitle,
    __PRODUCT_KEY__: product,
    __DEV_PORT__: String(port),
    __STORYBOOK_TITLE__: toStorybookTitle(name),
  };

  fs.cpSync(TEMPLATE, target, { recursive: true });
  walkReplaceFiles(target, map);

  console.log(`Created ${target}`);
  console.log(`  package: ${packageName}`);
  console.log(`  product: ${product}`);
  console.log(`  dev port: ${port}`);
  console.log('');
  console.log('Next: pnpm install');
  console.log(`Then:  pnpm --filter ${packageName} dev`);

  if (process.env.CREATE_APP_SKIP_INSTALL === '1') {
    return;
  }
  try {
    execSync('pnpm install --no-frozen-lockfile', { cwd: ROOT, stdio: 'inherit' });
  } catch {
    console.warn('pnpm install failed or pnpm not available — run: pnpm install --no-frozen-lockfile');
  }
}

main();
