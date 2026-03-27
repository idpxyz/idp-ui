import * as React from 'react';
import type { FormatMoneyMinorOptions } from '@idpxyz/ui-utils';
import { cn } from '@idpxyz/ui-utils';
import { MoneyText } from '@idpxyz/ui-primitives';

export interface MoneyRangeTextProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  minMinor: number | null;
  maxMinor: number | null;
  /** ISO 4217; both ends use the same code (typical for a freight band). */
  currency: string;
  /** BCP 47 tag for `Intl`. */
  locale?: string;
  formatOptions?: FormatMoneyMinorOptions;
  /** When one bound is `null`, that side shows this (default `—`). */
  empty?: React.ReactNode;
  /** Visual between min and max (default en dash). */
  separator?: React.ReactNode;
}

/**
 * Read-only **min–max** money line (same currency). For quotes / rate bands where both ends share one ISO code.
 */
function MoneyRangeText({
  minMinor,
  maxMinor,
  currency,
  locale,
  formatOptions,
  empty = '—',
  separator,
  className,
  ...rest
}: MoneyRangeTextProps) {
  const sep = separator ?? <span className="text-idpxyz-textMuted">–</span>;

  return (
    <span
      role="group"
      className={cn('inline-flex flex-wrap items-center gap-x-1 gap-y-0.5 tabular-nums text-idpxyz-text', className)}
      {...rest}
    >
      <MoneyText
        valueMinor={minMinor}
        currency={currency}
        locale={locale}
        formatOptions={formatOptions}
        empty={empty}
        className="inline"
      />
      {sep}
      <MoneyText
        valueMinor={maxMinor}
        currency={currency}
        locale={locale}
        formatOptions={formatOptions}
        empty={empty}
        className="inline"
      />
    </span>
  );
}

MoneyRangeText.displayName = 'MoneyRangeText';

export { MoneyRangeText };
