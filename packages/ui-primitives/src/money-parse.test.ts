import { describe, expect, it } from 'vitest';
import { formatMoneyMinor, normalizeMoneyNumerals, parseEditStringToMinor } from '@idpxyz/ui-utils';

describe('parseEditStringToMinor', () => {
  it('rounds half up when fractional input exceeds minor precision (USD)', () => {
    expect(parseEditStringToMinor('12.345', 'USD', 'en-US')).toBe(1235);
    expect(parseEditStringToMinor('12.344', 'USD', 'en-US')).toBe(1234);
  });

  it('JPY accepts decimal input and rounds to whole yen', () => {
    expect(parseEditStringToMinor('12.7', 'JPY', 'en-US')).toBe(13);
    expect(parseEditStringToMinor('12.4', 'JPY', 'en-US')).toBe(12);
  });

  it('parses after Unicode digit normalization', () => {
    const withArabicIndic = normalizeMoneyNumerals('١٢٫٣٤'); // 12.34
    expect(withArabicIndic).toBe('12.34');
    expect(parseEditStringToMinor(withArabicIndic, 'USD', 'en-US')).toBe(1234);
  });

  it('rounds half away from zero for negative amounts (magnitude half up, then negate)', () => {
    expect(parseEditStringToMinor('-12.345', 'USD', 'en-US')).toBe(-1235);
    expect(parseEditStringToMinor('-12.344', 'USD', 'en-US')).toBe(-1234);
    expect(parseEditStringToMinor('-0.005', 'USD', 'en-US')).toBe(-1);
    expect(parseEditStringToMinor('-12.7', 'JPY', 'en-US')).toBe(-13);
    expect(parseEditStringToMinor('-12.4', 'JPY', 'en-US')).toBe(-12);
  });
});

describe('formatMoneyMinor', () => {
  it('respects optional Intl display options', () => {
    const formatted = formatMoneyMinor(-100, 'USD', 'en-US', { currencySign: 'accounting' });
    expect(formatted).toMatch(/\(/);
  });
});
