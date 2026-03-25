'use client';

import * as React from 'react';
import { cn } from '@idpxyz/ui-utils';
import { X } from 'lucide-react';

interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: 'left' | 'right';
  children: React.ReactNode;
}

function Drawer({ open, onOpenChange, side = 'right', children }: DrawerProps) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);

  if (!open) return null;

  const slideClass = side === 'right'
    ? 'right-0 animate-in slide-in-from-right'
    : 'left-0 animate-in slide-in-from-left';

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div
        className="fixed inset-0 bg-black/40"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      <div className={cn('fixed top-0 bottom-0 w-96 max-w-[85vw] bg-vscode-sidebar border-l border-vscode-border shadow-xl flex flex-col', slideClass)}>
        {children}
      </div>
    </div>
  );
}

function DrawerHeader({ className, children, onClose, ...props }: React.HTMLAttributes<HTMLDivElement> & { onClose?: () => void }) {
  return (
    <div className={cn('flex items-center justify-between px-4 py-3 border-b border-vscode-border shrink-0', className)} {...props}>
      <div className="flex-1">{children}</div>
      {onClose && (
        <button onClick={onClose} className="p-1 rounded hover:bg-vscode-hover text-vscode-textMuted" aria-label="Close">
          <X size={16} />
        </button>
      )}
    </div>
  );
}

function DrawerBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex-1 overflow-auto px-4 py-3', className)} {...props} />;
}

function DrawerFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center justify-end gap-2 px-4 py-3 border-t border-vscode-border shrink-0', className)} {...props} />;
}

export { Drawer, DrawerHeader, DrawerBody, DrawerFooter };
