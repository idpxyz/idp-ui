'use client';

import * as React from 'react';
import { ChevronsUpDown } from 'lucide-react';
import { cn } from '@idpxyz/ui-utils';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { selectTriggerVariants } from './select';
import type { ComboboxOption } from './combobox';

export interface MultiSelectProps {
  options: ComboboxOption[];
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  /** After this many labels, show "+N" */
  maxDisplay?: number;
  className?: string;
  triggerClassName?: string;
  size?: 'sm' | 'default' | 'lg';
}

function MultiSelect({
  options,
  value,
  onValueChange,
  placeholder = 'Select…',
  searchPlaceholder = 'Search…',
  emptyText = 'No results.',
  disabled,
  maxDisplay = 3,
  className,
  triggerClassName,
  size = 'default',
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState('');

  const filtered = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return options;
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(s) ||
        o.value.toLowerCase().includes(s)
    );
  }, [options, q]);

  const toggle = (v: string) => {
    if (value.includes(v)) onValueChange(value.filter((x) => x !== v));
    else onValueChange([...value, v]);
  };

  const labels = value.map((v) => options.find((o) => o.value === v)?.label ?? v);
  let summary: React.ReactNode;
  if (labels.length === 0) {
    summary = <span className="text-idpxyz-textMuted">{placeholder}</span>;
  } else if (maxDisplay > 0 && labels.length > maxDisplay) {
    summary = (
      <span>
        {labels.slice(0, maxDisplay).join(', ')}
        <span className="text-idpxyz-textMuted"> +{labels.length - maxDisplay}</span>
      </span>
    );
  } else {
    summary = labels.join(', ');
  }

  return (
    <Popover
      modal={false}
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setQ('');
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-expanded={open}
          className={cn(selectTriggerVariants({ size }), 'w-full', triggerClassName)}
        >
          <span className="min-w-0 flex-1 truncate text-left">{summary}</span>
          <ChevronsUpDown className="h-3 w-3 shrink-0 text-idpxyz-textMuted" strokeWidth={2} aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent className={cn('p-0', className)} align="start">
        <div className="flex flex-col">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-8 shrink-0 border-b border-idpxyz-border bg-idpxyz-inputBg px-2 text-[12px] text-idpxyz-text outline-none placeholder:text-idpxyz-textMuted"
          />
          <div className="max-h-[280px] overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <div className="py-6 text-center text-[12px] text-idpxyz-textMuted">{emptyText}</div>
            ) : (
              filtered.map((opt) => (
                <label
                  key={opt.value}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-[12px] hover:bg-idpxyz-hover',
                    opt.disabled && 'pointer-events-none opacity-40'
                  )}
                >
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 shrink-0 rounded border border-idpxyz-border bg-idpxyz-input text-idpxyz-accent accent-idpxyz-accent"
                    checked={value.includes(opt.value)}
                    disabled={opt.disabled}
                    onChange={() => !opt.disabled && toggle(opt.value)}
                  />
                  <span className="min-w-0 flex-1 truncate text-idpxyz-text">{opt.label}</span>
                </label>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { MultiSelect };
