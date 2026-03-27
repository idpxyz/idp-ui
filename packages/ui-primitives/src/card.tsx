'use client';

import * as React from 'react';
import { cn } from '@idpxyz/ui-utils';

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('bg-idpxyz-sidebar border border-idpxyz-border rounded-lg shadow-sm hover:shadow-md transition-shadow', className)} {...props} />
  )
);
Card.displayName = 'Card';

function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-4 py-3 border-b border-idpxyz-border', className)} {...props} />;
}

function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-sm font-semibold text-idpxyz-textBright', className)} {...props} />;
}

function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-[11px] text-idpxyz-textMuted mt-0.5', className)} {...props} />;
}

function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-4 py-3', className)} {...props} />;
}

function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center justify-end gap-2 px-4 py-3 border-t border-idpxyz-border', className)} {...props} />;
}

interface StatCardProps {
  label: string;
  value: string | number;
  description?: string;
  trend?: { value: string; positive?: boolean };
  icon?: React.ReactNode;
  className?: string;
}

function StatCard({ label, value, description, trend, icon, className }: StatCardProps) {
  return (
    <Card className={cn('p-5 hover:border-idpxyz-accent/30', className)}>
      <div className="flex items-start gap-4">
        {icon && <div className="p-2.5 rounded-xl bg-idpxyz-accent/10 text-idpxyz-accent shrink-0">{icon}</div>}
        <div className="flex-1 min-w-0">
          <div className="text-[11px] text-idpxyz-textMuted font-medium uppercase tracking-wider">{label}</div>
          <div className="text-2xl font-bold text-idpxyz-textBright mt-1">{value}</div>
          {description && <div className="text-[12px] text-idpxyz-textMuted mt-1.5">{description}</div>}
          {trend && (
            <div className={cn(
              'inline-flex items-center gap-1 text-[11px] mt-2 font-semibold px-2 py-0.5 rounded-full',
              trend.positive ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'
            )}>
              {trend.positive ? '↑' : '↓'} {trend.value}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, StatCard };
