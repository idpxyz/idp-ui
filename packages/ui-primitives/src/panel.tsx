'use client';

import * as React from 'react';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@idpxyz/ui-utils';
import { Badge } from './badge';

/* ── PanelShell ──────────────────────────────────────────── */

interface PanelShellProps extends React.HTMLAttributes<HTMLDivElement> {
  height: number;
  visible?: boolean;
}

function PanelShell({ height, visible = true, className, children, ...props }: PanelShellProps) {
  if (!visible) return null;
  return (
    <div
      className={cn('bg-idpxyz-panelBg flex flex-col shrink-0 select-none', className)}
      style={{ height }}
      {...props}
    >
      {children}
    </div>
  );
}

/* ── PanelTabBar ─────────────────────────────────────────── */

interface PanelTabBarProps extends React.HTMLAttributes<HTMLDivElement> {
  maximized?: boolean;
  onMaximize?: () => void;
  onClose?: () => void;
}

function PanelTabBar({ maximized, onMaximize, onClose, className, children, ...props }: PanelTabBarProps) {
  return (
    <div className={cn('flex items-center justify-between h-[35px] border-b border-idpxyz-border shrink-0', className)} {...props}>
      <div className="flex items-center h-full">{children}</div>
      <div className="flex items-center gap-0.5 pr-2">
        {onMaximize && (
          <button
            type="button"
            onClick={onMaximize}
            className="p-1 rounded hover:bg-idpxyz-hover text-idpxyz-textMuted"
            title={maximized ? 'Restore' : 'Maximize'}
          >
            {maximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        )}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-idpxyz-hover text-idpxyz-textMuted"
            title="Close"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

/* ── PanelTab ────────────────────────────────────────────── */

interface PanelTabProps {
  active?: boolean;
  icon?: React.ReactNode;
  label: string;
  badge?: number;
  onClick?: () => void;
  className?: string;
}

function PanelTab({ active, icon, label, badge, onClick, className }: PanelTabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'h-full flex items-center gap-1.5 px-3 text-[11px] uppercase tracking-wide border-b-2 transition-colors',
        active
          ? 'text-idpxyz-text border-b-idpxyz-accent'
          : 'text-idpxyz-textMuted border-transparent hover:text-idpxyz-text',
        className,
      )}
    >
      {icon}
      {label}
      {badge != null && badge > 0 && <Badge>{badge}</Badge>}
    </button>
  );
}

/* ── PanelContent ────────────────────────────────────────── */

function PanelContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex-1 overflow-auto p-3', className)} {...props} />;
}

export {
  PanelShell,
  PanelTabBar,
  PanelTab,
  PanelContent,
  type PanelShellProps,
  type PanelTabBarProps,
  type PanelTabProps,
};
