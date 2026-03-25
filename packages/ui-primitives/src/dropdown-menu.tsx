'use client';

import * as React from 'react';
import { cn } from '@idpxyz/ui-utils';

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
}

function DropdownMenu({ trigger, children, align = 'left' }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block">
      <div onClick={() => setOpen(!open)} role="button" aria-expanded={open} aria-haspopup="menu">
        {trigger}
      </div>
      {open && (
        <div
          role="menu"
          className={cn(
            'absolute z-50 mt-1 min-w-[160px] py-1 bg-vscode-sidebar border border-vscode-border rounded-md shadow-xl',
            'animate-in fade-in zoom-in-95',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {React.Children.map(children, (child) =>
            React.isValidElement(child) ? React.cloneElement(child as React.ReactElement<{ onClose?: () => void }>, { onClose: () => setOpen(false) }) : child
          )}
        </div>
      )}
    </div>
  );
}

interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  destructive?: boolean;
  onClose?: () => void;
}

const MenuItem = React.forwardRef<HTMLButtonElement, MenuItemProps>(
  ({ className, destructive, onClick, onClose, children, ...props }, ref) => (
    <button
      ref={ref}
      role="menuitem"
      className={cn(
        'flex w-full items-center gap-2 px-3 py-1.5 text-[12px] text-left transition-colors',
        destructive
          ? 'text-red-400 hover:bg-red-500/10'
          : 'text-vscode-text hover:bg-vscode-hover',
        'disabled:opacity-40 disabled:pointer-events-none',
        className
      )}
      onClick={(e) => { onClick?.(e); onClose?.(); }}
      {...props}
    >
      {children}
    </button>
  )
);
MenuItem.displayName = 'MenuItem';

function MenuSeparator() {
  return <div className="my-1 border-t border-vscode-border" role="separator" />;
}

function MenuLabel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-vscode-textMuted', className)} {...props} />;
}

export { DropdownMenu, MenuItem, MenuSeparator, MenuLabel };
