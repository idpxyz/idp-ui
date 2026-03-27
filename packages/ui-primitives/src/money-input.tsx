'use client';

import * as React from 'react';
import {
  cn,
  getCurrencySymbol,
  minorToEditString,
  moneyExamplePlaceholder,
  parseEditStringToMinor,
} from '@idpxyz/ui-utils';

import { Input, type InputProps } from './input';

export interface MoneyInputProps extends Omit<InputProps, 'type' | 'value' | 'defaultValue' | 'onChange'> {
  /** Amount in smallest currency unit (e.g. cents); `null` = empty. */
  valueMinor: number | null;
  onValueMinorChange: (minor: number | null) => void;
  /** ISO 4217 code, e.g. `USD`, `JPY`. */
  currency: string;
  /**
   * **BCP 47** language tag ([RFC 5646](https://www.rfc-editor.org/rfc/rfc5646)), e.g. `en-US`, `de-DE`, `zh-Hans-CN`.
   * Used for `Intl`/`formatMoneyMinor` parity (separators, symbols); not ISO 4217 (that is `currency`).
   */
  locale?: string;
  /** `true` (default): prefix + amount in one field. `false`: amount only, plain {@link Input}. */
  showCurrencyBadge?: boolean;
  /** What the prefix shows: ISO `code` or localized `symbol` (see {@link getCurrencySymbol}). */
  currencyPrefix?: 'code' | 'symbol';
  /** Passed to `Intl` when `currencyPrefix` is `symbol`. */
  currencySymbolDisplay?: 'narrowSymbol' | 'symbol' | 'code' | 'name';
  /** Inclusive min in minor units after commit (parsed value is clamped). */
  minMinor?: number;
  /** Inclusive max in minor units after commit (parsed value is clamped). */
  maxMinor?: number;
  /** Override default `moneyExamplePlaceholder(currency, locale)`. */
  placeholder?: string;
}

/**
 * Decimal text input backed by **minor-unit** integers. Commits on **blur** and on **Enter**.
 * Pass the same `locale` (BCP 47) as display ({@link formatMoneyMinor}, {@link MoneyText}) so separators match.
 */
const MoneyInput = React.forwardRef<HTMLInputElement, MoneyInputProps>(
  (
    {
      valueMinor,
      onValueMinorChange,
      currency,
      locale,
      showCurrencyBadge = true,
      currencyPrefix = 'code',
      currencySymbolDisplay = 'narrowSymbol',
      minMinor,
      maxMinor,
      placeholder: placeholderProp,
      className,
      onBlur,
      onKeyDown,
      id,
      disabled,
      readOnly,
      nativeDisabled,
      ...rest
    },
    ref
  ) => {
    const code = currency.trim().toUpperCase();
    const prefixLabel =
      currencyPrefix === 'symbol' ? getCurrencySymbol(currency, locale, currencySymbolDisplay) : code;
    const useFacade = Boolean(disabled) && !nativeDisabled;
    const [draft, setDraft] = React.useState(() =>
      valueMinor === null ? '' : minorToEditString(valueMinor, code, locale)
    );

    React.useEffect(() => {
      if (valueMinor === null) setDraft('');
      else setDraft(minorToEditString(valueMinor, code, locale));
    }, [valueMinor, code, locale]);

    const commit = React.useCallback(() => {
      const parsed = parseEditStringToMinor(draft, code, locale);
      if (draft.trim() === '') {
        onValueMinorChange(null);
        setDraft('');
        return;
      }
      if (parsed === null) {
        setDraft(valueMinor === null ? '' : minorToEditString(valueMinor, code, locale));
        return;
      }
      let out = parsed;
      if (minMinor !== undefined && out < minMinor) out = minMinor;
      if (maxMinor !== undefined && out > maxMinor) out = maxMinor;
      onValueMinorChange(out);
      setDraft(minorToEditString(out, code, locale));
    }, [draft, code, locale, minMinor, maxMinor, onValueMinorChange, valueMinor]);

    const inputAriaLabel =
      rest['aria-label'] ??
      (currencyPrefix === 'symbol'
        ? `Amount in ${code}, ${prefixLabel}`
        : `Amount in ${code}`);

    const placeholder = placeholderProp ?? moneyExamplePlaceholder(code, locale);

    const inputShared = (
      <Input
        ref={ref}
        id={id}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        placeholder={placeholder}
        value={draft}
        disabled={disabled}
        readOnly={readOnly}
        nativeDisabled={nativeDisabled}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={(e) => {
          commit();
          onBlur?.(e);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.currentTarget.blur();
          }
          onKeyDown?.(e);
        }}
        className={
          showCurrencyBadge
            ? cn(
                'h-7 min-w-0 flex-1 rounded-none border-0 bg-transparent px-2 font-mono text-[12px] tabular-nums shadow-none',
                'text-idpxyz-text placeholder:text-idpxyz-textMuted',
                'outline-none focus-visible:border-transparent focus-visible:ring-0 focus-visible:shadow-none',
                useFacade && 'cursor-text'
              )
            : cn('min-w-0 font-mono tabular-nums', className)
        }
        aria-label={inputAriaLabel}
        {...rest}
      />
    );

    if (!showCurrencyBadge) {
      return inputShared;
    }

    return (
      <div
        role="group"
        className={cn(
          'flex min-h-7 min-w-0 items-stretch overflow-hidden rounded border border-idpxyz-border bg-idpxyz-inputBg text-[12px] transition-[border-color,background-color,opacity]',
          'focus-within:border-[#4ea8ff] focus-within:ring-0',
          useFacade && 'border-idpxyz-border/40 bg-idpxyz-hover/35',
          Boolean(disabled) &&
            nativeDisabled &&
            'cursor-not-allowed border-idpxyz-border/40 bg-idpxyz-hover/35 opacity-50',
          className
        )}
      >
        <span
          className={cn(
            'flex shrink-0 items-center border-r border-idpxyz-border/50 bg-idpxyz-hover/25 px-2 text-[11px] font-medium tabular-nums text-idpxyz-textMuted select-none',
            currencyPrefix === 'code' && 'uppercase'
          )}
          aria-hidden
        >
          {prefixLabel}
        </span>
        {inputShared}
      </div>
    );
  }
);
MoneyInput.displayName = 'MoneyInput';

export { MoneyInput };
