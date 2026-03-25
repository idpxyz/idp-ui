import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const APPS_DIR = path.join(ROOT, 'apps');
const PACKAGES_DIR = path.join(ROOT, 'packages');

const CODE_EXT = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);

const violations = [];

function walk(dir, fileList = []) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === 'dist' || e.name === '.turbo' || e.name === '.git') continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      walk(full, fileList);
    } else if (CODE_EXT.has(path.extname(e.name))) {
      fileList.push(full);
    }
  }
  return fileList;
}

function readImports(content) {
  const matches = [];
  const re = /from\s+['"]([^'"]+)['"]|import\s+['"]([^'"]+)['"]/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    matches.push(m[1] || m[2]);
  }
  return matches;
}

function rel(p) {
  return path.relative(ROOT, p).replaceAll('\\', '/');
}

function isInApps(file) {
  return rel(file).startsWith('apps/');
}

function isInPackages(file) {
  return rel(file).startsWith('packages/');
}

function appNameOf(file) {
  const r = rel(file).split('/');
  return r.length > 1 && r[0] === 'apps' ? r[1] : null;
}

function packageNameOf(file) {
  const r = rel(file).split('/');
  return r.length > 1 && r[0] === 'packages' ? r[1] : null;
}

function resolveRelativeImport(fromFile, spec) {
  const base = path.resolve(path.dirname(fromFile), spec);
  const candidates = [
    base,
    `${base}.ts`, `${base}.tsx`, `${base}.js`, `${base}.jsx`,
    path.join(base, 'index.ts'), path.join(base, 'index.tsx'), path.join(base, 'index.js'), path.join(base, 'index.jsx'),
  ];
  for (const c of candidates) {
    try {
      if (statSync(c).isFile()) return c;
    } catch {}
  }
  return null;
}

function checkFile(file) {
  const content = readFileSync(file, 'utf8');
  const imports = readImports(content);

  for (const spec of imports) {
    const currentApp = appNameOf(file);
    const currentPkg = packageNameOf(file);

    if (isInPackages(file)) {
      if (spec.startsWith('@idp/') && spec.includes('-web')) {
        violations.push(`${rel(file)}: packages layer must not import app package (${spec})`);
      }
      if (spec.startsWith('../') || spec.startsWith('./')) {
        const target = resolveRelativeImport(file, spec);
        if (target && rel(target).startsWith('apps/')) {
          violations.push(`${rel(file)}: packages layer must not import from apps (${spec})`);
        }
      }
    }

    if (isInApps(file)) {
      if (spec.startsWith('../') || spec.startsWith('./')) {
        const target = resolveRelativeImport(file, spec);
        if (target && rel(target).startsWith('apps/')) {
          const targetApp = appNameOf(target);
          if (targetApp && targetApp !== currentApp) {
            violations.push(`${rel(file)}: app ${currentApp} must not import app ${targetApp} (${spec})`);
          }
        }
      }
      if (spec.startsWith('@idp/')) {
        const appPackageMap = {
          'loms-web': '@idp/loms-web',
          'myshop-web': '@idp/myshop-web',
        };
        for (const [app, pkgName] of Object.entries(appPackageMap)) {
          if (currentApp !== app && spec === pkgName) {
            violations.push(`${rel(file)}: app ${currentApp} must not import app package ${pkgName}`);
          }
        }
      }
    }

    if (isInPackages(file) && currentPkg === 'ui-workspace') {
      if (/(order|shipment|refund|return|exception|promotion|coupon)/i.test(spec)) {
        violations.push(`${rel(file)}: ui-workspace should not depend on product-domain modules (${spec})`);
      }
    }
  }
}

const appFiles = walk(APPS_DIR);
const packageFiles = walk(PACKAGES_DIR);
for (const f of [...appFiles, ...packageFiles]) checkFile(f);

if (violations.length > 0) {
  console.error('\n[arch-check] Architecture boundary violations found:\n');
  for (const v of violations) console.error(`- ${v}`);
  process.exit(1);
}

console.log('[arch-check] OK: no boundary violations.');
