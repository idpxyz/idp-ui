'use client';

import * as React from 'react';
import { format, type Locale } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { type VariantProps } from 'class-variance-authority';
import type { DateRange } from 'react-day-picker';
import { cn } from '@idpxyz/ui-utils';

import { Calendar, type CalendarDensity, type CalendarProps } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { selectTriggerVariants } from './select';
import {
  defaultDateRangePickerMessages,
  type DateRangePickerMessages,
} from './date-picker-messages';

export type { DateRange };

export interface DateRangePickerProps {
  value?: DateRange;
  onChange: (range: DateRange | undefined) => void;
  placeholder?: string;
  /** Translated strings; `messages.placeholder` wins over `placeholder`. */
  messages?: DateRangePickerMessages;
  disabled?: boolean;
  className?: string;
  id?: string;
  /** `date-fns` format for both ends of the range in the trigger. Default `PPP`. */
  format?: string;
  /** Passed to `Calendar` / `DayPicker` for weekdays, month/year labels, etc. */
  locale?: Locale;
  size?: VariantProps<typeof selectTriggerVariants>['size'];
  /** Passed to {@link Calendar}. Default `compact`. */
  density?: CalendarDensity;
  /**
   * Months shown side-by-side. Default `2` so start and end are easy to pick.
   * @see https://daypicker.dev/docs/customization#multiplemonths
   */
  numberOfMonths?: number;
  /**
   * Minimum number of calendar days in the range (passed to DayPicker as `min`).
   * Default `1` so the **first** click only sets the start date; with `0`, the first click completes a same-day range and the popover may close before you pick an end date.
   * @see https://daypicker.dev/docs/selection-modes#range-mode
   */
  min?: number;
  /**
   * When `true`, the popover closes once both `from` and `to` are set.
   * Default `false` — close by clicking outside the popover or pressing Escape.
   */
  closeOnComplete?: boolean;
  /** Props forwarded to `Calendar` / `DayPicker` (except `mode`, `selected`, `onSelect`). */
  calendarProps?: Omit<CalendarProps, 'mode' | 'selected' | 'onSelect'>;
}

function formatRangeTrigger(
  range: DateRange | undefined,
  formatPattern: string,
  locale: Locale,
  rangeSeparator: string,
  partialSuffix: string
): string {
  if (!range?.from) return '';
  const start = format(range.from, formatPattern, { locale });
  if (!range.to) return `${start}${partialSuffix}`;
  return `${start}${rangeSeparator}${format(range.to, formatPattern, { locale })}`;
}

function DateRangePicker({
  value,
  onChange,
  placeholder,
  messages,
  disabled,
  className,
  id,
  format: formatPattern = 'PPP',
  locale = enUS,
  size = 'default',
  density = 'compact',
  numberOfMonths = 2,
  /** Default `1` — required so the first tap sets only `from` (react-day-picker uses `min=0` to mean “same-day range on first click”). */
  min = 1,
  closeOnComplete = false,
  calendarProps,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const placeholderText =
    messages?.placeholder ?? placeholder ?? defaultDateRangePickerMessages.placeholder;
  const rangeSeparator =
    messages?.rangeSeparator ?? defaultDateRangePickerMessages.rangeSeparator;
  const partialSuffix =
    messages?.partialSuffix ?? defaultDateRangePickerMessages.partialSuffix;

  const label = formatRangeTrigger(value, formatPattern, locale, rangeSeparator, partialSuffix);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          disabled={disabled}
          className={cn(
            selectTriggerVariants({ size }),
            'w-full min-w-[12rem] justify-start gap-2 font-normal',
            !value?.from && 'text-idpxyz-textMuted',
            className
          )}
        >
          <CalendarIcon className="h-3.5 w-3.5 shrink-0 text-idpxyz-textMuted" strokeWidth={2} aria-hidden />
          <span className="truncate">{label || placeholderText}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto max-w-[calc(100vw-2rem)] p-0" align="start">
        <Calendar
          locale={locale}
          {...(calendarProps ?? {})}
          density={density}
          mode="range"
          numberOfMonths={numberOfMonths}
          min={min}
          selected={value}
          onSelect={(range) => {
            onChange(range);
            if (closeOnComplete && range?.from && range?.to) {
              setOpen(false);
            }
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}

DateRangePicker.displayName = 'DateRangePicker';

export { DateRangePicker };
