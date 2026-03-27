/**
 * Writes `src/iso4217-minor-digits.generated.ts` from `currency-codes` (ISO 4217–aligned).
 * Run from package root: `pnpm run generate:iso4217`
 */
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(fileURLToPath(import.meta.url));
/** @type {Array<{ code: string; digits: number }>} */
const data = require('currency-codes/data');

const map = Object.create(null);
for (const row of data) {
  if (!row?.code || typeof row.digits !== 'number') continue;
  const c = String(row.code).toUpperCase();
  const d = row.digits;
  if (d !== 0 && d !== 1 && d !== 2 && d !== 3 && d !== 4) {
    console.warn(`Unexpected digits for ${c}: ${d} (skipping)`);
    continue;
  }
  if (map[c] !== undefined && map[c] !== d) {
    console.warn(`Duplicate ${c}: ${map[c]} vs ${d} (keeping first)`);
    continue;
  }
  if (map[c] === undefined) map[c] = d;
}

const keys = Object.keys(map).sort();
const lines = keys.map((k) => `  ${JSON.stringify(k)}: ${map[k]},`);
const outPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'iso4217-minor-digits.generated.ts');
const contents =
  '/**\n' +
  ' * ISO 4217 minor-unit fraction digits per currency code.\n' +
  ' *\n' +
  ' * **AUTO-GENERATED** — do not edit by hand.\n' +
  ' * Source: `currency-codes` data (ISO 4217 list_one–aligned).\n' +
  ' * Regenerate: `pnpm run generate:iso4217` in `@idpxyz/ui-utils`.\n' +
  ' */\n\n' +
  'export const ISO4217_MINOR_DIGITS: Readonly<Record<string, number>> = Object.freeze({\n' +
  `${lines.join('\n')}\n` +
  '});\n';

writeFileSync(outPath, contents, 'utf8');
console.log(`Wrote ${keys.length} currency codes to ${outPath}`);
