import { describe, expect, it } from 'vitest';
import {
  currencyMinorDigits,
  formatMoneyMinor,
  parseEditStringToMinor,
  minorToEditString,
  normalizeMoneyNumerals,
  getCurrencySymbol,
} from './money';

describe('currencyMinorDigits', () => {
  it('returns 2 for USD', () => expect(currencyMinorDigits('USD')).toBe(2));
  it('returns 0 for JPY', () => expect(currencyMinorDigits('JPY')).toBe(0));
  it('returns 3 for BHD', () => expect(currencyMinorDigits('BHD')).toBe(3));
  it('returns 2 for unknown', () => expect(currencyMinorDigits('XYZ')).toBe(2));
  it('is case-insensitive', () => expect(currencyMinorDigits('usd')).toBe(2));
});

describe('formatMoneyMinor', () => {
  it('formats USD cents', () => {
    const result = formatMoneyMinor(799, 'USD', 'en-US');
    expect(result).toContain('7');
    expect(result).toContain('99');
  });

  it('formats JPY (no decimals)', () => {
    const result = formatMoneyMinor(799, 'JPY', 'en-US');
    expect(result).toContain('799');
  });

  it('formats negative amounts', () => {
    const result = formatMoneyMinor(-150, 'USD', 'en-US');
    expect(result).toContain('1');
    expect(result).toContain('50');
  });
});

describe('parseEditStringToMinor', () => {
  it('parses USD string', () => {
    expect(parseEditStringToMinor('7.99', 'USD')).toBe(799);
  });

  it('parses integer for JPY', () => {
    expect(parseEditStringToMinor('799', 'JPY')).toBe(799);
  });

  it('returns null for empty', () => {
    expect(parseEditStringToMinor('', 'USD')).toBeNull();
  });

  it('returns null for non-numeric', () => {
    expect(parseEditStringToMinor('abc', 'USD')).toBeNull();
  });
});

describe('minorToEditString', () => {
  it('converts USD minor to edit string', () => {
    expect(minorToEditString(799, 'USD')).toBe('7.99');
  });

  it('converts JPY minor (no decimals)', () => {
    expect(minorToEditString(799, 'JPY')).toBe('799');
  });
});

describe('normalizeMoneyNumerals', () => {
  it('passes through ASCII digits', () => {
    expect(normalizeMoneyNumerals('123.45')).toBe('123.45');
  });

  it('converts fullwidth digits', () => {
    expect(normalizeMoneyNumerals('１２３')).toBe('123');
  });

  it('converts Arabic decimal separator', () => {
    expect(normalizeMoneyNumerals('١٫٥')).toBe('1.5');
  });
});

describe('getCurrencySymbol', () => {
  it('returns $ for USD', () => {
    const symbol = getCurrencySymbol('USD', 'en-US');
    expect(symbol).toBeTruthy();
  });
});
