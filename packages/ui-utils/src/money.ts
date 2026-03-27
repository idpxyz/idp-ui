import { ISO4217_MINOR_DIGITS } from './iso4217-minor-digits.generated';

/**
 * First code point (digit 0) of Unicode decimal digit ranges (BMP). ASCII excluded; fullwidth handled separately.
 */
const UNICODE_DIGIT_0: readonly number[] = [
  0x0660, 0x06f0, 0x0966, 0x09e6, 0x0a66, 0x0ae6, 0x0b66, 0x0be6, 0x0c66, 0x0ce6, 0x0d66, 0x0e50, 0x0ed0, 0x1040, 0x17e0,
  0x1810, 0x1946, 0x19d0, 0x1a80, 0x1a90, 0xa8d0, 0xa900, 0xa9d0, 0xa9f0, 0xaa50, 0xabf0,
];

function unicodeDigitToAscii(ch: string): string | null {
  const c = ch.codePointAt(0);
  if (c === undefined) return null;
  if (c >= 0x30 && c <= 0x39) return ch;
  if (c >= 0xff10 && c <= 0xff19) return String(c - 0xff10);
  for (const d0 of UNICODE_DIGIT_0) {
    if (c >= d0 && c <= d0 + 9) return String(c - d0);
  }
  return null;
}

/**
 * Replace common Unicode numeral shapes with ASCII `0`–`9` so parsing matches Latin input.
 * Arabic decimal ٫ (U+066B) → `.`, thousands ٬ (U+066C) omitted (drop).
 */
export function normalizeMoneyNumerals(raw: string): string {
  let out = '';
  for (const ch of raw) {
    if (ch === '\u066b') {
      out += '.';
      continue;
    }
    if (ch === '\u066c') continue;
    const d = unicodeDigitToAscii(ch);
    out += d ?? ch;
  }
  return out;
}

/**
 * Minor decimal places for `currency` (ISO 4217 alphabetic code).
 * Uses the generated {@link ISO4217_MINOR_DIGITS} table; **unknown / non-ISO codes fall back to `2`** (stable default for custom assets).
 */
export function currencyMinorDigits(currency: string): number {
  const c = currency.trim().toUpperCase();
  return ISO4217_MINOR_DIGITS[c] ?? 2;
}

function assertIntegerMinor(n: number): void {
  if (!Number.isFinite(n) || !Number.isInteger(n)) {
    throw new RangeError('amountMinor must be a finite integer (smallest currency unit)');
  }
}

/** Optional `Intl.NumberFormat` fields for {@link formatMoneyMinor} / display. */
export type FormatMoneyMinorOptions = Pick<
  Intl.NumberFormatOptions,
  | 'currencyDisplay'
  | 'currencySign'
  | 'signDisplay'
  | 'notation'
  | 'compactDisplay'
  | 'minimumFractionDigits'
  | 'maximumFractionDigits'
>;

function mergeFormatOptions(
  currency: string,
  formatOptions?: FormatMoneyMinorOptions
): Intl.NumberFormatOptions {
  const base: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: currency.toUpperCase(),
  };
  if (!formatOptions) return base;
  const o = formatOptions;
  return {
    ...base,
    ...(o.currencyDisplay !== undefined && { currencyDisplay: o.currencyDisplay }),
    ...(o.currencySign !== undefined && { currencySign: o.currencySign }),
    ...(o.signDisplay !== undefined && { signDisplay: o.signDisplay }),
    ...(o.notation !== undefined && { notation: o.notation }),
    ...(o.compactDisplay !== undefined && { compactDisplay: o.compactDisplay }),
    ...(o.minimumFractionDigits !== undefined && { minimumFractionDigits: o.minimumFractionDigits }),
    ...(o.maximumFractionDigits !== undefined && { maximumFractionDigits: o.maximumFractionDigits }),
  };
}

/** Decimal separator for `locale` (e.g. `.` for `en-US`, `,` for `de-DE`). */
export function getDecimalSeparator(locale?: string): string {
  const parts = new Intl.NumberFormat(locale, { useGrouping: false, maximumFractionDigits: 1 }).formatToParts(1.1);
  const dec = parts.find((p) => p.type === 'decimal');
  return dec?.value ?? '.';
}

/**
 * Localized currency glyph for compact prefixes (`$`, `€`, `¥`, …) via `Intl.NumberFormat` `formatToParts`.
 * Falls back to the ISO code when formatting fails.
 */
export function getCurrencySymbol(
  currency: string,
  locale?: string,
  currencyDisplay: 'narrowSymbol' | 'symbol' | 'code' | 'name' = 'narrowSymbol'
): string {
  const code = currency.trim().toUpperCase();
  try {
    const parts = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: code,
      currencyDisplay,
    }).formatToParts(0);
    return parts.find((p) => p.type === 'currency')?.value ?? code;
  } catch {
    return code;
  }
}

/**
 * Normalizes a typed amount to a string using `.` as the **only** decimal separator for downstream parsing.
 * Handles `en-US`–style `1,234.56` and `de-DE`–style `1.234,56` when `locale` implies `,` as decimal.
 */
export function normalizeMoneyDecimalInput(raw: string, locale?: string): string {
  const trimmed = raw.trim().replace(/\s+/g, '');
  if (trimmed === '') return '';
  const dec = getDecimalSeparator(locale);

  if (dec === ',') {
    if (!trimmed.includes(',')) {
      const lastDot = trimmed.lastIndexOf('.');
      if (lastDot >= 0) {
        return trimmed.slice(0, lastDot).replace(/,/g, '') + '.' + trimmed.slice(lastDot + 1);
      }
      return trimmed.replace(/,/g, '');
    }
    const lastComma = trimmed.lastIndexOf(',');
    const intPart = trimmed.slice(0, lastComma).replace(/\./g, '');
    const fracPart = trimmed.slice(lastComma + 1);
    return (intPart === '' ? '0' : intPart) + '.' + fracPart;
  }

  const lastDot = trimmed.lastIndexOf('.');
  if (lastDot >= 0) {
    return trimmed.slice(0, lastDot).replace(/,/g, '') + '.' + trimmed.slice(lastDot + 1);
  }
  return trimmed.replace(/,/g, '');
}

/** Example placeholder for `MoneyInput`, e.g. `0,00` (de) or `0.00` (en) when currency has 2 fraction digits. */
export function moneyExamplePlaceholder(currency: string, locale?: string): string {
  const digits = currencyMinorDigits(currency);
  const sep = getDecimalSeparator(locale);
  if (digits === 0) return '0';
  return `0${sep}${'0'.repeat(digits)}`;
}

/**
 * Format a **minor-unit** amount (e.g. cents) with `Intl.NumberFormat` (`style: 'currency'`).
 * Store and transmit money as integers in minor units; use this for display only.
 */
export function formatMoneyMinor(
  amountMinor: number,
  currency: string,
  locale?: string,
  formatOptions?: FormatMoneyMinorOptions
): string {
  assertIntegerMinor(amountMinor);
  const digits = currencyMinorDigits(currency);
  const major = amountMinor / 10 ** digits;
  return new Intl.NumberFormat(locale, mergeFormatOptions(currency, formatOptions)).format(major);
}

/**
 * Plain numeric string for editing (no currency symbol).
 * Optional `locale` chooses the decimal separator (`12,34` vs `12.34`).
 */
export function minorToEditString(amountMinor: number, currency: string, locale?: string): string {
  assertIntegerMinor(amountMinor);
  const digits = currencyMinorDigits(currency);
  const neg = amountMinor < 0;
  const abs = Math.abs(amountMinor);
  const sep = getDecimalSeparator(locale);
  if (digits === 0) {
    return String(neg ? -abs : abs);
  }
  const whole = Math.floor(abs / 10 ** digits);
  const frac = abs % 10 ** digits;
  const fracStr = String(frac).padStart(digits, '0');
  return `${neg ? '-' : ''}${whole}${sep}${fracStr}`;
}

/**
 * Unsigned decimal string (`.` as only decimal sep) → minor units: **round half up** on the magnitude.
 * Combined with a leading `-` in {@link parseEditStringToMinor}, this matches **half away from zero** on the
 * signed monetary value in minor units (typical financial expectation for negatives).
 */
function parseUnsignedNormalizedToMinor(unsignedNormalized: string, digits: number): number | null {
  let s = unsignedNormalized.trim();
  if (s.startsWith('.')) s = `0${s}`;
  if (s === '' || s === '.') return null;

  const dot = s.indexOf('.');
  const intPart = dot >= 0 ? s.slice(0, dot) : s;
  const fracRaw = dot >= 0 ? s.slice(dot + 1) : '';

  if (intPart === '' && fracRaw === '') return null;
  if (!/^\d*$/.test(intPart) || !/^\d*$/.test(fracRaw)) return null;

  const bigIntDigits = (s: string): bigint => {
    const t = s.replace(/^0+(?!$)/, '');
    if (t === '') return 0n;
    return BigInt(t);
  };

  const scale = fracRaw.length;
  let num: bigint;
  try {
    const intVal = intPart === '' ? 0n : bigIntDigits(intPart);
    const fracVal = fracRaw === '' ? 0n : bigIntDigits(fracRaw);
    num = intVal * 10n ** BigInt(scale) + fracVal;
  } catch {
    return null;
  }

  if (digits < 0 || digits > 20) return null;

  const powD = 10n ** BigInt(digits);
  const powS = 10n ** BigInt(scale);
  const numerator = num * powD;
  const half = powS / 2n;
  const minorBig = (numerator + half) / powS;

  if (minorBig > BigInt(Number.MAX_SAFE_INTEGER)) return null;
  return Number(minorBig);
}

/**
 * Parse user input into minor units. Uses `locale` for thousand/decimal grouping (`1.234,56` vs `1,234.56`).
 * Overlong fractional parts are rounded **half away from zero** in minor units (same as rounding the absolute
 * value with **half up**, then applying `-` when present).
 * Unicode numerals are normalized via {@link normalizeMoneyNumerals} before parsing.
 * Returns `null` if empty/invalid.
 */
export function parseEditStringToMinor(input: string, currency: string, locale?: string): number | null {
  const trimmed = input.trim();
  if (trimmed === '') return null;

  const sign = trimmed.startsWith('-') ? -1 : 1;
  let unsignedRaw = trimmed.replace(/^[-+]/, '').trim();
  if (unsignedRaw === '') return null;

  unsignedRaw = normalizeMoneyNumerals(unsignedRaw);
  const normalized = normalizeMoneyDecimalInput(unsignedRaw, locale);
  if (normalized === '') return null;

  if ((normalized.match(/\./g) ?? []).length > 1) return null;

  const digits = currencyMinorDigits(currency);
  const unsignedMinor = parseUnsignedNormalizedToMinor(normalized, digits);
  if (unsignedMinor === null) return null;

  const minor = sign * unsignedMinor;
  if (!Number.isSafeInteger(minor)) return null;
  return minor;
}
