'use client';

import * as React from 'react';
import type { DropdownProps } from 'react-day-picker';
import { cn } from '@idpxyz/ui-utils';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  selectTriggerVariants,
} from './select';

/**
 * Radix {@link Select} implementation for DayPicker’s month/year dropdowns — same control family as {@link TimeSelectFields}
 * (trigger + portal list, theme-aligned), replacing the library’s native `<select>`.
 */
function CalendarDropdown({
  options,
  className,
  classNames,
  disabled,
  value,
  onChange,
  components: _components,
  ..._rest
}: DropdownProps) {
  const ariaLabel = (_rest as { 'aria-label'?: string })['aria-label'];

  const handleValueChange = (v: string) => {
    const n = Number(v);
    const ev = {
      target: { value: n },
      currentTarget: { value: n },
    } as unknown as React.ChangeEvent<HTMLSelectElement>;
    onChange?.(ev);
  };

  const strVal = value !== undefined && value !== null ? String(value) : '';

  return (
    <span className={cn('relative inline-flex min-w-0', classNames?.dropdown_root)} data-disabled={disabled || undefined}>
      <Select value={strVal} onValueChange={handleValueChange} disabled={disabled}>
        <SelectTrigger
          size="sm"
          className={cn(
            selectTriggerVariants({ size: 'sm' }),
            'h-7 w-auto min-w-[4.5rem] max-w-[13rem] shrink-0 justify-between gap-1 px-2 font-normal',
            className
          )}
          aria-label={ariaLabel}
        >
          <span className="min-w-0 flex-1 truncate text-left">
            <SelectValue placeholder="—" />
          </span>
        </SelectTrigger>
        <SelectContent position="popper" sideOffset={4} align="start">
          {options?.map((o) => (
            <SelectItem key={o.value} value={String(o.value)} disabled={o.disabled}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </span>
  );
}

CalendarDropdown.displayName = 'CalendarDropdown';

export { CalendarDropdown };
