'use client';

import * as React from 'react';
import { cn } from '@idpxyz/ui-utils';

import { Input, type InputProps } from './input';

/** Integer vs fractional parsing and display rules. */
export type NumberInputMode = 'int' | 'decimal';

export interface NumberInputProps extends Omit<InputProps, 'type' | 'value' | 'defaultValue' | 'onChange'> {
  /** `null` = empty / cleared. */
  value: number | null;
  onValueChange: (value: number | null) => void;
  /** `int` — `parseInt` semantics, display without fraction; `decimal` — `parseFloat`. Default `decimal`. */
  mode?: NumberInputMode;
  /** Inclusive minimum after commit. */
  min?: number;
  /** Inclusive maximum after commit. */
  max?: number;
  /**
   * Logical step for optional ↑/↓ nudging. Also passed to native `input` when `nativeSpinner` is true.
   * Defaults: `int` → `1`, `decimal` → `0.01` (only for keyboard; not shown as spinner unless `nativeSpinner`).
   */
  step?: number;
  /**
   * When `mode` is `decimal`, round to this many fractional digits on commit (blur / Enter).
   * Ignored when `mode` is `int`.
   */
  decimalPlaces?: number;
  /**
   * Use `type="number"` (browser stepper where supported). Default `false` — uses `type="text"` + `inputMode`
   * so partial input like `1.` commits reliably (same strategy as {@link MoneyInput}).
   */
  nativeSpinner?: boolean;
}

function clamp(n: number, min?: number, max?: number): number {
  let x = n;
  if (min !== undefined && x < min) x = min;
  if (max !== undefined && x > max) x = max;
  return x;
}

function formatForDisplay(value: number | null, mode: NumberInputMode, decimalPlaces?: number): string {
  if (value === null) return '';
  if (mode === 'int') return String(Math.trunc(value));
  if (decimalPlaces !== undefined && decimalPlaces >= 0) {
    return value.toFixed(decimalPlaces);
  }
  return String(value);
}

function parseDraft(raw: string, mode: NumberInputMode, decimalPlaces?: number): number | null {
  const t = raw.trim().replace(',', '.');
  if (t === '' || t === '-' || t === '.' || t === '-.') return null;
  let n: number;
  if (mode === 'int') {
    n = Number.parseInt(t, 10);
  } else {
    n = Number.parseFloat(t);
    if (decimalPlaces !== undefined && decimalPlaces >= 0) {
      const f = 10 ** decimalPlaces;
      n = Math.round(n * f) / f;
    }
  }
  if (!Number.isFinite(n)) return null;
  return n;
}

function defaultStep(mode: NumberInputMode, stepProp?: number): number {
  if (typeof stepProp === 'number' && stepProp > 0) return stepProp;
  return mode === 'int' ? 1 : 0.01;
}

/**
 * Numeric field with committed `number | null`, integer vs decimal behaviour, optional `min`/`max`, and optional fractional rounding.
 * Commits on **blur** and **Enter**; supports ↑/↓ to nudge by `step`.
 */
const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      value,
      onValueChange,
      mode = 'decimal',
      min,
      max,
      step: stepProp,
      decimalPlaces,
      nativeSpinner = false,
      className,
      disabled,
      readOnly,
      nativeDisabled,
      onBlur,
      onKeyDown,
      ...rest
    },
    ref
  ) => {
    const step = defaultStep(mode, stepProp);
    const [draft, setDraft] = React.useState(() => formatForDisplay(value, mode, decimalPlaces));

    React.useEffect(() => {
      setDraft(formatForDisplay(value, mode, decimalPlaces));
    }, [value, mode, decimalPlaces]);

    const commit = React.useCallback(() => {
      const t = draft.trim();
      if (t === '' || t === '-' || t === '.' || t === '-.') {
        onValueChange(null);
        setDraft('');
        return;
      }
      const parsed = parseDraft(t, mode, mode === 'decimal' ? decimalPlaces : undefined);
      if (parsed === null) {
        setDraft(formatForDisplay(value, mode, decimalPlaces));
        return;
      }
      const out = clamp(parsed, min, max);
      onValueChange(out);
      setDraft(formatForDisplay(out, mode, decimalPlaces));
    }, [draft, mode, decimalPlaces, min, max, onValueChange, value]);

    const nudge = React.useCallback(
      (delta: number) => {
        if (disabled || readOnly) return;
        const fromDraft = parseDraft(draft.trim(), mode, mode === 'decimal' ? decimalPlaces : undefined);
        const base = fromDraft ?? value ?? 0;
        let next = mode === 'int' ? Math.trunc(base) + delta : base + delta;
        next = clamp(next, min, max);
        if (mode === 'int') next = Math.trunc(next);
        else if (decimalPlaces !== undefined && decimalPlaces >= 0) {
          const f = 10 ** decimalPlaces;
          next = Math.round(next * f) / f;
        }
        onValueChange(next);
        setDraft(formatForDisplay(next, mode, decimalPlaces));
      },
      [disabled, readOnly, draft, value, mode, min, max, decimalPlaces, onValueChange]
    );

    const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      if (raw === '') {
        onValueChange(null);
        return;
      }
      const n = Number(raw);
      if (!Number.isFinite(n)) return;
      const out = clamp(mode === 'int' ? Math.trunc(n) : n, min, max);
      onValueChange(out);
    };

    if (nativeSpinner) {
      const htmlStep = stepProp ?? (mode === 'int' ? 1 : 'any');
      return (
        <Input
          ref={ref}
          type="number"
          inputMode={mode === 'int' ? 'numeric' : 'decimal'}
          value={value === null ? '' : value}
          onChange={handleNativeChange}
          min={min}
          max={max}
          step={htmlStep}
          disabled={disabled}
          readOnly={readOnly}
          nativeDisabled={nativeDisabled}
          className={cn('font-mono tabular-nums', className)}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          {...rest}
        />
      );
    }

    return (
      <Input
        ref={ref}
        type="text"
        inputMode={mode === 'int' ? 'numeric' : 'decimal'}
        autoComplete="off"
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
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            nudge(step);
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            nudge(-step);
          }
          onKeyDown?.(e);
        }}
        className={cn('font-mono tabular-nums', className)}
        {...rest}
      />
    );
  }
);
NumberInput.displayName = 'NumberInput';

export { NumberInput };
