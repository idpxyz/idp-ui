#!/usr/bin/env node
/**
 * Scaffolds a new Vite + React workbench app under apps/<name>.
 *
 * Usage (from idp-ui root):
 *   node scripts/create-app.mjs <app-dir-name> [--product loms] [--port 5175] [--deps workspace|registry] [--ui-version x.y.z] [--out-dir <parent-dir>]
 *
 * Examples:
 *   node scripts/create-app.mjs acme-web --product prism --port 5180
 *   node scripts/create-app.mjs acme-web --deps registry
 *   node scripts/create-app.mjs acme-web --deps registry --ui-version 0.1.4
 *   node scripts/create-app.mjs acme-web --deps registry --out-dir /path/to/repo/apps
 *
 * --deps workspace (default): templates/workbench-app — @idpxyz/* as workspace:*
 * --deps registry: templates/workbench-app-registry — @idpxyz/* as ^x.y.z from packages/ui-workspace (or --ui-version)
 *
 * --out-dir: parent folder for the app (default: <idp-ui>/apps). Creates <parent>/<app-dir-name>.
 *   With --deps workspace, --out-dir must resolve to <idp-ui>/apps (pnpm workspace apps/*).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

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

function normalizePath(p) {
  return path.resolve(p);
}

function isSameDirectory(a, b) {
  return normalizePath(a) === normalizePath(b);
}

function readWorkspaceUiVersion() {
  const p = path.join(ROOT, 'packages', 'ui-workspace', 'package.json');
  const raw = fs.readFileSync(p, 'utf8');
  return JSON.parse(raw).version;
}

function parseArgs(argv) {
  const out = { name: null, port: 5175, product: 'loms', deps: 'workspace', uiVersion: null, outDir: null };
  const args = argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--out-dir') {
      out.outDir = args[++i];
      if (!out.outDir) {
        console.error('--out-dir requires a path');
        process.exit(1);
      }
    } else if (a === '--port') {
      out.port = Number(args[++i]);
      if (!Number.isFinite(out.port) || out.port < 1) {
        console.error('Invalid --port');
        process.exit(1);
      }
    } else if (a === '--product') {
      out.product = args[++i];
    } else if (a === '--deps') {
      const v = args[++i];
      if (v !== 'workspace' && v !== 'registry') {
        console.error('--deps must be workspace or registry');
        process.exit(1);
      }
      out.deps = v;
    } else if (a === '--ui-version') {
      out.uiVersion = args[++i];
      if (!out.uiVersion || !/^\d+\.\d+\.\d+$/.test(out.uiVersion)) {
        console.error('--ui-version must be semver x.y.z');
        process.exit(1);
      }
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
  const { name, port, product, deps, uiVersion, outDir: outDirOpt } = parseArgs(process.argv);
  validateName(name);

  if (!VALID_PRODUCTS.has(product)) {
    console.error(`Unknown --product "${product}". Valid: ${[...VALID_PRODUCTS].join(', ')}`);
    process.exit(1);
  }

  const templateDir = deps === 'registry' ? 'workbench-app-registry' : 'workbench-app';
  const TEMPLATE = path.join(ROOT, 'templates', templateDir);
  const defaultAppsParent = path.join(ROOT, 'apps');
  const outDirParent = outDirOpt ? path.resolve(process.cwd(), outDirOpt) : defaultAppsParent;

  if (deps === 'workspace' && !isSameDirectory(outDirParent, defaultAppsParent)) {
    console.error(
      '--deps workspace only supports apps under the idp-ui monorepo apps/ folder. Omit --out-dir or set it to <idp-ui>/apps. Use --deps registry for other --out-dir.',
    );
    process.exit(1);
  }

  const target = path.join(outDirParent, name);

  if (fs.existsSync(target)) {
    console.error(`Target already exists: ${target}`);
    process.exit(1);
  }

  if (!fs.existsSync(TEMPLATE)) {
    console.error(`Template missing: ${TEMPLATE}`);
    process.exit(1);
  }

  fs.mkdirSync(outDirParent, { recursive: true });

  const packageName = `@idpxyz/${name}`;
  const appTitle = `${toDisplayTitle(name)} Workbench`;
  const ver = uiVersion ?? readWorkspaceUiVersion();
  const uiPkgRange = `^${ver}`;

  const map = {
    __PACKAGE_NAME__: packageName,
    __APP_DIR__: name,
    __APP_TITLE__: appTitle,
    __PRODUCT_KEY__: product,
    __DEV_PORT__: String(port),
    __STORYBOOK_TITLE__: toStorybookTitle(name),
    __UI_PKG_RANGE__: uiPkgRange,
  };

  fs.cpSync(TEMPLATE, target, { recursive: true });
  walkReplaceFiles(target, map);

  console.log(`Created ${target}`);
  console.log(`  package: ${packageName}`);
  console.log(`  product: ${product}`);
  console.log(`  dev port: ${port}`);
  console.log(`  template: ${templateDir}`);
  console.log(`  deps: ${deps === 'registry' ? `registry (${uiPkgRange} @idpxyz/*)` : 'workspace (workspace:*)'}`);
  console.log('');

  const installInMonorepoRoot = isSameDirectory(outDirParent, defaultAppsParent);

  if (installInMonorepoRoot) {
    console.log('Next: pnpm install (idp-ui root)');
    console.log(`Then:  pnpm --filter ${packageName} dev`);
  } else {
    console.log(`Next: cd ${target} && pnpm install`);
    console.log(`Then:  pnpm dev`);
  }
  if (deps === 'registry') {
    console.log('');
    console.log('Registry template: ensure GitHub Packages auth in ~/.npmrc (//npm.pkg.github.com/:_authToken=…).');
    console.log(`See ${path.join(target, 'README.md')}`);
  }

  if (process.env.CREATE_APP_SKIP_INSTALL === '1') {
    return;
  }
  try {
    if (installInMonorepoRoot) {
      execSync('pnpm install --no-frozen-lockfile', { cwd: ROOT, stdio: 'inherit' });
    } else {
      execSync('pnpm install', { cwd: target, stdio: 'inherit' });
    }
  } catch {
    if (installInMonorepoRoot) {
      console.warn('pnpm install failed or pnpm not available — run: pnpm install --no-frozen-lockfile');
    } else {
      console.warn(`pnpm install failed or pnpm not available — run: cd ${target} && pnpm install`);
    }
  }
}

main();
