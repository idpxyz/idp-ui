import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@idpxyz/ui-utils';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Clock,
  MinusCircle,
  type LucideIcon,
} from 'lucide-react';

const statusBadgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium',
  {
    variants: {
      status: {
        success: 'bg-green-500/15 text-green-400',
        warning: 'bg-yellow-500/15 text-yellow-400',
        danger: 'bg-red-500/15 text-red-400',
        info: 'bg-blue-500/15 text-blue-400',
        neutral: 'bg-vscode-hover text-vscode-textMuted',
        pending: 'bg-vscode-hover text-vscode-textMuted',
      },
    },
    defaultVariants: {
      status: 'neutral',
    },
  }
);

const defaultIcons: Record<string, LucideIcon> = {
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: XCircle,
  info: Info,
  neutral: MinusCircle,
  pending: Clock,
};

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  /** Override the default icon for this status */
  icon?: LucideIcon;
  /** Hide the icon */
  hideIcon?: boolean;
}

function StatusBadge({ status, icon, hideIcon = false, className, children, ...props }: StatusBadgeProps) {
  const Icon = icon ?? defaultIcons[status ?? 'neutral'];
  return (
    <span className={cn(statusBadgeVariants({ status }), className)} {...props}>
      {!hideIcon && Icon && <Icon size={11} />}
      {children}
    </span>
  );
}

export { StatusBadge, statusBadgeVariants };
