'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { Check, Circle } from 'lucide-react';
import { cn } from '@idpxyz/ui-utils';

const Checkbox = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & { label?: string }
>(({ className, label, id, ...props }, ref) => {
  const inputId = id || React.useId();
  return (
    <div className="flex items-center gap-2">
      <CheckboxPrimitive.Root
        ref={ref}
        id={inputId}
        className={cn(
          'peer h-4 w-4 shrink-0 rounded border border-idpxyz-border bg-idpxyz-input',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-idpxyz-accent/35 focus-visible:ring-offset-0',
          'data-[state=checked]:border-idpxyz-accent data-[state=checked]:bg-idpxyz-accent',
          'disabled:cursor-not-allowed disabled:opacity-40',
          className
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center text-white">
          <Check className="h-3 w-3" strokeWidth={3} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {label && (
        <label htmlFor={inputId} className="text-[12px] text-idpxyz-text cursor-pointer select-none">
          {label}
        </label>
      )}
    </div>
  );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

const RadioGroup = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root ref={ref} className={cn('flex flex-col gap-2', className)} {...props} />
));
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & { label?: string }
>(({ className, label, id, ...props }, ref) => {
  const inputId = id || React.useId();
  return (
    <div className="flex items-center gap-2">
      <RadioGroupPrimitive.Item
        ref={ref}
        id={inputId}
        className={cn(
          'h-4 w-4 shrink-0 rounded-full border border-idpxyz-border bg-idpxyz-input',
          'focus:outline-none focus-visible:ring-1 focus-visible:ring-idpxyz-accent/35 focus-visible:ring-offset-0',
          'data-[state=checked]:border-idpxyz-accent',
          'disabled:cursor-not-allowed disabled:opacity-40',
          className
        )}
        {...props}
      >
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          <Circle className="h-2 w-2 fill-idpxyz-accent text-idpxyz-accent" />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
      {label && (
        <label htmlFor={inputId} className="text-[12px] text-idpxyz-text cursor-pointer select-none">
          {label}
        </label>
      )}
    </div>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

const Switch = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> & { label?: string }
>(({ className, label, ...props }, ref) => (
  <div className="flex items-center gap-2">
    <SwitchPrimitive.Root
      ref={ref}
      className={cn(
        'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-idpxyz-accent/35 focus-visible:ring-offset-0',
        'disabled:cursor-not-allowed disabled:opacity-40',
        'data-[state=checked]:bg-idpxyz-accent data-[state=unchecked]:bg-idpxyz-border',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          'pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-transform',
          'data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0'
        )}
      />
    </SwitchPrimitive.Root>
    {label && <span className="text-[12px] text-idpxyz-text select-none">{label}</span>}
  </div>
));
Switch.displayName = SwitchPrimitive.Root.displayName;

export { Checkbox, RadioGroup, RadioGroupItem, Switch };
