import * as React from 'react';
import { cn } from '@idpxyz/ui-utils';

/* ── PageHeader Root ── */
interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional border at the bottom */
  bordered?: boolean;
}

function PageHeader({ bordered = true, className, children, ...props }: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 px-4 py-2.5',
        bordered && 'border-b border-idpxyz-border',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/* ── Left section: title + meta ── */
function PageHeaderContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex min-w-0 flex-1 items-center gap-3', className)} {...props}>
      {children}
    </div>
  );
}

/* ── Title ── */
function PageHeaderTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn('truncate text-[13px] font-semibold text-idpxyz-textBright', className)}
      {...props}
    >
      {children}
    </h2>
  );
}

/* ── Description / subtitle ── */
function PageHeaderDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('truncate text-[11px] text-idpxyz-textMuted', className)} {...props}>
      {children}
    </p>
  );
}

/* ── Right-side action area ── */
function PageHeaderActions({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex shrink-0 items-center gap-1.5', className)} {...props}>
      {children}
    </div>
  );
}

export { PageHeader, PageHeaderContent, PageHeaderTitle, PageHeaderDescription, PageHeaderActions, type PageHeaderProps };
