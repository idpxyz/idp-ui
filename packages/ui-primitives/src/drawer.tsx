'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@idpxyz/ui-utils';

interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: 'left' | 'right';
  children: React.ReactNode;
}

function Drawer({ open, onOpenChange, side = 'right', children }: DrawerProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            'fixed inset-0 z-50 bg-black/40',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            'fixed z-50 flex flex-col bg-idpxyz-sidebar border-idpxyz-border shadow-xl outline-none focus:outline-none',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            side === 'right'
              ? 'right-0 top-0 h-full w-96 max-w-[85vw] border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right'
              : 'left-0 top-0 h-full w-96 max-w-[85vw] border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left'
          )}
        >
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function DrawerHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center justify-between px-4 py-3 border-b border-idpxyz-border shrink-0', className)} {...props}>
      <div className="flex-1">{children}</div>
      <DialogPrimitive.Close className="p-1 rounded hover:bg-idpxyz-hover text-idpxyz-textMuted" aria-label="Close">
        <X size={16} />
      </DialogPrimitive.Close>
    </div>
  );
}

function DrawerBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex-1 overflow-auto px-4 py-3', className)} {...props} />;
}

function DrawerFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center justify-end gap-2 px-4 py-3 border-t border-idpxyz-border shrink-0', className)} {...props} />;
}

export { Drawer, DrawerHeader, DrawerBody, DrawerFooter };
