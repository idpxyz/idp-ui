'use client';

import * as React from 'react';
import { Clock } from 'lucide-react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '@idpxyz/ui-utils';

import { formatTimeParts, parseTimeParts } from './date-time-utils';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  selectTriggerVariants,
} from './select';

const timeSelectTriggerClass =
  'w-[4rem] min-w-[4rem] shrink-0 justify-center gap-1 px-1.5 font-mono tabular-nums';

export interface TimeSelectFieldsProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  /** Minute step (1–30). Default `1`. */
  minuteStep?: number;
  className?: string;
  hourLabel?: string;
  minuteLabel?: string;
}

/** Hour / minute pickers (24h `HH:mm`) using compact **Select** dropdowns — closed by default, familiar pattern. */
export function TimeSelectFields({
  value,
  onChange,
  disabled,
  minuteStep = 1,
  className,
  hourLabel = 'Hour',
  minuteLabel = 'Minute',
}: TimeSelectFieldsProps) {
  const p = parseTimeParts(value) ?? { h: 0, m: 0 };
  const hours = React.useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const minutes = React.useMemo(() => {
    const step = Math.min(30, Math.max(1, Math.floor(minuteStep)));
    return Array.from({ length: Math.ceil(60 / step) }, (_, i) => Math.min(59, i * step));
  }, [minuteStep]);

  const safeMinute = React.useMemo(() => {
    if (minutes.includes(p.m)) return p.m;
    const step = Math.min(30, Math.max(1, Math.floor(minuteStep)));
    const snapped = Math.round(p.m / step) * step;
    return Math.min(59, Math.max(0, snapped));
  }, [p.m, minutes, minuteStep]);

  React.useLayoutEffect(() => {
    const parts = parseTimeParts(value);
    if (!parts) return;
    const step = Math.min(30, Math.max(1, Math.floor(minuteStep)));
    const mins = Array.from({ length: Math.ceil(60 / step) }, (_, i) => Math.min(59, i * step));
    if (mins.includes(parts.m)) return;
    const snapped = Math.round(parts.m / step) * step;
    const normalized = Math.min(59, Math.max(0, snapped));
    onChange(formatTimeParts(parts.h, normalized));
  }, [value, minuteStep, onChange]);

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <Select
        value={String(p.h)}
        onValueChange={(v) => onChange(formatTimeParts(Number(v), safeMinute))}
        disabled={disabled}
      >
        <SelectTrigger size="sm" className={timeSelectTriggerClass} aria-label={hourLabel}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {hours.map((h) => (
            <SelectItem key={h} value={String(h)}>
              {String(h).padStart(2, '0')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="shrink-0 text-idpxyz-textMuted" aria-hidden>
        :
      </span>
      <Select
        value={String(safeMinute)}
        onValueChange={(v) => onChange(formatTimeParts(p.h, Number(v)))}
        disabled={disabled}
      >
        <SelectTrigger size="sm" className={timeSelectTriggerClass} aria-label={minuteLabel}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {minutes.map((m) => (
            <SelectItem key={m} value={String(m)}>
              {String(m).padStart(2, '0')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
  minuteStep?: number;
  size?: VariantProps<typeof selectTriggerVariants>['size'];
}

function TimePicker({
  value,
  onChange,
  disabled,
  className,
  id,
  minuteStep = 1,
  size = 'default',
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const display = parseTimeParts(value) ? value : '00:00';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          disabled={disabled}
          className={cn(selectTriggerVariants({ size }), 'w-full min-w-[8rem] justify-start gap-2 font-normal', className)}
        >
          <Clock className="h-3.5 w-3.5 shrink-0 text-idpxyz-textMuted" strokeWidth={2} aria-hidden />
          <span className="font-mono tabular-nums">{display}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="start">
        <TimeSelectFields value={value} onChange={onChange} disabled={disabled} minuteStep={minuteStep} />
      </PopoverContent>
    </Popover>
  );
}

TimePicker.displayName = 'TimePicker';

export { TimePicker };
