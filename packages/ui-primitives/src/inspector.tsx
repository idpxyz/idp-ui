'use client';

import * as React from 'react';
import { useState } from 'react';
import { X, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@idpxyz/ui-utils';

/* ── InspectorShell ──────────────────────────────────────── */

interface InspectorShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function InspectorShell({ className, children, ...props }: InspectorShellProps) {
  return (
    <div className={cn('flex flex-col h-full', className)} {...props}>
      {children}
    </div>
  );
}

/* ── InspectorHeader ─────────────────────────────────────── */

interface InspectorHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  onClose?: () => void;
}

function InspectorHeader({ icon, title, onClose, className, children, ...props }: InspectorHeaderProps) {
  return (
    <div className={cn('px-3 py-2 border-b border-idpxyz-border flex items-center justify-between shrink-0', className)} {...props}>
      <div className="flex items-center gap-1.5 min-w-0">
        {icon && <span className="shrink-0">{icon}</span>}
        <span className="text-[10px] font-semibold uppercase tracking-wider text-idpxyz-textMuted truncate">
          {title}
        </span>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {children}
        {onClose && (
          <button type="button" onClick={onClose} className="p-0.5 rounded hover:bg-idpxyz-hover text-idpxyz-textMuted">
            <X size={12} />
          </button>
        )}
      </div>
    </div>
  );
}

/* ── InspectorBody ───────────────────────────────────────── */

function InspectorBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex-1 overflow-auto p-3 space-y-4', className)} {...props} />;
}

/* ── InspectorSection ────────────────────────────────────── */

interface InspectorSectionProps {
  title: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  children: React.ReactNode;
}

function InspectorSection({ title, icon, defaultOpen = true, className, children }: InspectorSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 w-full text-[10px] font-semibold uppercase tracking-wider text-idpxyz-textMuted hover:text-idpxyz-text mb-1.5"
      >
        {open ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
        {icon && <span className="shrink-0">{icon}</span>}
        {title}
      </button>
      {open && <div className="space-y-1.5 pl-3">{children}</div>}
    </div>
  );
}

/* ── InspectorRow ────────────────────────────────────────── */

interface InspectorRowProps {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
  accent?: boolean;
  className?: string;
}

function InspectorRow({ label, value, mono, accent, className }: InspectorRowProps) {
  return (
    <div className={cn('flex items-baseline justify-between gap-2 text-[10px] py-0.5', className)}>
      <span className="text-idpxyz-textMuted shrink-0">{label}</span>
      <span className={cn(
        'text-right truncate',
        mono ? 'font-mono' : '',
        accent ? 'text-idpxyz-accent' : 'text-idpxyz-text',
      )}>
        {value}
      </span>
    </div>
  );
}

/* ── InspectorActions ────────────────────────────────────── */

function InspectorActions({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex gap-2 mt-2', className)} {...props} />;
}

/* ── InspectorIdentity ───────────────────────────────────── */

interface InspectorIdentityProps {
  title: string;
  subtitle?: string;
  badges?: React.ReactNode;
  className?: string;
}

function InspectorIdentity({ title, subtitle, badges, className }: InspectorIdentityProps) {
  return (
    <div className={className}>
      <h3 className="text-[12px] font-semibold text-idpxyz-text mb-1">{title}</h3>
      <div className="flex items-center gap-1.5 flex-wrap">
        {subtitle && <span className="font-mono text-[10px] text-idpxyz-accent">{subtitle}</span>}
        {badges}
      </div>
    </div>
  );
}

export {
  InspectorShell,
  InspectorHeader,
  InspectorBody,
  InspectorSection,
  InspectorRow,
  InspectorActions,
  InspectorIdentity,
  type InspectorShellProps,
  type InspectorHeaderProps,
  type InspectorSectionProps,
  type InspectorRowProps,
  type InspectorIdentityProps,
};
