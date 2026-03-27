import * as React from 'react';
import { cn, type FormatMoneyMinorOptions, formatMoneyMinor } from '@idpxyz/ui-utils';

export interface MoneyTextProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Smallest currency unit; `null` renders `empty`. */
  valueMinor: number | null;
  /** ISO 4217, e.g. `USD`. */
  currency: string;
  /**
   * **BCP 47** language tag ([RFC 5646](https://www.rfc-editor.org/rfc/rfc5646)), e.g. `en-US`, `de-DE`.
   * Passed to `Intl.NumberFormat`; language/region subtags follow ISO 639 / ISO 3166 conventions inside the tag.
   */
  locale?: string;
  /** Extra `Intl` options (`notation`, `currencySign`, `signDisplay`, …). */
  formatOptions?: FormatMoneyMinorOptions;
  /** When `valueMinor === null`. */
  empty?: React.ReactNode;
}

/**
 * Read-only money line for tables and detail views. Uses {@link formatMoneyMinor}.
 * Native `title` defaults to `"{minor} {CUR} (minor)"` for debugging / support (override with `title=""` to clear).
 */
function MoneyText({
  valueMinor,
  currency,
  locale,
  formatOptions,
  empty = '—',
  className,
  title,
  ...rest
}: MoneyTextProps) {
  const code = currency.trim().toUpperCase();

  if (valueMinor === null) {
    return (
      <span className={cn('tabular-nums text-idpxyz-textMuted', className)} {...rest}>
        {empty}
      </span>
    );
  }

  let formatted: string;
  try {
    formatted = formatMoneyMinor(valueMinor, code, locale, formatOptions);
  } catch {
    formatted = '—';
  }

  const defaultTitle = `${valueMinor} ${code} (minor)`;
  const titleAttr = title === undefined ? defaultTitle : title;

  return (
    <span className={cn('tabular-nums text-idpxyz-text', className)} title={titleAttr} {...rest}>
      {formatted}
    </span>
  );
}

MoneyText.displayName = 'MoneyText';

export { MoneyText };
