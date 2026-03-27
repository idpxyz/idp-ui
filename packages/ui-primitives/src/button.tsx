import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@idpxyz/ui-utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 rounded text-[12px] transition-colors disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-idpxyz-accent/35 focus-visible:ring-offset-0',
  {
    variants: {
      variant: {
        default: 'bg-idpxyz-accent/20 text-idpxyz-accent hover:bg-idpxyz-accent/30',
        secondary: 'bg-idpxyz-hover text-idpxyz-textMuted hover:text-idpxyz-text',
        ghost: 'text-idpxyz-textMuted hover:bg-idpxyz-hover hover:text-idpxyz-text',
        outline: 'border border-idpxyz-border bg-transparent text-idpxyz-textMuted hover:bg-idpxyz-hover hover:text-idpxyz-text',
        danger: 'bg-red-500/20 text-red-400 hover:bg-red-500/30',
      },
      size: {
        sm: 'h-6 px-2 text-[11px]',
        default: 'h-7 px-2.5',
        lg: 'h-8 px-3',
        icon: 'h-7 w-7 p-0',
      },
    },
    defaultVariants: {
      variant: 'secondary',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
