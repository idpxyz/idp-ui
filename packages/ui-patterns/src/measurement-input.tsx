'use client';

import * as React from 'react';
import { cn } from '@idpxyz/ui-utils';
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@idpxyz/ui-primitives';

export interface MeasurementUnitOption {
  value: string;
  label: string;
}

export interface MeasurementInputProps {
  /** Numeric amount in the **current** `unit` (parent converts to API base units if needed). */
  amount: number | null;
  unit: string;
  units: readonly MeasurementUnitOption[];
  onChange: (next: { amount: number | null; unit: string }) => void;
  disabled?: boolean;
  /** Shown when `amount === null`. */
  placeholder?: string;
  /** `weight` → decimal-friendly; `length` same. */
  kind?: 'weight' | 'length';
  className?: string;
  id?: string;
  'aria-label'?: string;
}

function parseAmount(raw: string): number | null {
  const t = raw.trim().replace(/\s+/g, '');
  if (t === '') return null;
  const n = Number(t.replace(',', '.'));
  if (!Number.isFinite(n)) return null;
  return n;
}

function formatAmount(n: number | null): string {
  if (n === null) return '';
  return String(n);
}

/**
 * **Amount + unit** on one row (weight or dimensions). Units are **injected** (`kg` / `lb` / `cm` / …).
 * Conversion to canonical storage (e.g. grams) stays in application code.
 */
function MeasurementInput({
  amount,
  unit,
  units,
  onChange,
  disabled,
  placeholder = '0',
  kind = 'weight',
  className,
  id,
  'aria-label': ariaLabel,
}: MeasurementInputProps) {
  const [draft, setDraft] = React.useState(() => formatAmount(amount));

  React.useEffect(() => {
    setDraft(formatAmount(amount));
  }, [amount]);

  const commitAmount = React.useCallback(() => {
    const parsed = parseAmount(draft);
    if (draft.trim() !== '' && parsed === null) {
      setDraft(formatAmount(amount));
      return;
    }
    if (parsed !== amount) {
      onChange({ amount: parsed, unit });
    }
  }, [draft, amount, unit, onChange]);

  const groupLabel = ariaLabel ?? (kind === 'length' ? 'Length and unit' : 'Weight and unit');

  return (
    <div
      role="group"
      aria-label={groupLabel}
      className={cn(
        'flex min-h-7 min-w-0 items-stretch overflow-hidden rounded border border-idpxyz-border bg-idpxyz-inputBg text-[12px]',
        'transition-[border-color,background-color,opacity]',
        'focus-within:border-[#4ea8ff] focus-within:ring-0',
        disabled && 'cursor-not-allowed border-idpxyz-border/40 bg-idpxyz-hover/35 opacity-50',
        className
      )}
    >
      <Input
        id={id}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        placeholder={placeholder}
        value={draft}
        disabled={disabled}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commitAmount}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.currentTarget.blur();
          }
        }}
        className={cn(
          'h-7 min-w-0 flex-1 rounded-none border-0 bg-transparent px-2 font-mono text-[12px] tabular-nums shadow-none',
          'text-idpxyz-text placeholder:text-idpxyz-textMuted',
          'outline-none focus-visible:border-transparent focus-visible:ring-0 focus-visible:shadow-none'
        )}
      />
      <Select
        value={unit}
        onValueChange={(u) => onChange({ amount: parseAmount(draft), unit: u })}
        disabled={disabled}
      >
        <SelectTrigger
          aria-label="Unit"
          size="default"
          className={cn(
            'h-7 min-h-7 w-14 shrink-0 rounded-none border-0 border-l border-idpxyz-border/50 bg-idpxyz-hover/25 px-1.5 shadow-none',
            'text-[12px] text-idpxyz-text data-[placeholder]:text-idpxyz-textMuted',
            'focus-visible:ring-0 focus-visible:ring-offset-0',
            '[&>svg]:h-3 [&>svg]:w-3 [&>svg]:shrink-0 [&>svg]:text-idpxyz-textMuted'
          )}
        >
          <SelectValue placeholder="—" />
        </SelectTrigger>
        <SelectContent>
          {units.map((u) => (
            <SelectItem key={u.value} value={u.value}>
              {u.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

MeasurementInput.displayName = 'MeasurementInput';

export { MeasurementInput };
