'use client';

import * as React from 'react';
import { format, type Locale } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { CalendarClock } from 'lucide-react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '@idpxyz/ui-utils';

import { Calendar, type CalendarDensity, type CalendarProps } from './calendar';
import { getTimeHHmmFromDate, setTimeOnDate } from './date-time-utils';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { selectTriggerVariants } from './select';
import { TimeSelectFields } from './time-picker';
import { defaultDateTimePickerMessages, type DateTimePickerMessages } from './date-picker-messages';

const DEFAULT_TIME = '09:00';

export interface DateTimePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  /** Translated strings; per-field keys override top-level props when set. */
  messages?: DateTimePickerMessages;
  disabled?: boolean;
  className?: string;
  id?: string;
  /** `date-fns` format for the trigger (date + time). Default `PPP p`. */
  format?: string;
  /** Passed to `Calendar` / `DayPicker` for weekdays, month/year labels, etc. Override with `calendarProps.locale`. */
  locale?: Locale;
  size?: VariantProps<typeof selectTriggerVariants>['size'];
  minuteStep?: number;
  /** Passed to {@link Calendar}. Default `compact`. */
  density?: CalendarDensity;
  calendarProps?: Omit<CalendarProps, 'mode' | 'selected' | 'onSelect'>;
}

function DateTimePicker({
  value,
  onChange,
  placeholder,
  messages,
  disabled,
  className,
  id,
  format: formatPattern = 'PPP p',
  locale = enUS,
  size = 'default',
  minuteStep = 1,
  density = 'compact',
  calendarProps,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [timePart, setTimePart] = React.useState(() => (value ? getTimeHHmmFromDate(value) : DEFAULT_TIME));

  React.useEffect(() => {
    if (value) setTimePart(getTimeHHmmFromDate(value));
    else setTimePart(DEFAULT_TIME);
  }, [value]);

  const handleTimeChange = (next: string) => {
    setTimePart(next);
    const base = value ?? new Date();
    onChange(setTimeOnDate(base, next));
  };

  const handleDateSelect = (d: Date | undefined) => {
    if (!d) {
      onChange(undefined);
      return;
    }
    onChange(setTimeOnDate(d, timePart));
  };

  const placeholderText =
    messages?.placeholder ?? placeholder ?? defaultDateTimePickerMessages.placeholder;
  const timeLabelText =
    messages?.timeLabel ?? defaultDateTimePickerMessages.timeLabel;

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
            !value && 'text-idpxyz-textMuted',
            className
          )}
        >
          <CalendarClock className="h-3.5 w-3.5 shrink-0 text-idpxyz-textMuted" strokeWidth={2} aria-hidden />
          <span className="truncate">{value ? format(value, formatPattern, { locale }) : placeholderText}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex flex-col gap-2 p-2">
          <Calendar
            locale={locale}
            {...(calendarProps ?? {})}
            density={density}
            mode="single"
            selected={value}
            onSelect={handleDateSelect}
            autoFocus
          />
          <div className="flex items-center justify-between gap-2 border-t border-idpxyz-border pt-2">
            <span className="text-[11px] text-idpxyz-textMuted">{timeLabelText}</span>
            <TimeSelectFields
              value={timePart}
              onChange={handleTimeChange}
              disabled={disabled}
              minuteStep={minuteStep}
              hourLabel={messages?.hourLabel}
              minuteLabel={messages?.minuteLabel}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

DateTimePicker.displayName = 'DateTimePicker';

export { DateTimePicker };
