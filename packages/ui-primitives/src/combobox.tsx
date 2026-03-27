'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@idpxyz/ui-utils';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './command';
import { selectTriggerVariants } from './select';

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value: string | undefined;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  /** Applied to the dropdown panel */
  className?: string;
  /** Applied to the trigger button */
  triggerClassName?: string;
  size?: 'sm' | 'default' | 'lg';
}

function Combobox({
  options,
  value,
  onValueChange,
  placeholder = 'Select…',
  searchPlaceholder = 'Search…',
  emptyText = 'No results.',
  disabled,
  className,
  triggerClassName,
  size = 'default',
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  /** cmdk keyboard highlight — sync to form `value` when opening so focus row matches the checkmark */
  const [highlightedValue, setHighlightedValue] = React.useState('');
  const selected = options.find((o) => o.value === value);

  const optionsSignature = React.useMemo(
    () => options.map((o) => `${o.value}:${o.disabled ? 1 : 0}`).join('|'),
    [options]
  );

  const optionsRef = React.useRef(options);
  optionsRef.current = options;

  const syncHighlightToValue = React.useCallback(() => {
    const opts = optionsRef.current;
    const firstEnabled = opts.find((o) => !o.disabled)?.value ?? '';
    const match =
      value != null &&
      value !== '' &&
      opts.some((o) => o.value === value && !o.disabled);
    setHighlightedValue(match ? value : firstEnabled);
  }, [value, optionsSignature]);

  React.useLayoutEffect(() => {
    if (open) syncHighlightToValue();
  }, [open, syncHighlightToValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-expanded={open}
          className={cn(selectTriggerVariants({ size }), 'w-full', triggerClassName)}
        >
          <span className="min-w-0 flex-1 truncate text-left">
            {selected ? (
              selected.label
            ) : value ? (
              <span className="text-idpxyz-textMuted">{value}</span>
            ) : (
              <span className="text-idpxyz-textMuted">{placeholder}</span>
            )}
          </span>
          <ChevronsUpDown className="h-3 w-3 shrink-0 text-idpxyz-textMuted" strokeWidth={2} aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent className={cn('p-0', className)} align="start">
        <Command value={highlightedValue} onValueChange={setHighlightedValue}>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <CommandItem
                    key={opt.value}
                    value={opt.value}
                    disabled={opt.disabled}
                    className={cn(
                      'relative py-2 pl-2 pr-8 text-[12px] leading-snug text-idpxyz-text'
                    )}
                    onSelect={() => {
                      onValueChange(opt.value);
                      setOpen(false);
                    }}
                  >
                    <span className="min-w-0 flex-1 truncate">{opt.label}</span>
                    {isSelected && (
                      <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                        <Check className="h-3 w-3 text-idpxyz-accent" strokeWidth={2.5} aria-hidden />
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { Combobox };
