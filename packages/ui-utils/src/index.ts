import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type { FormatMoneyMinorOptions } from './money';
export { ISO4217_MINOR_DIGITS } from './iso4217-minor-digits.generated';
export {
  currencyMinorDigits,
  formatMoneyMinor,
  getCurrencySymbol,
  getDecimalSeparator,
  minorToEditString,
  moneyExamplePlaceholder,
  normalizeMoneyDecimalInput,
  normalizeMoneyNumerals,
  parseEditStringToMinor,
} from './money';
