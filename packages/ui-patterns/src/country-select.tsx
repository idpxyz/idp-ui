'use client';

import * as React from 'react';
import { Combobox, type ComboboxProps } from '@idpxyz/ui-primitives';

/** ISO 3166-1 alpha-2 code + display label (any language). Data is always injected by the app. */
export interface CountryOption {
  code: string;
  label: string;
  disabled?: boolean;
}

export type CountrySelectProps = Omit<ComboboxProps, 'options' | 'value' | 'onValueChange'> & {
  options: readonly CountryOption[];
  /** ISO 3166-1 alpha-2 (empty = cleared). */
  value: string | undefined;
  onValueChange: (code: string) => void;
};

/**
 * Searchable country picker — thin shell over {@link Combobox}. Pass `options` from your BFF/config;
 * do **not** ship a full world list inside the design system.
 */
function CountrySelect({ options, searchPlaceholder = 'Search country…', placeholder = 'Select country…', ...rest }: CountrySelectProps) {
  const comboboxOptions = React.useMemo(
    () => options.map((o) => ({ value: o.code, label: o.label, disabled: o.disabled })),
    [options]
  );
  return (
    <Combobox
      options={comboboxOptions}
      searchPlaceholder={searchPlaceholder}
      placeholder={placeholder}
      {...rest}
    />
  );
}

CountrySelect.displayName = 'CountrySelect';

export { CountrySelect };
