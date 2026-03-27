/** Strings for {@link DatePicker} — pass translated values from your i18n layer. */
export interface DatePickerMessages {
  /** Trigger text when no date is selected. */
  placeholder?: string;
}

/** Strings for {@link DateTimePicker}. */
export interface DateTimePickerMessages extends DatePickerMessages {
  /** Label for the time row (left of hour/minute selects). */
  timeLabel?: string;
  /** Passed to `TimeSelectFields` (hour `<select>` / column). */
  hourLabel?: string;
  minuteLabel?: string;
}

export const defaultDatePickerMessages = {
  placeholder: 'Pick a date',
} as const;

export const defaultDateTimePickerMessages = {
  placeholder: 'Pick date & time',
  timeLabel: 'Time',
} as const;

/** Strings for {@link DateRangePicker}. */
export interface DateRangePickerMessages extends DatePickerMessages {
  /** Between start and end in the trigger label (not date-fns formatting). */
  rangeSeparator?: string;
  /** Shown after the start date while the user is still picking the end date. */
  partialSuffix?: string;
}

export const defaultDateRangePickerMessages = {
  placeholder: 'Pick a date range',
  rangeSeparator: ' – ',
  partialSuffix: ' …',
} as const;
