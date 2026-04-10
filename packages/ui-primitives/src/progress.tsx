'use client';

import { cn } from '@idpxyz/ui-utils';
import { Loader2 } from 'lucide-react';

interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  className?: string;
}

function Progress({ value, max = 100, size = 'md', variant = 'default', showLabel, className }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const heightMap = { sm: 'h-1', md: 'h-2', lg: 'h-3' };
  const colorMap = {
    default: 'bg-idpxyz-accent',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn('w-full bg-idpxyz-border/50 rounded-full overflow-hidden', heightMap[size])}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', colorMap[variant])}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-[11px] text-idpxyz-textMuted text-right">{Math.round(pct)}%</div>
      )}
    </div>
  );
}

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeMap = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
  return <Loader2 className={cn('animate-spin text-idpxyz-textMuted', sizeMap[size], className)} />;
}

export { Progress, Spinner };
