'use client';

import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { cva, type VariantProps } from 'class-variance-authority';
import { Check, ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import { cn } from '@idpxyz/ui-utils';

const selectTriggerVariants = cva(
  'flex w-full min-w-0 cursor-pointer items-center justify-between gap-1 rounded border border-idpxyz-border bg-idpxyz-inputBg px-2 text-left text-[12px] text-idpxyz-text outline-none transition-[border-color,background-color] focus-visible:border-[#4ea8ff] focus-visible:ring-0 disabled:cursor-not-allowed disabled:border-idpxyz-border/40 disabled:bg-idpxyz-hover/35 disabled:text-idpxyz-textMuted data-[placeholder]:text-idpxyz-textMuted aria-invalid:border-red-400 aria-invalid:focus-visible:border-red-400 [&>span]:min-w-0 [&>span]:truncate',
  {
    variants: {
      size: {
        sm: 'h-6 text-[11px]',
        default: 'h-7 text-[12px]',
        lg: 'h-8 text-[12px]',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> &
    VariantProps<typeof selectTriggerVariants> & { hideIcon?: boolean }
>(({ className, children, size, hideIcon, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(selectTriggerVariants({ size }), className)}
    {...props}
  >
    {children}
    {!hideIcon && (
      <SelectPrimitive.Icon asChild>
        <ChevronsUpDown className="h-3 w-3 shrink-0 text-idpxyz-textMuted" strokeWidth={2} aria-hidden />
      </SelectPrimitive.Icon>
    )}
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      'flex h-6 shrink-0 cursor-default items-center justify-center bg-idpxyz-sidebar text-idpxyz-textMuted',
      className
    )}
    {...props}
  >
    <ChevronUp className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      'flex h-6 shrink-0 cursor-default items-center justify-center bg-idpxyz-sidebar text-idpxyz-textMuted',
      className
    )}
    {...props}
  >
    <ChevronDown className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & {
    position?: 'item-aligned' | 'popper';
  }
>(
  (
    {
      className,
      children,
      position = 'popper',
      sideOffset = 4,
      collisionPadding = 8,
      ...props
    },
    ref
  ) => (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        position={position}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cn(
          'relative z-50 max-h-[min(320px,var(--radix-select-content-available-height))] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border border-idpxyz-border bg-idpxyz-sidebar text-idpxyz-text shadow-lg',
          className
        )}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            'p-1',
            '[scrollbar-width:thin]',
            '[scrollbar-color:var(--idpxyz-scrollbar,rgba(120,120,120,0.45))_transparent]',
            '[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar]:h-1.5',
            '[&::-webkit-scrollbar-track]:bg-transparent',
            '[&::-webkit-scrollbar-thumb]:min-h-[24px] [&::-webkit-scrollbar-thumb]:rounded-full',
            '[&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-solid [&::-webkit-scrollbar-thumb]:border-transparent',
            '[&::-webkit-scrollbar-thumb]:bg-clip-content [&::-webkit-scrollbar-thumb]:bg-[var(--idpxyz-scrollbar,rgba(120,120,120,0.45))]',
            '[&::-webkit-scrollbar-thumb:hover]:border [&::-webkit-scrollbar-thumb:hover]:border-transparent'
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
);
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectItem = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-2 pr-8 text-[12px] leading-snug text-idpxyz-text outline-none',
      'focus:bg-idpxyz-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-40',
      className
    )}
    {...props}
  >
    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-3 w-3 text-idpxyz-accent" strokeWidth={2.5} />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectLabel = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('px-2 py-1.5 text-[11px] font-semibold text-idpxyz-textMuted', className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectSeparator = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-idpxyz-border', className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  selectTriggerVariants,
};
