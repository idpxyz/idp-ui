'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@idpxyz/ui-utils';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

const alertVariants = cva(
  'flex items-start gap-3 px-4 py-3 rounded-md border text-[12px]',
  {
    variants: {
      variant: {
        info: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
        success: 'bg-green-500/10 border-green-500/30 text-green-300',
        warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300',
        error: 'bg-red-500/10 border-red-500/30 text-red-300',
      },
    },
    defaultVariants: { variant: 'info' },
  }
);

const iconMap = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
};

interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  title?: string;
  onDismiss?: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'info', title, onDismiss, children, ...props }, ref) => {
    const Icon = iconMap[variant!];
    return (
      <div ref={ref} role="alert" className={cn(alertVariants({ variant, className }))} {...props}>
        <Icon size={16} className="shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          {title && <div className="font-semibold mb-0.5">{title}</div>}
          <div className="opacity-90">{children}</div>
        </div>
        {onDismiss && (
          <button onClick={onDismiss} className="shrink-0 p-0.5 rounded hover:opacity-70" aria-label="Dismiss">
            <X size={14} />
          </button>
        )}
      </div>
    );
  }
);
Alert.displayName = 'Alert';

export { Alert, alertVariants };
