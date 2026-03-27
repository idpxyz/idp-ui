'use client';

import * as React from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker, type DayPickerProps } from 'react-day-picker';
import { cn } from '@idpxyz/ui-utils';

import 'react-day-picker/style.css';
import './calendar-density.css';

import { CalendarDropdown } from './calendar-dropdown';

/** Theme tokens on the picker root so `--rdp-*` wins over `react-day-picker/style.css` (same ordering issue as compact density). */
const themeRdpVars: Record<string, string> = {
  '--rdp-accent-color': 'var(--idpxyz-accent, #007acc)',
  '--rdp-accent-background-color': 'color-mix(in srgb, var(--idpxyz-accent, #007acc) 22%, transparent)',
  '--rdp-today-color': 'var(--idpxyz-accent, #007acc)',
};

/** Default density: nav tweaks only (cell size stays ~44px from library). */
const defaultDensityNavVars: Record<string, string> = {
  '--rdp-nav_button-width': '1.75rem',
  '--rdp-nav-height': '3rem',
};

/** Cell and padding sizing for {@link Calendar}. */
export type CalendarDensity = 'default' | 'compact';

export type CalendarProps = DayPickerProps & {
  /**
   * `default` — react-day-picker baseline (~44px cells, wider month gap).  
   * `compact` — tight grid (~25px cells); default for this design system.
   */
  density?: CalendarDensity;
};

/**
 * Month grid built on [react-day-picker](https://daypicker.dev) with default `rdp-*` styles.
 *
 * **Navigation (shadcn-style header):** Defaults to `captionLayout="dropdown"` and `navLayout="after"`. Month/year
 * dropdowns sit **top-left** (`justify-start`); prev/next are **grouped top-right** (stacked `Nav` + absolute
 * positioning — same goal as shadcn’s full-width nav row, without splitting arrows to far left/right).
 * `startMonth` / `endMonth` default to ~100 years in
 * the past through ~50 years in the future so future
 * dates are selectable (react-day-picker’s dropdown-only default ends at the current calendar year otherwise).
 *
 * **Styles:** This file imports `react-day-picker/style.css`. Bundlers should include it; if dates look unstyled, add
 * `import 'react-day-picker/style.css'` in your app entry.
 *
 * Accent colors follow `--idpxyz-accent` when set on `:root` (see app `index.css`).
 *
 * **Month/year pickers:** Use Radix `Select` via {@link CalendarDropdown} (same family as time pickers), not native
 * `<select>`. `color-scheme` on the root still helps other native UI in the page.
 */
function Calendar({
  className,
  classNames,
  density = 'compact',
  style,
  showOutsideDays = true,
  captionLayout = 'dropdown',
  navLayout = 'after',
  startMonth: startMonthProp,
  endMonth: endMonthProp,
  components: userComponents,
  ...props
}: CalendarProps) {
  const y = new Date().getFullYear();
  const startMonth = startMonthProp ?? new Date(y - 100, 0);
  const endMonth = endMonthProp ?? new Date(y + 50, 11, 31);
  const isCompact = density === 'compact';

  const rootStyle = React.useMemo((): React.CSSProperties => {
    const base = (isCompact ? {} : defaultDensityNavVars) as unknown as React.CSSProperties;
    return { ...themeRdpVars, ...base, ...style } as React.CSSProperties;
  }, [isCompact, style]);

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      navLayout={navLayout}
      startMonth={startMonth}
      endMonth={endMonth}
      data-idpxyz-density={isCompact ? 'compact' : 'default'}
      style={rootStyle}
      className={cn(
        'rounded-md border border-idpxyz-border bg-idpxyz-sidebar text-idpxyz-text',
        isCompact ? 'p-1' : 'p-2',
        /* Native <select> option popovers follow this (Chrome/Edge/Safari); default dark for idp shells */
        '[color-scheme:var(--idpxyz-native-color-scheme,dark)]',
        className
      )}
      classNames={{
        month: cn('isolate', classNames?.month),
        month_caption: cn(
          'flex w-full min-w-0 items-center justify-start overflow-hidden font-medium text-idpxyz-text',
          isCompact ? 'text-[12px]' : 'text-[13px]',
          'min-h-[var(--rdp-nav-height)] h-[var(--rdp-nav-height)]',
          navLayout === 'after' && (isCompact ? 'mb-1' : 'mb-2'),
          navLayout === 'after' && 'pr-[calc(2*var(--rdp-nav_button-width)+0.5rem)]',
          classNames?.month_caption
        ),
        dropdowns: cn(
          'inline-flex min-w-0 max-w-full flex-1 flex-wrap items-center justify-start gap-1.5',
          navLayout === 'after' && 'h-full',
          classNames?.dropdowns
        ),
        dropdown_root: cn('inline-flex min-w-0 items-center', classNames?.dropdown_root),
        caption_label: cn(
          isCompact ? 'text-[12px]' : 'text-[13px]',
          'font-medium text-idpxyz-text',
          isCompact ? '[&>svg]:h-3 [&>svg]:w-3' : '[&>svg]:h-3.5 [&>svg]:w-3.5',
          '[&>svg]:shrink-0 [&>svg]:text-idpxyz-textMuted',
          classNames?.caption_label
        ),
        nav: cn(
          'flex items-center gap-0.5',
          navLayout === 'after' &&
            'absolute end-0 top-0 z-10 h-[var(--rdp-nav-height)] justify-end',
          classNames?.nav
        ),
        weekday: cn(
          isCompact ? 'text-[10px]' : 'text-[11px]',
          'text-idpxyz-textMuted',
          classNames?.weekday
        ),
        button_next: cn(
          'inline-flex shrink-0 items-center justify-center rounded border border-idpxyz-border bg-idpxyz-hover text-idpxyz-text hover:bg-idpxyz-hover/80',
          isCompact ? 'h-6 w-6' : 'h-7 w-7',
          classNames?.button_next
        ),
        button_previous: cn(
          'inline-flex shrink-0 items-center justify-center rounded border border-idpxyz-border bg-idpxyz-hover text-idpxyz-text hover:bg-idpxyz-hover/80',
          isCompact ? 'h-6 w-6' : 'h-7 w-7',
          classNames?.button_previous
        ),
        today: cn(
          /* Keep default `rdp-today` so `react-day-picker/style.css` and `:not(.rdp-selected)` rules apply */
          'rdp-today',
          '[&_.rdp-day_button]:font-semibold [&_.rdp-day_button]:text-[var(--idpxyz-accent,#007acc)]',
          '[&:not(.rdp-selected)_.rdp-day_button]:bg-[color-mix(in_srgb,var(--idpxyz-accent,#007acc)_24%,transparent)]',
          '[&:not(.rdp-selected)_.rdp-day_button]:shadow-[inset_0_0_0_1px_var(--idpxyz-accent,#007acc)]',
          '[&:not(.rdp-selected)_.rdp-day_button]:rounded-full',
          classNames?.today
        ),
        selected: cn(
          /* Keep `rdp-selected` — without it, `.rdp-selected .rdp-day_button` borders / range highlights break */
          'rdp-selected',
          /* Typography reset: see `calendar-density.css` (Tailwind `text-inherit` was not reliably beating `font-size: large`) */
          classNames?.selected
        ),
        outside: cn(
          'rdp-outside',
          '[&_.rdp-day_button]:text-idpxyz-textMuted',
          classNames?.outside
        ),
        ...classNames,
      }}
      components={{
        Dropdown: CalendarDropdown,
        Chevron: ({ className: chClass, orientation, ...rest }) => {
          if (orientation === 'left') {
            return <ChevronLeft className={cn('h-4 w-4', chClass)} strokeWidth={2} aria-hidden {...rest} />;
          }
          if (orientation === 'right') {
            return <ChevronRight className={cn('h-4 w-4', chClass)} strokeWidth={2} aria-hidden {...rest} />;
          }
          return <ChevronDown className={cn('h-4 w-4', chClass)} strokeWidth={2} aria-hidden {...rest} />;
        },
        ...userComponents,
      }}
      {...props}
    />
  );
}

Calendar.displayName = 'Calendar';

export { Calendar };
