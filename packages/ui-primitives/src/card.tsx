'use client';

import * as React from 'react';
import { cn } from '@idpxyz/ui-utils';

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('bg-vscode-sidebar border border-vscode-border rounded-lg', className)} {...props} />
  )
);
Card.displayName = 'Card';

function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-4 py-3 border-b border-vscode-border', className)} {...props} />;
}

function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-sm font-semibold text-vscode-textBright', className)} {...props} />;
}

function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-[11px] text-vscode-textMuted mt-0.5', className)} {...props} />;
}

function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-4 py-3', className)} {...props} />;
}

function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center justify-end gap-2 px-4 py-3 border-t border-vscode-border', className)} {...props} />;
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
    <Card className={cn('p-4', className)}>
      <div className="flex items-start gap-3">
        {icon && <div className="p-2 rounded-md bg-vscode-accent/10 text-vscode-accent shrink-0">{icon}</div>}
        <div className="flex-1 min-w-0">
          <div className="text-[11px] text-vscode-textMuted font-medium">{label}</div>
          <div className="text-xl font-semibold text-vscode-textBright mt-0.5">{value}</div>
          {description && <div className="text-[11px] text-vscode-textMuted mt-1">{description}</div>}
          {trend && (
            <div className={cn('text-[11px] mt-1 font-medium', trend.positive ? 'text-green-400' : 'text-red-400')}>
              {trend.positive ? '↑' : '↓'} {trend.value}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, StatCard };
