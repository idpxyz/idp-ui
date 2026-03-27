import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@idpxyz/ui-utils';

const badgeVariants = cva('inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium', {
  variants: {
    variant: {
      default: 'bg-idpxyz-hover text-idpxyz-textMuted',
      success: 'bg-green-500/20 text-green-400',
      warning: 'bg-yellow-500/20 text-yellow-400',
      danger: 'bg-red-500/20 text-red-400',
      info: 'bg-blue-500/20 text-blue-400',
      accent: 'bg-idpxyz-accent/20 text-idpxyz-accent',
      outline: 'border border-idpxyz-border text-idpxyz-textMuted',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
