'use client';

import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { cn } from '@idpxyz/ui-utils';

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
}

function DropdownMenu({ trigger, children, align = 'left' }: DropdownMenuProps) {
  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>{trigger}</DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align={align === 'right' ? 'end' : 'start'}
          sideOffset={4}
          className={cn(
            'z-50 min-w-[160px] rounded-md border border-idpxyz-border bg-idpxyz-sidebar py-1 shadow-xl',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95'
          )}
        >
          {children}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}

interface MenuItemProps extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> {
  destructive?: boolean;
}

const MenuItem = React.forwardRef<React.ComponentRef<typeof DropdownMenuPrimitive.Item>, MenuItemProps>(
  ({ className, destructive, ...props }, ref) => (
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={cn(
        'flex w-full cursor-pointer select-none items-center gap-2 px-3 py-1.5 text-[12px] text-left outline-none transition-colors',
        'focus:bg-idpxyz-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-40',
        destructive ? 'text-red-400 focus:bg-red-500/10' : 'text-idpxyz-text',
        className
      )}
      {...props}
    />
  )
);
MenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

function MenuSeparator({ className, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator className={cn('-mx-1 my-1 h-px bg-idpxyz-border', className)} {...props} />
  );
}

function MenuLabel({ className, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>) {
  return (
    <DropdownMenuPrimitive.Label
      className={cn('px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-idpxyz-textMuted', className)}
      {...props}
    />
  );
}

export { DropdownMenu, MenuItem, MenuSeparator, MenuLabel };
