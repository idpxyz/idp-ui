'use client';

import * as React from 'react';
import { format, type Locale } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '@idpxyz/ui-utils';

import { Calendar, type CalendarDensity, type CalendarProps } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { selectTriggerVariants } from './select';
import { defaultDatePickerMessages, type DatePickerMessages } from './date-picker-messages';

export interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  /** Translated strings; `messages.placeholder` wins over `placeholder`. */
  messages?: DatePickerMessages;
  disabled?: boolean;
  className?: string;
  id?: string;
  /** `date-fns` format for the trigger label. Default `PPP`. */
  format?: string;
  /** Passed to `Calendar` / `DayPicker` for weekdays, month/year labels, etc. Override with `calendarProps.locale`. */
  locale?: Locale;
  size?: VariantProps<typeof selectTriggerVariants>['size'];
  /** Passed to {@link Calendar}. Default `compact`. */
  density?: CalendarDensity;
  /**
   * When `true` (default), the popover closes after you pick a day — typical single-date UX.
   * Set `false` to keep the panel open until click outside / Escape (closer to {@link DateRangePicker} behavior).
   */
  closeOnSelect?: boolean;
  /** Props forwarded to `Calendar` / `DayPicker` (except `mode`, `selected`, `onSelect`). */
  calendarProps?: Omit<CalendarProps, 'mode' | 'selected' | 'onSelect'>;
}

function DatePicker({
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
  closeOnSelect = true,
  calendarProps,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const placeholderText =
    messages?.placeholder ?? placeholder ?? defaultDatePickerMessages.placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          disabled={disabled}
          className={cn(
            selectTriggerVariants({ size }),
            'w-full min-w-[10rem] justify-start gap-2 font-normal',
            !value && 'text-idpxyz-textMuted',
            className
          )}
        >
          <CalendarIcon className="h-3.5 w-3.5 shrink-0 text-idpxyz-textMuted" strokeWidth={2} aria-hidden />
          <span className="truncate">{value ? format(value, formatPattern, { locale }) : placeholderText}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          locale={locale}
          {...(calendarProps ?? {})}
          density={density}
          mode="single"
          selected={value}
          onSelect={(d) => {
            onChange(d);
            if (closeOnSelect) setOpen(false);
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}

DatePicker.displayName = 'DatePicker';

export { DatePicker };
