'use client';

import * as React from 'react';
import { cn } from '@idpxyz/ui-utils';
import { Input } from '@idpxyz/ui-primitives';

/** Centimetres per edge; `null` = empty field. */
export interface ParcelDimensionsCm {
  length: number | null;
  width: number | null;
  height: number | null;
}

export interface ParcelDimensionsFieldProps {
  value: ParcelDimensionsCm;
  onChange: (next: ParcelDimensionsCm) => void;
  /** Parent-computed volume (formatted string, `<span>`, or any node). Not calculated inside this component. */
  volumeReadout?: React.ReactNode;
  /** Label before `volumeReadout` (default `体积`); set `null` to hide. */
  volumeLabel?: React.ReactNode | null;
  /** Axis labels (default `L` / `W` / `H`). */
  labels?: Partial<Record<'length' | 'width' | 'height', string>>;
  disabled?: boolean;
  className?: string;
  /** Prefix for `id` / `htmlFor` (`${idPrefix}-length`, …). */
  idPrefix?: string;
}

function parseCm(raw: string): number | null {
  const t = raw.trim().replace(/\s+/g, '');
  if (t === '') return null;
  const n = Number(t.replace(',', '.'));
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

function formatCm(n: number | null): string {
  if (n === null) return '';
  return String(n);
}

type Axis = 'length' | 'width' | 'height';

function EdgeCmInput({
  id,
  label,
  value,
  onCommit,
  disabled,
  placeholder = '0',
}: {
  id?: string;
  label: string;
  value: number | null;
  onCommit: (n: number | null) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  const [draft, setDraft] = React.useState(() => formatCm(value));

  React.useEffect(() => {
    setDraft(formatCm(value));
  }, [value]);

  const commit = React.useCallback(() => {
    const parsed = parseCm(draft);
    if (draft.trim() !== '' && parsed === null) {
      setDraft(formatCm(value));
      return;
    }
    if (parsed !== value) onCommit(parsed);
  }, [draft, value, onCommit]);

  return (
    <div className="flex min-w-0 flex-col gap-1">
      <label htmlFor={id} className="text-[11px] font-medium text-idpxyz-textMuted">
        {label}
      </label>
      <div
        className={cn(
          'flex min-h-7 min-w-0 items-stretch overflow-hidden rounded border border-idpxyz-border bg-idpxyz-inputBg text-[12px]',
          'transition-[border-color,background-color,opacity]',
          'focus-within:border-[#4ea8ff] focus-within:ring-0',
          disabled && 'cursor-not-allowed border-idpxyz-border/40 bg-idpxyz-hover/35 opacity-50'
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
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.currentTarget.blur();
          }}
          className={cn(
            'h-7 min-w-0 flex-1 rounded-none border-0 bg-transparent px-2 font-mono text-[12px] tabular-nums shadow-none',
            'text-idpxyz-text placeholder:text-idpxyz-textMuted',
            'outline-none focus-visible:border-transparent focus-visible:ring-0 focus-visible:shadow-none'
          )}
        />
        <span
          className="flex shrink-0 items-center border-l border-idpxyz-border/50 bg-idpxyz-hover/25 px-2 text-[11px] font-medium tabular-nums text-idpxyz-textMuted select-none"
          aria-hidden
        >
          cm
        </span>
      </div>
    </div>
  );
}

/**
 * **Length × width × height** in **centimetres** (fixed unit). **Volume** is not computed here — pass
 * {@link ParcelDimensionsFieldProps.volumeReadout} from the parent (or your pricing hook).
 */
function ParcelDimensionsField({
  value,
  onChange,
  volumeReadout,
  volumeLabel: volumeLabelProp = '体积',
  labels,
  disabled,
  className,
  idPrefix = 'parcel-dim',
}: ParcelDimensionsFieldProps) {
  const L = labels?.length ?? 'L';
  const W = labels?.width ?? 'W';
  const H = labels?.height ?? 'H';

  const patch = React.useCallback(
    (axis: Axis, n: number | null) => {
      onChange({ ...value, [axis]: n });
    },
    [value, onChange]
  );

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div
        role="group"
        aria-label="Parcel dimensions in centimetres"
        className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-3"
      >
        <EdgeCmInput
          id={`${idPrefix}-length`}
          label={L}
          value={value.length}
          disabled={disabled}
          onCommit={(n) => patch('length', n)}
        />
        <EdgeCmInput
          id={`${idPrefix}-width`}
          label={W}
          value={value.width}
          disabled={disabled}
          onCommit={(n) => patch('width', n)}
        />
        <EdgeCmInput
          id={`${idPrefix}-height`}
          label={H}
          value={value.height}
          disabled={disabled}
          onCommit={(n) => patch('height', n)}
        />
      </div>
      {volumeReadout != null && (
        <p className="text-[12px] leading-snug text-idpxyz-text">
          {volumeLabelProp != null && (
            <span className="text-idpxyz-textMuted">{volumeLabelProp} </span>
          )}
          <span className="tabular-nums">{volumeReadout}</span>
        </p>
      )}
    </div>
  );
}

ParcelDimensionsField.displayName = 'ParcelDimensionsField';

export { ParcelDimensionsField };
